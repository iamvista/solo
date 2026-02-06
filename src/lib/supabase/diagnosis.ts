import { createClient } from "./client";
import type { DiagnosisResultInsert, SoloType } from "./types";

interface DiagnosisScores {
  positioning: number;
  delivery: number;
  trust: number;
  monetization: number;
  sustainability: number;
}

interface SaveDiagnosisParams {
  scores: DiagnosisScores;
  totalScore: number;
  soloType: SoloType;
  answers: Record<number, number>;
  diagnosisType?: "quick" | "full";
  email?: string;
}

export async function saveDiagnosisResult(params: SaveDiagnosisParams) {
  const supabase = createClient();

  // 取得目前登入用戶（如果有）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 取得 UTM 參數
  const urlParams = new URLSearchParams(window.location.search);

  const result: DiagnosisResultInsert = {
    user_id: user?.id || null,
    email: params.email || user?.email || null,
    diagnosis_type: params.diagnosisType || "quick",
    score_positioning: params.scores.positioning,
    score_delivery: params.scores.delivery,
    score_trust: params.scores.trust,
    score_monetization: params.scores.monetization,
    score_sustainability: params.scores.sustainability,
    total_score: params.totalScore,
    solo_type: params.soloType,
    answers: params.answers,
    utm_source: urlParams.get("utm_source"),
    utm_medium: urlParams.get("utm_medium"),
    utm_campaign: urlParams.get("utm_campaign"),
  };

  const { error } = await supabase
    .from("diagnosis_results")
    .insert(result);

  if (error) {
    console.error("Error saving diagnosis:", error.message || error);
    // 不 throw error，讓使用者仍能看到結果
    return null;
  }

  return { success: true };
}

export async function getUserDiagnosisHistory() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("diagnosis_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching diagnosis history:", error);
    throw error;
  }

  return data;
}
