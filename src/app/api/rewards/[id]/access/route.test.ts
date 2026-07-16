import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Reward } from "@/lib/rewards";

const REWARD_ID = "r1";

const mockAuthorize = vi.fn();
const createSignedUrl = vi.fn();

vi.mock("@/lib/rewards", async () => {
  const actual = await vi.importActual<typeof import("@/lib/rewards")>(
    "@/lib/rewards",
  );
  return { ...actual, authorizeReward: (id: string) => mockAuthorize(id) };
});

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    storage: { from: () => ({ createSignedUrl }) },
  }),
}));

const { GET } = await import("./route");

function reward(overrides: Partial<Reward> = {}): Reward {
  return {
    id: REWARD_ID,
    assignment_id: "a1",
    kind: "video",
    title: "課程回放",
    description: null,
    video_url: "https://youtu.be/abc123",
    storage_path: null,
    external_url: null,
    body_text: null,
    file_name: null,
    sort_order: 0,
    ...overrides,
  };
}

const ctx = { params: Promise.resolve({ id: REWARD_ID }) };
const req = new Request("https://www.solo.tw/api/rewards/r1/access");

beforeEach(() => {
  mockAuthorize.mockReset();
  createSignedUrl.mockReset().mockResolvedValue({
    data: { signedUrl: "https://storage.example/signed" },
    error: null,
  });
});

describe("GET /api/rewards/[id]/access", () => {
  it("returns the replay URL for a video reward", async () => {
    mockAuthorize.mockResolvedValue({ ok: true, reward: reward() });

    const res = await GET(req, ctx);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ kind: "video", url: "https://youtu.be/abc123" });
  });

  it("returns the booking URL for a link reward", async () => {
    mockAuthorize.mockResolvedValue({
      ok: true,
      reward: reward({
        kind: "link",
        video_url: null,
        external_url: "https://cal.com/vista/1on1",
      }),
    });

    const body = await (await GET(req, ctx)).json();
    expect(body).toEqual({ kind: "link", url: "https://cal.com/vista/1on1" });
  });

  it("signs a short-lived URL for a handout", async () => {
    mockAuthorize.mockResolvedValue({
      ok: true,
      reward: reward({
        kind: "file",
        video_url: null,
        storage_path: "rewards/course-x/handout.pdf",
      }),
    });

    const body = await (await GET(req, ctx)).json();

    expect(body).toEqual({ kind: "file", url: "https://storage.example/signed" });
    const [path, ttl] = createSignedUrl.mock.calls[0];
    expect(path).toBe("rewards/course-x/handout.pdf");
    expect(ttl).toBeLessThanOrEqual(300);
  });

  it("returns the passage for a text reward", async () => {
    mockAuthorize.mockResolvedValue({
      ok: true,
      reward: reward({
        kind: "text",
        video_url: null,
        body_text: "交完了，這是給你的補充說明。\n第二段。",
      }),
    });

    const body = await (await GET(req, ctx)).json();

    expect(body).toEqual({
      kind: "text",
      body: "交完了，這是給你的補充說明。\n第二段。",
    });
    expect(createSignedUrl).not.toHaveBeenCalled();
  });

  it("refuses a text reward with no body", async () => {
    mockAuthorize.mockResolvedValue({
      ok: true,
      reward: reward({ kind: "text", video_url: null, body_text: null }),
    });
    expect((await GET(req, ctx)).status).toBe(500);
  });

  it("denies a student who has not submitted, revealing nothing", async () => {
    mockAuthorize.mockResolvedValue({ ok: false, status: 403 });

    const res = await GET(req, ctx);
    const raw = await res.text();

    expect(res.status).toBe(403);
    expect(raw).not.toContain("http");
    expect(raw).not.toContain("storage_path");
    expect(raw).not.toContain("rewards/");
    expect(createSignedUrl).not.toHaveBeenCalled();
  });

  it("denies a request with no session", async () => {
    mockAuthorize.mockResolvedValue({ ok: false, status: 401 });
    const res = await GET(req, ctx);
    expect(res.status).toBe(401);
    expect(await res.text()).not.toContain("http");
  });

  it("denies an unknown reward", async () => {
    mockAuthorize.mockResolvedValue({ ok: false, status: 404 });
    expect((await GET(req, ctx)).status).toBe(404);
  });

  it("surfaces a signing failure rather than a broken URL", async () => {
    mockAuthorize.mockResolvedValue({
      ok: true,
      reward: reward({ kind: "file", video_url: null, storage_path: "x.pdf" }),
    });
    createSignedUrl.mockResolvedValue({ data: null, error: { message: "boom" } });

    expect((await GET(req, ctx)).status).toBe(500);
  });

  it("refuses a row whose payload does not match its kind", async () => {
    // Unreachable while the database check constraint holds, but returning a
    // null URL would be worse than saying the row is broken.
    mockAuthorize.mockResolvedValue({
      ok: true,
      reward: reward({ kind: "video", video_url: null }),
    });

    expect((await GET(req, ctx)).status).toBe(500);
  });
});
