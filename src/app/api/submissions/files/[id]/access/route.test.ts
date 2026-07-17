import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SubmissionFile } from "@/lib/assignments";

const FILE_ID = "6ac1038b-528e-428f-81a8-d6ce88b52e18";
const STORAGE_PATH =
  "positioning-convergence/f3cee3f0-13cf-4e21-8380-f101e38048fb/2223c8612a7ad06e--_-.png";

const mockAuthorize = vi.fn();
const createSignedUrl = vi.fn();

vi.mock("@/lib/submission-files", () => ({
  authorizeSubmissionFile: (id: string) => mockAuthorize(id),
}));

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    storage: { from: () => ({ createSignedUrl }) },
  }),
}));

const { GET } = await import("./route");

function file(overrides: Partial<SubmissionFile> = {}): SubmissionFile {
  return {
    id: FILE_ID,
    filename: "定位收斂器-定位卡-方形.png",
    size_bytes: 177680,
    mime_type: "image/png",
    storage_path: STORAGE_PATH,
    ...overrides,
  };
}

const ctx = { params: Promise.resolve({ id: FILE_ID }) };
const req = new Request(
  `https://www.solo.tw/api/submissions/files/${FILE_ID}/access`,
);

beforeEach(() => {
  mockAuthorize.mockReset();
  createSignedUrl.mockReset().mockResolvedValue({
    data: { signedUrl: "https://storage.example/signed" },
    error: null,
  });
});

describe("GET /api/submissions/files/[id]/access", () => {
  it("signs a short-lived URL for an authorized viewer", async () => {
    mockAuthorize.mockResolvedValue({ ok: true, file: file() });

    const res = await GET(req, ctx);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ url: "https://storage.example/signed" });

    const [path, ttl] = createSignedUrl.mock.calls[0];
    expect(path).toBe(STORAGE_PATH);
    expect(ttl).toBeLessThanOrEqual(300);
  });

  it("passes the requested id through to authorization unchanged", async () => {
    mockAuthorize.mockResolvedValue({ ok: true, file: file() });
    await GET(req, ctx);
    expect(mockAuthorize).toHaveBeenCalledWith(FILE_ID);
  });

  it("denies another student's attachment, revealing nothing about it", async () => {
    mockAuthorize.mockResolvedValue({ ok: false, status: 403 });

    const res = await GET(req, ctx);
    const raw = await res.text();

    expect(res.status).toBe(403);
    // Not the URL, not the path, not even the filename: a student probing an id
    // learns only that they were refused.
    expect(raw).not.toContain("http");
    expect(raw).not.toContain("storage_path");
    expect(raw).not.toContain("positioning-convergence");
    expect(raw).not.toContain("定位收斂器");
    expect(createSignedUrl).not.toHaveBeenCalled();
  });

  it("denies a request with neither a student session nor teaching permission", async () => {
    mockAuthorize.mockResolvedValue({ ok: false, status: 401 });

    const res = await GET(req, ctx);
    const raw = await res.text();

    expect(res.status).toBe(401);
    expect(raw).not.toContain("http");
    expect(createSignedUrl).not.toHaveBeenCalled();
  });

  it("denies an unknown attachment", async () => {
    mockAuthorize.mockResolvedValue({ ok: false, status: 404 });

    const res = await GET(req, ctx);

    expect(res.status).toBe(404);
    expect(createSignedUrl).not.toHaveBeenCalled();
  });

  it("surfaces a signing failure rather than a broken URL", async () => {
    mockAuthorize.mockResolvedValue({ ok: true, file: file() });
    createSignedUrl.mockResolvedValue({ data: null, error: { message: "boom" } });

    const res = await GET(req, ctx);

    expect(res.status).toBe(500);
    expect(await res.text()).not.toContain("http");
  });
});
