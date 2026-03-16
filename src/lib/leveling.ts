// EXP & Level system for solo.tw
// Formula: each level requires level * 200 EXP
// e.g., Lv1→2 = 200 EXP, Lv2→3 = 400 EXP, Lv3→4 = 600 EXP

export const MAX_LEVEL = 50;

/** EXP required to go from `level` to `level+1` */
export function expForLevel(level: number): number {
  return level * 200;
}

/** Total EXP required to reach a given level from Lv1 */
export function totalExpForLevel(level: number): number {
  // Sum of 1*200 + 2*200 + ... + (level-1)*200 = 200 * (level-1)*level/2
  return 200 * ((level - 1) * level) / 2;
}

/** Calculate level from total accumulated EXP */
export function levelFromExp(totalExp: number): { level: number; currentExp: number; nextLevelExp: number } {
  let level = 1;
  let remaining = totalExp;

  while (level < MAX_LEVEL) {
    const needed = expForLevel(level);
    if (remaining < needed) break;
    remaining -= needed;
    level++;
  }

  return {
    level,
    currentExp: remaining,
    nextLevelExp: level < MAX_LEVEL ? expForLevel(level) : 0,
  };
}

/** EXP rewards for various actions */
export const EXP_REWARDS = {
  // Onboarding
  set_username: 50,
  upload_avatar: 20,
  write_bio: 20,
  complete_diagnosis: 100,
  complete_full_diagnosis: 150,

  // Engagement
  register_event: 30,
  attend_event: 50,
  complete_course_lesson: 40,
  share_result: 10,

  // Content (future)
  create_event: 100,
  create_lead_magnet: 80,
  create_survey: 60,

  // Milestones
  first_event_registration: 50,
  streak_7_days: 100,
  streak_30_days: 300,
} as const;

export type ExpAction = keyof typeof EXP_REWARDS;
