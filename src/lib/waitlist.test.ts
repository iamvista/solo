import { describe, it, expect } from "vitest";
import {
  validateWaitlistPayload,
  isHoneypotTriggered,
  HONEYPOT_FIELD,
} from "./waitlist";

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

  it("defaults intent to full_waitlist when absent", () => {
    const r = validateWaitlistPayload(base);
    expect(r.ok && r.value.intent).toBe("full_waitlist");
  });

  it.each(["full_waitlist", "date_conflict", "ad_lead"])(
    "accepts intent %s",
    (intent) => {
      const r = validateWaitlistPayload({ ...base, intent });
      expect(r.ok && r.value.intent).toBe(intent);
    },
  );

  it("rejects an unknown intent", () => {
    const r = validateWaitlistPayload({ ...base, intent: "vip" });
    expect(r.ok).toBe(false);
  });

  it("captures utm fields when present", () => {
    const r = validateWaitlistPayload({
      ...base,
      utm: {
        source: "facebook",
        medium: "paid",
        campaign: "aiaw-phase1",
        content: "variant-b",
      },
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.utm_source).toBe("facebook");
      expect(r.value.utm_campaign).toBe("aiaw-phase1");
      expect(r.value.utm_content).toBe("variant-b");
    }
  });

  it("nulls utm fields when the utm object is absent", () => {
    const r = validateWaitlistPayload(base);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.utm_source).toBeNull();
      expect(r.value.utm_medium).toBeNull();
      expect(r.value.utm_campaign).toBeNull();
      expect(r.value.utm_content).toBeNull();
    }
  });

  it("truncates over-long utm values rather than rejecting them", () => {
    const r = validateWaitlistPayload({
      ...base,
      utm: { campaign: "x".repeat(500) },
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.utm_campaign).toHaveLength(200);
  });
});

describe("isHoneypotTriggered", () => {
  it("is false when the field is absent", () => {
    expect(isHoneypotTriggered({ name: "n" })).toBe(false);
  });

  it("is false when the field is present but blank", () => {
    expect(isHoneypotTriggered({ [HONEYPOT_FIELD]: "   " })).toBe(false);
  });

  it("is true when a bot fills the field", () => {
    expect(isHoneypotTriggered({ [HONEYPOT_FIELD]: "https://spam.example" })).toBe(
      true,
    );
  });
});
