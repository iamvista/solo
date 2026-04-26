// 把 private/*.zip 上傳到 Vercel Blob store。
// 用法：node --env-file=.env.local scripts/upload-private-to-blob.mjs
//
// pathname 在 Blob 內固定為 `products/<filename>`，方便 download route 用 head() 找到。
// access: 'private' 對應 store 的 private 設定；blob URL 仍存在，但 read 需要 token。

import { put } from '@vercel/blob';
import { readFile, stat } from 'node:fs/promises';

const FILES = [
  { local: 'private/ai-coach-kit.zip', blob: 'products/ai-coach-kit.zip' },
];

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN 未設。先跑 vercel env pull 同步 .env.local。');
  process.exit(1);
}

for (const f of FILES) {
  const info = await stat(f.local);
  const buf = await readFile(f.local);
  const result = await put(f.blob, buf, {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  console.log(`✅ ${f.local} (${info.size} bytes) → ${result.pathname}`);
  console.log(`   url: ${result.url}`);
}

console.log('\n上傳完成。');
