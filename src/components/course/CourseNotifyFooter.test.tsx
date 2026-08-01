import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import type { Workshop } from "@/lib/workshops";

const getWorkshopBySlug = vi.fn();
vi.mock("@/lib/workshops", () => ({
  getWorkshopBySlug: (slug: string) => getWorkshopBySlug(slug),
}));

import { CourseNotifyFooter } from "./CourseNotifyFooter";

const TITLE = "AI 賦能學術研究與寫作工作坊";

// 元件只讀 id / title / status / instructor.slug，其餘欄位與本測試無關
function workshopWithStatus(status: Workshop["status"]) {
  return {
    id: "ai-academic-writing",
    title: TITLE,
    status,
    instructor: { slug: "vista" },
  } as unknown as Workshop;
}

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
  getWorkshopBySlug.mockReturnValue(workshopWithStatus("open"));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  fetchMock.mockReset();
  getWorkshopBySlug.mockReset();
});

async function submit() {
  fireEvent.change(screen.getByLabelText("姓名"), {
    target: { value: "王小明" },
  });
  fireEvent.change(screen.getByLabelText("E-mail"), {
    target: { value: "a@b.tw" },
  });
  fireEvent.submit(screen.getByLabelText("E-mail").closest("form")!);
  await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
  return JSON.parse(fetchMock.mock.calls[0][1].body as string);
}

describe("Course sales pages expose a footer notification block", () => {
  it("renders the form already expanded, with no click required", () => {
    render(<CourseNotifyFooter slug="ai-academic-writing" />);
    // 上方入口要先點連結才有表單；頁尾入口不必
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("姓名")).toBeInTheDocument();
  });

  it("resolves the course title from the shared lookup rather than a prop", () => {
    render(<CourseNotifyFooter slug="ai-academic-writing" />);
    expect(getWorkshopBySlug).toHaveBeenCalledWith("ai-academic-writing");
    expect(screen.getByText(`《${TITLE}》下次開課通知我`)).toBeInTheDocument();
  });
});

describe("The footer entry derives its intent from course status", () => {
  it("derives full_waitlist and frames the form as joining the waitlist", async () => {
    getWorkshopBySlug.mockReturnValue(workshopWithStatus("full"));
    render(<CourseNotifyFooter slug="ai-academic-writing" />);
    expect(screen.getByText("📬 這期已經額滿？")).toBeInTheDocument();
    expect(screen.getByText(`《${TITLE}》有名額就通知我`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "加入候補" })).toBeInTheDocument();
    expect((await submit()).intent).toBe("full_waitlist");
  });

  it.each(["open", "filling", "ended"] as const)(
    "derives date_conflict and asks about the date for status %s",
    async (status) => {
      getWorkshopBySlug.mockReturnValue(workshopWithStatus(status));
      render(<CourseNotifyFooter slug="ai-academic-writing" />);
      expect(screen.getByText("📬 這期時間對不上？")).toBeInTheDocument();
      expect(screen.getByText(`《${TITLE}》下次開課通知我`)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "通知我下次開課" }),
      ).toBeInTheDocument();
      expect((await submit()).intent).toBe("date_conflict");
    },
  );

  it("does not describe an unannounced course as a date conflict", async () => {
    getWorkshopBySlug.mockReturnValue(workshopWithStatus("coming_soon"));
    render(<CourseNotifyFooter slug="ai-academic-writing" />);
    // 日期都還沒公告，問「時間對不上」等於問一個不存在的日期
    expect(screen.queryByText("📬 這期時間對不上？")).not.toBeInTheDocument();
    expect(screen.getByText("📬 還沒公告開課日期？")).toBeInTheDocument();
    expect(
      screen.getByText("留下 E-mail，日期一公告就第一時間通知你。"),
    ).toBeInTheDocument();
    // intent 仍是 date_conflict：不新增第四種 intent，資料庫約束不動
    expect((await submit()).intent).toBe("date_conflict");
  });

  it("does not describe an announced course as unannounced", async () => {
    getWorkshopBySlug.mockReturnValue({
      ...workshopWithStatus("coming_soon"),
      sortDate: "2026-10-18",
    });
    render(<CourseNotifyFooter slug="ai-academic-writing" />);
    // 日期公告了、只是報名還沒開放；說「還沒公告日期」與讀者上一段剛看過的日期互相打臉
    expect(screen.queryByText("📬 還沒公告開課日期？")).not.toBeInTheDocument();
    expect(screen.getByText("📬 報名還沒開放？")).toBeInTheDocument();
    expect(
      screen.getByText("留下 E-mail，開放報名時第一批通知你。"),
    ).toBeInTheDocument();
    expect((await submit()).intent).toBe("date_conflict");
  });
});

describe("The footer entry is attributable separately from the entry above it", () => {
  it("submits a source_page that marks the footer entry", async () => {
    render(<CourseNotifyFooter slug="ai-academic-writing" />);
    const body = await submit();
    // 上方入口送的是 /courses/ai-academic-writing，兩者必須分得開
    expect(body.source_page).toBe("/courses/ai-academic-writing#footer");
    expect(body.course_slug).toBe("ai-academic-writing");
    expect(body.instructor_slug).toBe("vista");
  });
});

describe("An unresolvable course slug fails loudly in development and degrades silently in production", () => {
  it("raises in development, naming the slug", () => {
    vi.stubEnv("NODE_ENV", "development");
    getWorkshopBySlug.mockReturnValue(undefined);
    expect(() => render(<CourseNotifyFooter slug="no-such-course" />)).toThrow(
      /no-such-course/,
    );
  });

  it("renders nothing in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    getWorkshopBySlug.mockReturnValue(undefined);
    const { container } = render(<CourseNotifyFooter slug="no-such-course" />);
    expect(container).toBeEmptyDOMElement();
  });
});
