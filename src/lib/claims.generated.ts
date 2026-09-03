// 由 scripts/pull-claims.mjs 自動產生，請勿手改。
// 改數字請改 vista-official-site/data/registry.json，再跑 node scripts/pull-claims.mjs --fix
// registry revision: 2026-09-04-02

export interface Claim { value: string; label: string; exact: number | string; kind: string; }

export const claims: Record<string, Claim> = {
	"verified_sessions": { value: "222 場以上", label: "可查證授課場次", exact: 222, kind: "floor" },
	"partner_orgs": { value: "130 個以上", label: "合作單位", exact: 130, kind: "floor" },
	"newsletter_subscribers": { value: "19,000+", label: "電子報訂戶", exact: 19080, kind: "exact" },
	"magnet_leads": { value: "3,400+", label: "名單磁鐵訂閱者", exact: 3472, kind: "exact" },
	"books": { value: "21", label: "本出版著作", exact: 21, kind: "exact" },
	"writing_since": { value: "30+", label: "年寫作經歷", exact: 1995, kind: "exact" },
	"program_students": { value: "500+", label: "寫作陪伴計畫學員", exact: 500, kind: "estimate" },
};

export const REGISTRY_REVISION = "2026-09-04-02";
