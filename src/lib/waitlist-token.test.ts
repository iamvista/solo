import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createHmac } from "crypto";

const WAITLIST_SECRET = "w".repeat(32);
const NEWSLETTER_SECRET = "n".repeat(32);
const ROW_ID = "3f2504e0-4f89-11d3-9a0c-0305e82c3301";

let generateWaitlistToken: (id: string) => string;
let verifyWaitlistToken: (token: string) => string | null;

beforeEach(async () => {
  process.env.WAITLIST_TOKEN_SECRET = WAITLIST_SECRET;
  process.env.NEWSLETTER_UNSUBSCRIBE_SECRET = NEWSLETTER_SECRET;
  const mod = await import("./waitlist-token");
  generateWaitlistToken = mod.generateWaitlistToken;
  verifyWaitlistToken = mod.verifyWaitlistToken;
});

afterEach(() => {
  delete process.env.WAITLIST_TOKEN_SECRET;
});

describe("waitlist token", () => {
  it("round-trips the row id", () => {
    expect(verifyWaitlistToken(generateWaitlistToken(ROW_ID))).toBe(ROW_ID);
  });

  it("rejects a token whose signature was altered", () => {
    const token = generateWaitlistToken(ROW_ID);
    const [id, sig] = token.split(".");
    const flipped = sig[0] === "A" ? `B${sig.slice(1)}` : `A${sig.slice(1)}`;
    expect(verifyWaitlistToken(`${id}.${flipped}`)).toBeNull();
  });

  it("rejects a token whose payload was altered", () => {
    const token = generateWaitlistToken(ROW_ID);
    const sig = token.split(".")[1];
    const otherId = Buffer.from("00000000-0000-0000-0000-000000000000").toString(
      "base64url",
    );
    expect(verifyWaitlistToken(`${otherId}.${sig}`)).toBeNull();
  });

  it("rejects a token signed with the newsletter secret", () => {
    const forged = createHmac("sha256", NEWSLETTER_SECRET)
      .update(ROW_ID)
      .digest("base64url");
    const encodedId = Buffer.from(ROW_ID, "utf8").toString("base64url");
    expect(verifyWaitlistToken(`${encodedId}.${forged}`)).toBeNull();
  });

  it("rejects malformed tokens", () => {
    expect(verifyWaitlistToken("")).toBeNull();
    expect(verifyWaitlistToken("no-dot")).toBeNull();
    expect(verifyWaitlistToken("a.b.c")).toBeNull();
    expect(verifyWaitlistToken(".sig")).toBeNull();
  });

  it("refuses to sign when the secret is too short", async () => {
    process.env.WAITLIST_TOKEN_SECRET = "short";
    const { generateWaitlistToken: gen } = await import("./waitlist-token");
    expect(() => gen(ROW_ID)).toThrow(/WAITLIST_TOKEN_SECRET/);
  });
});
