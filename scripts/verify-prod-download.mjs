// Production end-to-end 驗證：在 Supabase 插一筆短期測試 token，
// 打 production /api/download/ai-coach-kit endpoint，比對 bytes，再清掉測試 token。
// 用法：vercel env pull .env.production --environment=production --yes
//       node --env-file=.env.production scripts/verify-prod-download.mjs

import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const PROD_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.solo.tw';
const TEST_TOKEN = `e2e-test-${randomUUID()}`;
const TOMORROW = new Date(Date.now() + 86_400_000).toISOString();

console.log('=== Step 1: 插入測試 token ===');
const { error: insErr } = await supabase.from('download_tokens').insert({
  token: TEST_TOKEN,
  product_id: 'ai-coach-kit',
  order_id: `e2e-test-order-${randomUUID()}`,
  expires_at: TOMORROW,
  max_downloads: 3,
  download_count: 0,
});
if (insErr) {
  console.error('❌ insert 失敗:', insErr);
  process.exit(1);
}
console.log(`   token: ${TEST_TOKEN}`);

let exitCode = 0;
try {
  console.log('\n=== Step 2: 打 production download endpoint ===');
  const url = `${PROD_URL}/api/download/ai-coach-kit?token=${TEST_TOKEN}`;
  console.log(`   URL: ${url}`);
  const resp = await fetch(url);
  console.log(`   status: ${resp.status}`);
  console.log(`   content-type: ${resp.headers.get('content-type')}`);
  console.log(`   content-length: ${resp.headers.get('content-length')}`);

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    console.error(`❌ download 失敗 ${resp.status}: ${body.slice(0, 200)}`);
    exitCode = 1;
  } else {
    const remote = Buffer.from(await resp.arrayBuffer());
    const local = await readFile('private/ai-coach-kit.zip');
    console.log(`   收到 ${remote.length} bytes`);
    if (remote.length === local.length && remote.equals(local)) {
      console.log('✅ bytes 與本地 zip 完全一致');
    } else {
      console.error(`❌ bytes 不一致: prod ${remote.length} vs local ${local.length}`);
      exitCode = 1;
    }
  }

  console.log('\n=== Step 3: 確認 download_count 有 +1 ===');
  const { data: row } = await supabase
    .from('download_tokens').select('download_count').eq('token', TEST_TOKEN).single();
  console.log(`   download_count: ${row?.download_count}`);
  if (row?.download_count === 1) console.log('   ✅ token 計數邏輯正常');
  else console.warn(`   ⚠️  期望 1，實際 ${row?.download_count}`);
} finally {
  console.log('\n=== Step 4: 清理測試 token ===');
  const { error: delErr } = await supabase.from('download_tokens').delete().eq('token', TEST_TOKEN);
  if (delErr) console.error('   ⚠️  清理失敗（請手動 DELETE）:', delErr);
  else console.log('   ✅ 刪除完成');
}

if (exitCode === 0) console.log('\n🎉 production 付費下載流程驗證通過');
process.exit(exitCode);
