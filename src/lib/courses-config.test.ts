import { describe, it, expect } from "vitest";
import { COURSE_CONFIGS, getOpenCohort, getCohort } from "./courses-config";

const courses = Object.values(COURSE_CONFIGS);

describe("每門課的期別", () => {
  it("至少有一期", () => {
    for (const c of courses) {
      expect(c.cohorts.length, `${c.slug} 沒有期別`).toBeGreaterThan(0);
    }
  });

  it("至多一期招生中", () => {
    // 報名時要據此決定 cohort_key，兩期同時 open 就無從決定。
    for (const c of courses) {
      const open = c.cohorts.filter((h) => h.open);
      expect(open.length, `${c.slug} 有 ${open.length} 期招生中`).toBeLessThanOrEqual(1);
    }
  });

  it("每門課都有一期招生中", () => {
    // 沒有招生中的期別，報名進來就無從歸期。課程停售時應整個下架，
    // 而不是留一個沒有 open 期別的設定。
    for (const c of courses) {
      expect(getOpenCohort(c), `${c.slug} 沒有招生中的期別`).not.toBeNull();
    }
  });

  it("期別 key 在同一門課內唯一", () => {
    for (const c of courses) {
      const keys = c.cohorts.map((h) => h.key);
      expect(new Set(keys).size, `${c.slug} 的期別 key 重複`).toBe(keys.length);
    }
  });

  it("每期都有商品，且商品不跨期共用", () => {
    // 商品跨期共用正是先前的 bug：開第二期時只改商品名稱，導致第一期學員的
    // 收據變成第二期的日期，recur_product_id 也就分不出期別。
    for (const c of courses) {
      const seen = new Set<string>();
      for (const h of c.cohorts) {
        expect(h.productIds.length, `${c.slug} ${h.name} 沒有商品`).toBeGreaterThan(0);
        for (const pid of h.productIds) {
          expect(seen.has(pid), `${c.slug} 的商品 ${pid} 跨期共用`).toBe(false);
          seen.add(pid);
        }
      }
    }
  });
});

describe("招生中的期別必須與頂層設定一致", () => {
  // 頂層的 date 與 recurProductId* 是報名頁、課程列表、OG 圖在讀的；
  // 期別是作業系統在讀的。兩者描述同一件事，改了一邊沒改另一邊，
  // 學員就會在報名頁看到 A 日期、被歸到 B 期別。
  // 這幾條測試取代「人要記得同步」。

  it("date 與招生中那一期相同", () => {
    for (const c of courses) {
      const open = getOpenCohort(c);
      expect(open?.date, `${c.slug} 的頂層 date 與招生中期別不符`).toBe(c.date);
    }
  });

  it("頂層的每個商品 ID 都屬於招生中那一期", () => {
    for (const c of courses) {
      const open = getOpenCohort(c);
      const topLevel = [
        c.recurProductIdEarlyBird,
        c.recurProductIdRegular,
        c.recurProductIdDual,
        c.recurProductIdVip,
      ].filter(Boolean) as string[];

      for (const pid of topLevel) {
        expect(
          open?.productIds.includes(pid),
          `${c.slug} 的頂層商品 ${pid} 不在招生中期別（${open?.name}）的 productIds 裡`,
        ).toBe(true);
      }
    }
  });
});

describe("startsAt（倒數提醒 cron 讀的開課時間）", () => {
  // date 是給人看的字串，startsAt 是給 cron 算 D-N 的機器可讀時間。
  // 兩者描述同一個時刻，改了一邊沒改另一邊，學員就會在錯的日子收到提醒。
  // 這正是 2026-08-06 藍圖 PDF 那次的同類錯誤：日期在一處改了、另一處沒改。

  /** 把 "2026/8/30（日）" 正規化成 "2026-08-30" */
  function displayDateToISO(date: string): string | null {
    const m = date.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/);
    if (!m) return null;
    const [, y, mo, d] = m;
    return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  const taipeiDay = (iso: string) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));

  it("有填 startsAt 的期別，其日期必須與顯示用 date 相同", () => {
    for (const c of courses) {
      for (const h of c.cohorts) {
        if (!h.startsAt) continue;
        const expected = displayDateToISO(h.date);
        expect(expected, `${c.slug} ${h.name} 的 date 格式無法解析：${h.date}`).not.toBeNull();
        expect(
          taipeiDay(h.startsAt),
          `${c.slug} ${h.name}：date 是 ${h.date}，startsAt 卻是 ${h.startsAt}`,
        ).toBe(expected);
      }
    }
  });

  it("startsAt 必須是可解析且帶時區的 ISO 字串", () => {
    for (const c of courses) {
      for (const h of c.cohorts) {
        if (!h.startsAt) continue;
        expect(
          Number.isNaN(new Date(h.startsAt).getTime()),
          `${c.slug} ${h.name} 的 startsAt 無法解析：${h.startsAt}`,
        ).toBe(false);
        expect(
          /([+-]\d{2}:\d{2}|Z)$/.test(h.startsAt),
          `${c.slug} ${h.name} 的 startsAt 沒帶時區，會被當成 UTC 解讀：${h.startsAt}`,
        ).toBe(true);
      }
    }
  });

  it("ai-content 第一期已填 startsAt，開課提醒才會發", () => {
    const first = getCohort(COURSE_CONFIGS["ai-content"], "1");
    expect(first?.startsAt).toBe("2026-08-30T09:00:00+08:00");
  });
});

describe("getOpenCohort", () => {
  it("回傳標記 open 的那一期", () => {
    const c = COURSE_CONFIGS["ai-academic-writing"];
    expect(getOpenCohort(c)?.key).toBe("2");
    expect(getOpenCohort(c)?.name).toBe("第二期");
  });
});

describe("getCohort", () => {
  it("以 key 取得期別", () => {
    const c = COURSE_CONFIGS["ai-academic-writing"];
    expect(getCohort(c, "1")?.name).toBe("第一期");
    expect(getCohort(c, "2")?.name).toBe("第二期");
  });

  it("未知的 key 回 null", () => {
    expect(getCohort(COURSE_CONFIGS["ai-academic-writing"], "99")).toBeNull();
  });
});

describe("ai-academic-writing 的三期（本次變更的主體）", () => {
  const c = COURSE_CONFIGS["ai-academic-writing"];

  it("第一期是 8/16，且商品是已關閉的那一組", () => {
    const first = getCohort(c, "1");
    expect(first?.date).toBe("2026/8/16（日）");
    expect(first?.productIds).toEqual([
      "b3dc06svryzlii74r2bpn6qo",
      "u0rnbc9kgub6azuw44ub72ml",
    ]);
    expect(first?.open).toBeFalsy();
  });

  it("第二期是 9/12，招生中，商品是新建的那一組", () => {
    const second = getCohort(c, "2");
    expect(second?.date).toBe("2026/9/12（六）");
    expect(second?.productIds).toEqual([
      "tpl4a90ujudu17w69oggetbk",
      "dckcqar572yqgeij7ubqsljj",
    ]);
    expect(second?.open).toBe(true);
  });

  it("第二期有 startsAt，開課倒數提醒才會發", () => {
    // 補這欄之前，9/12 那九位已付款學員完全收不到 D-7/5/3/1 提醒。
    expect(getCohort(c, "2")?.startsAt).toBe("2026-09-12T09:00:00+08:00");
  });

  it("第三期是 10/31，尚未開放報名，商品是另外新建的一組", () => {
    // 「先揭露、後開賣」：招生頁露出 10/31 的日期與價格，但 open 仍在第二期。
    // 9/12 開課後才由 2026-09-13 的行事曆提醒觸發切換。
    const third = getCohort(c, "3");
    expect(third?.date).toBe("2026/10/31（六）");
    expect(third?.startsAt).toBe("2026-10-31T09:00:00+08:00");
    expect(third?.productIds).toEqual([
      "m2hc9ys1p1d2c2o5eji3zbhd",
      "nfxg03hr71mosrsyflzqce5e",
    ]);
    expect(third?.open).toBeFalsy();
  });

  it("三期的日期彼此不同，沒有被就地覆蓋", () => {
    // 這正是 ef7188e 造成的問題：date 被就地改掉，第一期的 8/16 消失。
    const dates = c.cohorts.map((h) => h.date);
    expect(new Set(dates).size).toBe(dates.length);
  });
});
