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

describe("ai-academic-writing 的兩期（本次變更的主體）", () => {
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

  it("第一期的日期沒有被第二期覆蓋", () => {
    // 這正是 ef7188e 造成的問題：date 被就地改掉，第一期的 8/16 消失。
    expect(getCohort(c, "1")?.date).not.toBe(getCohort(c, "2")?.date);
  });
});
