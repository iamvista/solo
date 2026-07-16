import { describe, it, expect, vi, beforeEach } from "vitest";

const COURSE = "course-x";
const ASSIGNMENT_ID = "a1";
const REWARD_ID = "r1";

const mockGetVerifiedStudent = vi.fn();

// Per-table fixtures; the real getReward / getAssignment / getOwnSubmission run
// against them, so this exercises the actual query scoping rather than stubs.
let rewardRow: unknown = null;
let assignmentRow: unknown = null;
let submissionRow: unknown = null;
const submissionFilters: Array<[string, unknown]> = [];

vi.mock("@/lib/assignment-access", () => ({
  getVerifiedStudent: (courseId: string) => mockGetVerifiedStudent(courseId),
}));

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: (table: string) => ({
      select: () => {
        const chain = {
          eq: (c: string, v: unknown) => {
            if (table === "submissions") submissionFilters.push([c, v]);
            return chain;
          },
          order: async () => ({
            data: rewardRow ? [rewardRow] : [],
            error: null,
          }),
          maybeSingle: async () => {
            if (table === "rewards") return { data: rewardRow, error: null };
            if (table === "assignments")
              return { data: assignmentRow, error: null };
            return { data: submissionRow, error: null };
          },
        };
        return chain;
      },
    }),
  }),
}));

const { authorizeReward, listUnlockedRewards, hasUnlocked } = await import(
  "./rewards"
);

const reward = {
  id: REWARD_ID,
  assignment_id: ASSIGNMENT_ID,
  kind: "file",
  title: "講義",
  description: null,
  video_url: null,
  storage_path: "rewards/course-x/handout.pdf",
  external_url: null,
  sort_order: 0,
};

const assignment = {
  id: ASSIGNMENT_ID,
  course_id: COURSE,
  title: "作業一",
  is_published: true,
};

beforeEach(() => {
  rewardRow = { ...reward };
  assignmentRow = { ...assignment };
  submissionRow = { id: "s1", assignment_id: ASSIGNMENT_ID };
  submissionFilters.length = 0;
  mockGetVerifiedStudent
    .mockReset()
    .mockResolvedValue({ email: "student@example.com", name: "王小明" });
});

describe("authorizeReward", () => {
  it("grants access to a student who submitted and was reviewed", async () => {
    submissionRow = { id: "s1", reviewed_at: "2026-07-16T00:00:00Z" };
    const result = await authorizeReward(REWARD_ID);
    expect(result.ok).toBe(true);
  });

  it("grants access when the submission has not been reviewed", async () => {
    // Review must never gate unlocking — the teacher is not a bottleneck.
    submissionRow = { id: "s1", reviewed_at: null, teacher_comment: null };
    const result = await authorizeReward(REWARD_ID);
    expect(result.ok).toBe(true);
  });

  it("denies a student who has not submitted", async () => {
    submissionRow = null;
    const result = await authorizeReward(REWARD_ID);
    expect(result).toEqual({ ok: false, status: 403 });
  });

  it("denies a request with no session", async () => {
    mockGetVerifiedStudent.mockResolvedValue(null);
    const result = await authorizeReward(REWARD_ID);
    expect(result).toEqual({ ok: false, status: 401 });
  });

  it("checks the session against the reward's own course", async () => {
    // A session for another course must not reach this reward: the check is
    // driven by the assignment's course_id, not by anything the caller supplies.
    await authorizeReward(REWARD_ID);
    expect(mockGetVerifiedStudent).toHaveBeenCalledWith(COURSE);
  });

  it("scopes the submission lookup to the session's address", async () => {
    await authorizeReward(REWARD_ID);
    expect(submissionFilters).toContainEqual([
      "student_email",
      "student@example.com",
    ]);
    expect(submissionFilters).toContainEqual(["assignment_id", ASSIGNMENT_ID]);
  });

  it("denies an unknown reward", async () => {
    rewardRow = null;
    expect(await authorizeReward(REWARD_ID)).toEqual({ ok: false, status: 404 });
  });

  it("denies a reward on an unpublished assignment", async () => {
    assignmentRow = { ...assignment, is_published: false };
    expect(await authorizeReward(REWARD_ID)).toEqual({ ok: false, status: 404 });
  });

  it("checks the session before looking at submissions", async () => {
    // Ordering matters: a stranger gets 401, not 403. A 403 would confirm the
    // reward exists.
    mockGetVerifiedStudent.mockResolvedValue(null);
    submissionRow = null;
    expect(await authorizeReward(REWARD_ID)).toEqual({ ok: false, status: 401 });
  });
});

describe("hasUnlocked", () => {
  it("is true exactly when a submission exists", async () => {
    submissionRow = { id: "s1" };
    await expect(hasUnlocked(ASSIGNMENT_ID, "student@example.com")).resolves.toBe(
      true,
    );

    submissionRow = null;
    await expect(hasUnlocked(ASSIGNMENT_ID, "student@example.com")).resolves.toBe(
      false,
    );
  });
});

describe("listUnlockedRewards", () => {
  it("returns nothing before the student submits", async () => {
    // Not even a title may leak for a locked reward.
    submissionRow = null;
    await expect(
      listUnlockedRewards(ASSIGNMENT_ID, "student@example.com"),
    ).resolves.toEqual([]);
  });

  it("returns the rewards once the student has submitted", async () => {
    submissionRow = { id: "s1" };
    const result = await listUnlockedRewards(ASSIGNMENT_ID, "student@example.com");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(REWARD_ID);
  });
});
