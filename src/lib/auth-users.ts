import { createServiceClient } from "@/lib/supabase/service";

/**
 * Supabase 的 admin API 沒有「用 email 查帳號」這個方法，只有 listUsers()
 * 與 getUserById()。而 listUsers() 預設每頁 50 筆。
 *
 * 這曾經是個真的 bug：站上有 59 個帳號，Vista 是最早註冊的那一個，於是他
 * 不在第一頁裡。指派老師的 API 撈完第一頁找不到他，就回「找不到這個帳號，
 * 請對方先到 solo.tw 註冊」——對一個已經註冊的人說謊。註冊越早的人越容易
 * 中招，而那正是最可能被指派為老師的人。
 *
 * 這個模組把分頁封在一處，呼叫端不需要知道它存在。
 */

/** 一頁抓多少。設大是為了讓常見情況一次就掃完，不是為了取代分頁。 */
const PER_PAGE = 200;

/** 最多翻幾頁。純粹是防迴圈失控的閘，不是預期會用到的上限。 */
const MAX_PAGES = 50;

export interface AuthUserLite {
  id: string;
  email: string;
}

/**
 * 以 email 找帳號，找不到回 null。
 *
 * 必須翻到底才能說「沒有」：只掃第一頁就回報找不到，是這個模組存在的原因。
 */
export async function findAuthUserByEmail(
  email: string,
): Promise<AuthUserLite | null> {
  const target = email.trim().toLowerCase();
  if (!target) return null;

  const supabase = createServiceClient();

  for (let page = 1; page <= MAX_PAGES; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: PER_PAGE,
    });
    if (error || !data) return null;

    const hit = data.users.find(
      (u) => (u.email ?? "").toLowerCase() === target,
    );
    if (hit) return { id: hit.id, email: hit.email ?? "" };

    // 不滿一頁就是最後一頁，沒找到就是真的沒有。
    if (data.users.length < PER_PAGE) return null;
  }

  console.warn("[auth-users] 翻超過上限仍未找到", target);
  return null;
}

/**
 * 取得指定帳號的 email，回傳 id → email 的對照。
 *
 * 用 getUserById 逐一查而非撈全部再比對：要的是特定幾個人，分頁在這裡
 * 只會是風險，不會是幫助。
 */
export async function getAuthEmails(
  ids: string[],
): Promise<Map<string, string>> {
  if (ids.length === 0) return new Map();
  const supabase = createServiceClient();

  const entries = await Promise.all(
    [...new Set(ids)].map(async (id) => {
      const { data } = await supabase.auth.admin.getUserById(id);
      return [id, data?.user?.email ?? ""] as const;
    }),
  );

  return new Map(entries.filter(([, email]) => email !== ""));
}
