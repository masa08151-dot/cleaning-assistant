export function digestHtml(dateStr: string, items: any[]) {
  return `<!doctype html><html><head><meta charset="utf-8">
  <style>
    body{font-family: system-ui,-apple-system,Segoe UI; margin:24px;}
    h1{font-size:20px;margin-bottom:16px}
    .card{border:1px solid #ddd;border-radius:8px;padding:12px;margin-bottom:12px}
    .meta{font-size:12px;color:#666;margin:4px 0}
    pre{white-space:pre-wrap;font-size:13px}
  </style></head><body>
  <h1>${dateStr} 本日の清掃予定（${items.length}件）</h1>
  ${items.map(x => `
    <div class="card">
      <div><strong>${x.time}</strong> ${x.property}</div>
      <div class="meta">住所：${x.address}／駐車：${x.parking}</div>
      <pre>${x.summary}</pre>
    </div>
  `).join('')}
  </body></html>`;
}
