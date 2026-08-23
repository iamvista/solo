export interface TrustSection {
  title: string;
  paragraphs: string[];
  items?: string[];
}

export interface TrustPageContent {
  slug: "methodology" | "editorial-policy";
  eyebrow: string;
  title: string;
  description: string;
  summary: string;
  sections: TrustSection[];
  relatedLabel: string;
  relatedHref: string;
}

export const methodologyContent: TrustPageContent = {
  slug: "methodology",
  eyebrow: "內容可信度",
  title: "solo.tw 的內容方法",
  description: "了解 solo.tw 如何選題、蒐集資料、使用 AI、查核內容並維持一人事業文章與指南的實務價值。",
  summary: "solo.tw 以可實踐、可追溯、清楚揭露為原則，將經驗與資料整理成一人事業經營者能採取行動的內容。",
  sections: [
    {
      title: "我們如何選題",
      paragraphs: ["選題來自一人事業經營、顧問服務、課程教學與讀者提問中反覆出現的真實問題。我們優先處理能協助讀者做決策、完成工作或避免常見風險的主題。"],
    },
    {
      title: "資料與來源",
      paragraphs: ["內容可能結合第一手實務經驗、官方文件、原始研究、公開資料與具專業責任的可信來源。涉及會變動的產品功能、價格、法規或平臺規則時，發布前會盡可能回查最新官方資訊。"],
      items: ["優先引用原始資料與官方文件。", "區分可驗證事實、作者經驗與推論。", "無法充分確認的資訊不寫成確定結論。"],
    },
    {
      title: "AI 如何參與",
      paragraphs: ["AI 可以協助資料整理、結構提案、語句校對與重複性檢查，但不取代作者的訪談、判斷與責任。選題、核心主張、案例取捨與最終發布均由人員確認。"],
      items: ["不把未公開的客戶資料輸入公開模型。", "不以 AI 生成內容冒充親身經驗或真實引述。", "重要事實與連結由人員回查。"],
    },
    {
      title: "從草稿到發布",
      paragraphs: ["每篇內容會依主題需要經過資料蒐集、撰寫、事實確認、連結檢查與編輯。若文章涉及醫療、法律、投資或其他高風險決策，讀者應另行尋求合格專業人士的個別意見。"],
    },
    {
      title: "更新與限制",
      paragraphs: ["我們會在發現錯誤、重要來源變動或內容失去實用性時更新文章。網站提供的是一般資訊與經驗分享，不保證適用於每位讀者的情境，也不承諾特定事業成果。"],
    },
  ],
  relatedLabel: "查看編輯與更正政策",
  relatedHref: "/editorial-policy",
};

export const editorialPolicyContent: TrustPageContent = {
  slug: "editorial-policy",
  eyebrow: "編輯準則",
  title: "編輯與更正政策",
  description: "solo.tw 的內容獨立性、錯誤更正、商業關係、引用規範與讀者回報原則。",
  summary: "我們對發布內容負責，清楚區分編輯判斷與商業合作，並在錯誤影響讀者理解或決策時儘速更正。",
  sections: [
    {
      title: "編輯獨立性",
      paragraphs: ["solo.tw 的主題、觀點與建議由編輯需求及讀者價值決定。合作、贊助或聯盟關係不應換取特定結論，也不會阻止我們揭露產品或方法的限制。"],
    },
    {
      title: "商業內容與利益揭露",
      paragraphs: ["網站可能介紹自有課程、諮詢、工具或合作服務。當連結可能產生佣金、內容受贊助，或作者與所述對象存在重要關係時，會在適當位置揭露，讓讀者理解內容背景。"],
    },
    {
      title: "引用與內容邊界",
      paragraphs: ["引用外部資料時會標示來源或提供連結，不將他人觀點包裝成原創成果。短篇引用用於說明與評論；需要較完整呈現時，會優先導向原始內容並尊重著作權與授權條件。"],
      items: ["不捏造人物、案例、數據或引述。", "匿名案例會移除可識別資訊，必要時說明已改寫細節。", "讀者轉載時應保留作者、原文標題與可點擊來源連結。"],
    },
    {
      title: "錯誤與更正",
      paragraphs: ["若錯誤可能改變核心結論、造成誤解或影響讀者決策，我們會儘速修正；必要時在文章中說明更正內容。拼字、格式或不影響原意的小幅編修，通常不另行標示。"],
    },
    {
      title: "如何提出回報",
      paragraphs: ["若你發現事實錯誤、失效連結、未揭露的利益關係或不當引用，請透過網站聯絡管道提供頁面網址、問題位置與可供核對的來源。我們會查核回報，並依影響程度更新內容。"],
    },
  ],
  relatedLabel: "了解我們的內容方法",
  relatedHref: "/methodology",
};
