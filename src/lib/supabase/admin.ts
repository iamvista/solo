import { createClient } from "./server";

// 管理員 Email 列表（可以改成從環境變數讀取）
const ADMIN_EMAILS = [
  "iamvista@gmail.com",
];

export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  // 檢查是否在管理員列表中
  if (ADMIN_EMAILS.includes(user.email || "")) {
    return true;
  }

  // 也可以檢查 profiles 表中的 is_admin 欄位
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  return profile?.is_admin === true;
}

// 獲取用戶統計
export async function getUserStats() {
  const supabase = await createClient();

  // 總用戶數
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // 訂閱電子報的用戶數
  const { count: subscribedUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("subscribe_newsletter", true);

  // 未訂閱的用戶數
  const { count: unsubscribedUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("subscribe_newsletter", false);

  // 最近 7 天註冊的用戶
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: newUsersLast7Days } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString());

  return {
    totalUsers: totalUsers || 0,
    subscribedUsers: subscribedUsers || 0,
    unsubscribedUsers: unsubscribedUsers || 0,
    newUsersLast7Days: newUsersLast7Days || 0,
  };
}

// 獲取診斷統計
export async function getDiagnosisStats() {
  const supabase = await createClient();

  // 總診斷數
  const { count: totalDiagnoses } = await supabase
    .from("diagnosis_results")
    .select("*", { count: "exact", head: true });

  // 快速診斷數
  const { count: quickDiagnoses } = await supabase
    .from("diagnosis_results")
    .select("*", { count: "exact", head: true })
    .eq("diagnosis_type", "quick");

  // 深度診斷數
  const { count: fullDiagnoses } = await supabase
    .from("diagnosis_results")
    .select("*", { count: "exact", head: true })
    .eq("diagnosis_type", "full");

  // 最近 7 天的診斷數
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: diagnosesLast7Days } = await supabase
    .from("diagnosis_results")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString());

  // 各類型 Solo 分佈
  const { data: soloTypeDistribution } = await supabase
    .from("diagnosis_results")
    .select("solo_type");

  const typeCount: Record<string, number> = {};
  soloTypeDistribution?.forEach((d) => {
    typeCount[d.solo_type] = (typeCount[d.solo_type] || 0) + 1;
  });

  // 平均分數
  const { data: scores } = await supabase
    .from("diagnosis_results")
    .select("total_score");

  const avgScore = scores && scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b.total_score, 0) / scores.length)
    : 0;

  return {
    totalDiagnoses: totalDiagnoses || 0,
    quickDiagnoses: quickDiagnoses || 0,
    fullDiagnoses: fullDiagnoses || 0,
    diagnosesLast7Days: diagnosesLast7Days || 0,
    soloTypeDistribution: typeCount,
    averageScore: avgScore,
  };
}

// 獲取用戶列表（含訂閱狀態）
export async function getUserList(page: number = 1, limit: number = 20) {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  const { data: users, count } = await supabase
    .from("profiles")
    .select(`
      id,
      created_at,
      display_name,
      avatar_url,
      subscribe_newsletter,
      membership_tier
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // 獲取每個用戶的 email（需要從 auth.users 取，但這裡用 diagnosis_results 的 email 代替）
  const userIds = users?.map((u) => u.id) || [];

  // 獲取用戶的診斷次數
  const { data: diagnosisCounts } = await supabase
    .from("diagnosis_results")
    .select("user_id, email")
    .in("user_id", userIds);

  const diagnosisCountMap: Record<string, { count: number; email: string | null }> = {};
  diagnosisCounts?.forEach((d) => {
    if (d.user_id) {
      if (!diagnosisCountMap[d.user_id]) {
        diagnosisCountMap[d.user_id] = { count: 0, email: d.email };
      }
      diagnosisCountMap[d.user_id].count++;
    }
  });

  const enrichedUsers = users?.map((user) => ({
    ...user,
    email: diagnosisCountMap[user.id]?.email || null,
    diagnosisCount: diagnosisCountMap[user.id]?.count || 0,
  }));

  return {
    users: enrichedUsers || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

// 獲取診斷列表（管理員專用，包含已刪除的紀錄）
export async function getDiagnosisList(page: number = 1, limit: number = 20, includeDeleted: boolean = true) {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  let query = supabase
    .from("diagnosis_results")
    .select(`
      id,
      short_id,
      created_at,
      email,
      diagnosis_type,
      total_score,
      solo_type,
      score_positioning,
      score_delivery,
      score_trust,
      score_monetization,
      score_sustainability,
      utm_source,
      utm_medium,
      utm_campaign,
      is_deleted,
      deleted_at
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // 如果不包含已刪除的，加上過濾條件
  if (!includeDeleted) {
    query = query.or("is_deleted.is.null,is_deleted.eq.false");
  }

  const { data: diagnoses, count } = await query;

  return {
    diagnoses: diagnoses || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

// 獲取 UTM 來源分析
export async function getTrafficAnalysis() {
  const supabase = await createClient();

  const { data: utmData } = await supabase
    .from("diagnosis_results")
    .select("utm_source, utm_medium, utm_campaign, created_at");

  // 來源統計
  const sourceCount: Record<string, number> = {};
  const mediumCount: Record<string, number> = {};
  const campaignCount: Record<string, number> = {};

  utmData?.forEach((d) => {
    const source = d.utm_source || "direct";
    const medium = d.utm_medium || "none";
    const campaign = d.utm_campaign || "none";

    sourceCount[source] = (sourceCount[source] || 0) + 1;
    mediumCount[medium] = (mediumCount[medium] || 0) + 1;
    if (d.utm_campaign) {
      campaignCount[campaign] = (campaignCount[campaign] || 0) + 1;
    }
  });

  // 按日期分組的診斷數
  const dailyCount: Record<string, number> = {};
  utmData?.forEach((d) => {
    const date = new Date(d.created_at).toISOString().split("T")[0];
    dailyCount[date] = (dailyCount[date] || 0) + 1;
  });

  return {
    bySource: sourceCount,
    byMedium: mediumCount,
    byCampaign: campaignCount,
    byDate: dailyCount,
  };
}
