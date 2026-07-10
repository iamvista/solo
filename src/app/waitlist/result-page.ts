function esc(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]!,
  );
}

function shell(title: string, body: string): string {
  return `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)} — solo.tw</title>
<style>
  :root { color-scheme: light dark; }
  body { margin:0; min-height:100vh; display:grid; place-items:center;
         background:#f6f9fc; color:#1a1a1a;
         font-family:'Noto Sans TC',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
  main { background:#fff; max-width:32rem; margin:1.5rem; padding:2.5rem 1.75rem;
         border-radius:.5rem; box-shadow:0 1px 3px rgb(0 0 0 / .08); }
  h1 { font-size:1.375rem; margin:0 0 .75rem; }
  p { color:#475569; line-height:1.75; margin:0 0 1rem; }
  button, a.btn { background:#0f172a; color:#fff; border:0; border-radius:.375rem;
                  padding:.75rem 1.5rem; font-size:.9375rem; font-weight:600;
                  cursor:pointer; text-decoration:none; display:inline-block; }
  footer { color:#8898aa; font-size:.75rem; margin-top:1.5rem; }
  @media (prefers-color-scheme: dark) {
    body { background:#0b1120; color:#e2e8f0; }
    main { background:#111827; box-shadow:none; }
    p { color:#94a3b8; }
    button, a.btn { background:#e2e8f0; color:#0f172a; }
  }
</style>
</head>
<body><main>${body}<footer>© solo.tw</footer></main></body>
</html>`;
}

/** 給偏好回填與退訂路由共用的終端頁面。 */
export function resultPage(title: string, message: string, status = 200): Response {
  const body = `<h1>${esc(title)}</h1><p>${esc(message)}</p>`;
  return new Response(shell(title, body), {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

/**
 * 退訂確認頁：GET 只渲染這一頁，真正寫入靠頁面上的 POST。
 * 企業郵件安全閘道（如 Outlook SafeLinks）會預抓信中連結，若 GET 直接退訂，
 * 使用者根本沒點就被退訂，且不可逆。
 */
export function confirmPage(
  title: string,
  message: string,
  action: string,
  token: string,
  submitLabel: string,
): Response {
  const body =
    `<h1>${esc(title)}</h1><p>${esc(message)}</p>` +
    `<form method="post" action="${esc(action)}">` +
    `<input type="hidden" name="token" value="${esc(token)}">` +
    `<button type="submit">${esc(submitLabel)}</button>` +
    `</form>`;
  return new Response(shell(title, body), {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
