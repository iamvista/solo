import { createServiceClient } from "@/lib/supabase/service";
import { getVerifiedStudent } from "@/lib/assignment-access";
import { getAssignment, getOwnSubmission } from "@/lib/assignments";

export type RewardKind = "video" | "file" | "link" | "text";

export interface Reward {
  id: string;
  assignment_id: string;
  kind: RewardKind;
  title: string;
  description: string | null;
  video_url: string | null;
  storage_path: string | null;
  external_url: string | null;
  /** kind="text" only: the passage itself, stored here rather than pointed at. */
  body_text: string | null;
  /**
   * kind="file" only: the handout's original filename.
   *
   * storage_path is ASCII-only because Storage rejects non-ASCII keys, so
   * 講義.pdf becomes something like `a1b2-file.pdf`. That key is plumbing;
   * this is what the teacher and student actually read.
   */
  file_name: string | null;
  sort_order: number;
}

const REWARD_COLUMNS =
  "id, assignment_id, kind, title, description, video_url, storage_path, external_url, body_text, file_name, sort_order";

export async function listRewards(assignmentId: string): Promise<Reward[]> {
  if (!assignmentId) return [];
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("rewards")
    .select(REWARD_COLUMNS)
    .eq("assignment_id", assignmentId)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as Reward[];
}

export async function getReward(rewardId: string): Promise<Reward | null> {
  if (!rewardId) return null;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("rewards")
    .select(REWARD_COLUMNS)
    .eq("id", rewardId)
    .maybeSingle();

  if (error || !data) return null;
  return data as Reward;
}

/**
 * The unlock rule, in one place.
 *
 * Unlock state is not stored anywhere — it IS the existence of the student's
 * submission. Nothing to grant, nothing to revoke, nothing that can drift out
 * of step with the submissions it describes.
 *
 * Teacher review deliberately plays no part: rewards open the moment a student
 * submits, so the teacher is never a bottleneck.
 */
export async function hasUnlocked(
  assignmentId: string,
  studentEmail: string,
): Promise<boolean> {
  const submission = await getOwnSubmission(assignmentId, studentEmail);
  return submission !== null;
}

/** Rewards a student has unlocked for an assignment. Empty until they submit. */
export async function listUnlockedRewards(
  assignmentId: string,
  studentEmail: string,
): Promise<Reward[]> {
  if (!(await hasUnlocked(assignmentId, studentEmail))) return [];
  return listRewards(assignmentId);
}

export type RewardAuthResult =
  | { ok: true; reward: Reward }
  | { ok: false; status: 401 | 403 | 404 };

/**
 * Single authorization path for reward content, shared by the page and the API
 * so the two can never disagree about who may see what.
 *
 * Order matters: a request without a session is 401 before we ever look at
 * submissions, and a student who has not submitted is 403 — neither response
 * carries the reward's URL or storage path.
 */
export async function authorizeReward(
  rewardId: string,
): Promise<RewardAuthResult> {
  const reward = await getReward(rewardId);
  if (!reward) return { ok: false, status: 404 };

  const assignment = await getAssignment(reward.assignment_id);
  if (!assignment || !assignment.is_published) return { ok: false, status: 404 };

  const student = await getVerifiedStudent(assignment.course_id);
  if (!student) return { ok: false, status: 401 };

  if (!(await hasUnlocked(assignment.id, student.email))) {
    return { ok: false, status: 403 };
  }

  return { ok: true, reward };
}
