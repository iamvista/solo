// 端對端驗證：模擬 download route 的 head() + fetch 流程，
// 確認 Blob 拉回的 bytes 與本地 zip 一致。
// 用法：node --env-file=.env.local scripts/verify-blob-download.mjs

import { head } from '@vercel/blob';
import { readFile } from 'node:fs/promises';

const blob = await head('products/ai-coach-kit.zip');
console.log('✅ head() 成功');
console.log(`   pathname: ${blob.pathname}`);
console.log(`   size: ${blob.size} bytes`);
console.log(`   url: ${blob.url.slice(0, 80)}...`);

const resp = await fetch(blob.url, {
  headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
});
if (!resp.ok) {
  console.error(`❌ fetch 失敗: ${resp.status} ${resp.statusText}`);
  process.exit(1);
}

const remote = Buffer.from(await resp.arrayBuffer());
const local = await readFile('private/ai-coach-kit.zip');
console.log(`\n✅ fetch 成功，收到 ${remote.length} bytes`);

if (remote.length !== local.length) {
  console.error(`❌ size 不一致：blob ${remote.length} vs local ${local.length}`);
  process.exit(1);
}

if (remote.equals(local)) {
  console.log('✅ bytes 完全一致：Blob 與本地 zip 相同');
} else {
  console.error('❌ size 一樣但 bytes 不一致');
  process.exit(1);
}

console.log('\n端對端驗證通過：production deploy 後 download route 應正常運作。');
