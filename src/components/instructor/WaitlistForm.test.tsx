import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { WaitlistForm } from "./WaitlistForm";
import { HONEYPOT_FIELD } from "@/lib/waitlist";

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

function renderAdLanding() {
  const { container } = render(
    <WaitlistForm
      courseSlug="ai-content"
      courseTitle="AI 內容產製系統工作坊"
      intent="ad_lead"
      sourcePage="/courses/ai-content/notify"
      utm={{ source: "facebook", medium: "paid", campaign: "aiaw-phase1" }}
      withHoneypot
    />,
  );
  return container;
}

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

describe("WaitlistForm on the ad landing page", () => {
  it("renders a honeypot field hidden from sighted users and assistive tech", () => {
    const container = renderAdLanding();
    const pot = container.querySelector(`input[name="${HONEYPOT_FIELD}"]`);
    expect(pot).toBeTruthy();
    expect(pot!.getAttribute("aria-hidden")).toBe("true");
    expect(pot!.getAttribute("tabindex")).toBe("-1");
    // 視覺上移出畫面，而非 display:none（部分機器人會略過 display:none）
    expect(pot!.className).toContain("left-[-9999px]");
  });

  it("submits ad_lead intent with utm attribution and an empty honeypot", async () => {
    renderAdLanding();
    const body = await submit();
    expect(body.intent).toBe("ad_lead");
    expect(body.source_page).toBe("/courses/ai-content/notify");
    expect(body.utm).toEqual({
      source: "facebook",
      medium: "paid",
      campaign: "aiaw-phase1",
    });
    expect(body[HONEYPOT_FIELD]).toBe("");
  });

  it("sends the honeypot value when a bot fills every field", async () => {
    const container = renderAdLanding();
    const pot = container.querySelector(
      `input[name="${HONEYPOT_FIELD}"]`,
    ) as HTMLInputElement;
    fireEvent.change(pot, { target: { value: "https://spam.example" } });
    const body = await submit();
    expect(body[HONEYPOT_FIELD]).toBe("https://spam.example");
  });

  it("omits the honeypot entirely when not requested", async () => {
    render(
      <WaitlistForm
        courseSlug="ai-content"
        courseTitle="AI 內容產製系統工作坊"
        intent="date_conflict"
        sourcePage="/courses/ai-content"
      />,
    );
    const body = await submit();
    expect(body).not.toHaveProperty(HONEYPOT_FIELD);
  });

  it("requires name and email before calling the api", () => {
    renderAdLanding();
    fireEvent.submit(screen.getByLabelText("E-mail").closest("form")!);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText("姓名與 E-mail 為必填")).toBeInTheDocument();
  });
});
