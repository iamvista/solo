import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { NextCohortNotify } from "./NextCohortNotify";
import type { Workshop } from "@/lib/workshops";

const LINK_TEXT = /這個時間無法參加/;

function setup(status: Workshop["status"], sourcePage = "/courses/ai-content") {
  return render(
    <NextCohortNotify
      courseSlug="ai-content"
      courseTitle="AI 內容產製系統工作坊"
      status={status}
      sourcePage={sourcePage}
      instructorSlug="vista"
    />,
  );
}

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({ ok: true }),
  });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("entry style by course status", () => {
  it.each(["open", "filling"] as const)(
    "%s shows a secondary text link, not an expanded form",
    (status) => {
      setup(status);
      expect(screen.getByText(LINK_TEXT)).toBeInTheDocument();
      expect(screen.queryByLabelText("E-mail")).not.toBeInTheDocument();
    },
  );

  it("full shows the form directly as the primary action", () => {
    setup("full");
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.queryByText(LINK_TEXT)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "加入候補" }),
    ).toBeInTheDocument();
  });

  it.each(["coming_soon", "ended"] as const)(
    "%s keeps the existing button entry",
    (status) => {
      setup(status);
      expect(
        screen.getByRole("button", { name: "通知我下一梯" }),
      ).toBeInTheDocument();
      expect(screen.queryByLabelText("E-mail")).not.toBeInTheDocument();
    },
  );

  it("reveals the form on demand for a course with seats", () => {
    setup("open");
    fireEvent.click(screen.getByText(LINK_TEXT));
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "通知我下次開課" }),
    ).toBeInTheDocument();
  });
});

describe("submitted payload", () => {
  async function submitFrom(
    status: Workshop["status"],
    sourcePage = "/courses/ai-content",
  ) {
    setup(status, sourcePage);
    if (status !== "full") {
      const trigger =
        screen.queryByText(LINK_TEXT) ??
        screen.getByRole("button", { name: "通知我下一梯" });
      fireEvent.click(trigger);
    }
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

  it.each([
    ["full", "full_waitlist"],
    ["open", "date_conflict"],
    ["filling", "date_conflict"],
    ["coming_soon", "date_conflict"],
    ["ended", "date_conflict"],
  ] as const)("status %s submits intent %s", async (status, intent) => {
    const body = await submitFrom(status);
    expect(body.intent).toBe(intent);
  });

  it("submits the source page it was given", async () => {
    const body = await submitFrom("open", "/courses/vibe-coding");
    expect(body.source_page).toBe("/courses/vibe-coding");
    expect(body.course_slug).toBe("ai-content");
  });

  it("does not send a honeypot field outside the ad landing page", async () => {
    const body = await submitFrom("open");
    expect(body).not.toHaveProperty("company_website");
  });
});
