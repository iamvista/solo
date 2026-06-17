import { describe, it, expect } from "vitest";
import { validateWaitlistPayload } from "./waitlist";

const base = {
  course_slug: "vibe-coding",
  instructor_slug: "vista",
  name: "測試",
  email: "test@test.tw",
};

describe("validateWaitlistPayload", () => {
  it("accepts a minimal valid payload without phone", () => {
    const r = validateWaitlistPayload(base);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.email).toBe("test@test.tw");
      expect(r.value.phone).toBeNull();
    }
  });

  it("lowercases & trims email", () => {
    const r = validateWaitlistPayload({ ...base, email: "  Test@Test.TW " });
    expect(r.ok && r.value.email).toBe("test@test.tw");
  });

  it("rejects missing course_slug", () => {
    const r = validateWaitlistPayload({ ...base, course_slug: "" });
    expect(r.ok).toBe(false);
  });

  it("rejects missing name", () => {
    const r = validateWaitlistPayload({ ...base, name: "  " });
    expect(r.ok).toBe(false);
  });

  it("rejects bad email", () => {
    const r = validateWaitlistPayload({ ...base, email: "nope" });
    expect(r.ok).toBe(false);
  });

  it("accepts a valid TW mobile", () => {
    const r = validateWaitlistPayload({ ...base, phone: "0912345678" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.phone).toBe("0912345678");
  });

  it("rejects an incomplete phone", () => {
    const r = validateWaitlistPayload({ ...base, phone: "091234567" });
    expect(r.ok).toBe(false);
  });

  it("treats empty phone string as no phone (valid)", () => {
    const r = validateWaitlistPayload({ ...base, phone: "   " });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.phone).toBeNull();
  });

  it("defaults instructor_slug & source_page to null when absent", () => {
    const r = validateWaitlistPayload({
      course_slug: "x",
      name: "n",
      email: "a@b.tw",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.instructor_slug).toBeNull();
      expect(r.value.source_page).toBeNull();
    }
  });
});
