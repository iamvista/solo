#!/usr/bin/env node
/**
 * pull-claims.mjs — 從 canonical registry 拉實績數字，產生 src/lib/claims.generated.ts。
 *
 * 背景：實績數字原本散在八個 repo 約 40 處硬編碼，彼此矛盾（訂戶有 19,000／18,500／
 * 18,000 三種、場次有 300+／200+／50+ 三種）。canonical 是
 * vista-official-site/data/registry.json，判斷標準見同目錄的 SOURCES.md。
 *
 * 本站只需要數字，不需要完整的合作單位名錄，所以只拉 metrics。
 *
 * 用法：
 *   node scripts/pull-claims.mjs         # 檢查差異（不改檔）
 *   node scripts/pull-claims.mjs --fix   # 實際寫檔
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const FIX = process.argv.slice(2).includes('--fix');
const REGISTRY = path.resolve(REPO, '../vista-official-site/data/registry.json');
const OUT = path.join(REPO, 'src/lib/claims.generated.ts');

if (!fs.existsSync(REGISTRY)) {
	console.log(`✘ 找不到 canonical registry：${REGISTRY}`);
	console.log('   vista-official-site 必須是本 repo 的兄弟目錄才能更新數字。');
	console.log('   （已進版控的 src/lib/claims.generated.ts 不受影響，建置照常。）');
	process.exit(1);
}

const reg = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
const rows = reg.metrics
	.map((m) => `\t${JSON.stringify(m.key)}: { value: ${JSON.stringify(m.displayText ?? String(m.value))}, label: ${JSON.stringify(m.label ?? m.key)}, exact: ${JSON.stringify(m.value)}, kind: ${JSON.stringify(m.kind)} },`)
	.join('\n');

const content = `// 由 scripts/pull-claims.mjs 自動產生，請勿手改。
// 改數字請改 vista-official-site/data/registry.json，再跑 node scripts/pull-claims.mjs --fix
// registry revision: ${reg.revision}

export interface Claim { value: string; label: string; exact: number | string; kind: string; }

export const claims: Record<string, Claim> = {
${rows}
};

export const REGISTRY_REVISION = ${JSON.stringify(reg.revision)};
`;

const rel = path.relative(REPO, OUT);
const existing = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : null;
if (existing === content) {
	console.log(`  ✓ ${rel} 與 registry (${reg.revision}) 一致`);
	process.exit(0);
}
if (!FIX) {
	console.log(`✘ ${rel} 與 registry 不一致${existing === null ? '（尚未產生）' : ''}`);
	console.log('   修法：node scripts/pull-claims.mjs --fix');
	process.exit(1);
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, content, 'utf8');
console.log(`✓ 已${existing === null ? '建立' : '更新'} ${rel}（registry ${reg.revision}）`);
