import { describe, it, expect } from "vitest";
import { createHmac } from "crypto";

process.env.ASSIGNMENT_SESSION_SECRET = "s".repeat(32);

const {
  generateSessionToken,
  verifySessionToken,
  sessionCookieName,
} = await import("./assignment-session");

describe("assignment session token", () => {
  it("round-trips a session", () => {
    const token = generateSessionToken({
      email: "student@example.com",
      courseId: "positioning-convergence",
    });
    expect(verifySessionToken(token)).toEqual({
      email: "student@example.com",
      courseId: "positioning-convergence",
    });
  });

  it("rejects a payload edited to another student's address", () => {
    const token = generateSessionToken({
      email: "a@example.com",
      courseId: "positioning-convergence",
    });
    const [, signature] = token.split(".");

    // Keep the original signature, swap the body — the tampering a "防君子"
    // gate must still catch.
    const forgedBody = Buffer.from(
      JSON.stringify({
        email: "b@example.com",
        courseId: "positioning-convergence",
      }),
      "utf8",
    ).toString("base64url");

    expect(verifySessionToken(`${forgedBody}.${signature}`)).toBeNull();
  });

  it("rejects a token signed with a different secret", () => {
    const body = Buffer.from(
      JSON.stringify({ email: "a@example.com", courseId: "x" }),
      "utf8",
    ).toString("base64url");
    const forged = createHmac("sha256", "w".repeat(32))
      .update(body)
      .digest("base64url");

    expect(verifySessionToken(`${body}.${forged}`)).toBeNull();
  });

  it("rejects malformed tokens", () => {
    expect(verifySessionToken("")).toBeNull();
    expect(verifySessionToken("nodot")).toBeNull();
    expect(verifySessionToken("a.b.c")).toBeNull();
    expect(verifySessionToken(".sig")).toBeNull();
    expect(verifySessionToken("body.")).toBeNull();
  });

  it("rejects a validly-signed body that is not a session", () => {
    const body = Buffer.from(JSON.stringify({ hello: "world" }), "utf8").toString(
      "base64url",
    );
    const signature = createHmac("sha256", "s".repeat(32))
      .update(body)
      .digest("base64url");
    expect(verifySessionToken(`${body}.${signature}`)).toBeNull();
  });

  it("scopes the cookie name per course and sanitizes it", () => {
    expect(sessionCookieName("positioning-convergence")).toBe(
      "assignment_session_positioning-convergence",
    );
    expect(sessionCookieName("a/b c")).toBe("assignment_session_a_b_c");
    expect(sessionCookieName("course-a")).not.toBe(sessionCookieName("course-b"));
  });
});
