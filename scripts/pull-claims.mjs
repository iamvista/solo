#!/usr/bin/env node
/**
 * pull-claims.mjs — 從 canonical registry 拉實績數字，產生 src/lib/claims.generated.ts。
 *
 * 背景：實績數字原本散在八個 repo 約 40 處硬編碼，彼此矛盾（訂戶有 19,000／18,500／
 * 18,000 三種、場次有 300+／200+／50+ 三種）。canonical 是
 * vista-official-site/data/registry.json，判斷標準見同目錄的 SOURCES.md。
 *
 * 本站只需要數字與 llms.txt 的實績段落，不需要完整的合作單位名錄。段落文字由
 * build-credentials.mjs 的 renderLlmsSection 產生，八個站共用同一份實作；這裡烘成
 * 純文字檔給 generate-llms.mjs（.mjs 讀不了 TS）。
 *
 * 用法：
 *   node scripts/pull-claims.mjs         # 檢查差異（不改檔）
 *   node scripts/pull-claims.mjs --fix   # 實際寫檔
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const FIX = process.argv.slice(2).includes('--fix');
const CANON = path.resolve(REPO, '../vista-official-site');
const REGISTRY = path.join(CANON, 'data/registry.json');
const BUILDER = pathToFileURL(path.join(CANON, 'scripts/build-credentials.mjs')).href;
const OUT = path.join(REPO, 'src/lib/claims.generated.ts');
const OUT_LLMS = path.join(REPO, 'src/lib/llms-achievements.txt');
const OUT_JSON = path.join(REPO, 'src/lib/claims.generated.json');
const EVIDENCE_URL = 'https://www.vista.tw/services/teaching';

if (!fs.existsSync(REGISTRY)) {
	console.log(`✘ 找不到 canonical registry：${REGISTRY}`);
	console.log('   vista-official-site 必須是本 repo 的兄弟目錄才能更新數字。');
	console.log('   （已進版控的 src/lib/claims.generated.ts 與 llms-achievements.txt 不受影響，建置照常。）');
	process.exit(1);
}

const { loadRegistry, renderLlmsSection } = await import(BUILDER);
const reg = loadRegistry(REGISTRY);
const llmsText = renderLlmsSection(reg, EVIDENCE_URL);
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

const targets = [
	[OUT, content],
	[OUT_LLMS, llmsText],
	[OUT_JSON, JSON.stringify(Object.fromEntries((reg.metrics || []).map((m) => [m.key, { value: m.displayText ?? String(m.value), label: m.label ?? m.key, exact: m.value }])), null, '\t') + '\n'],
];
let stale = false;
for (const [file, want] of targets) {
	const rel = path.relative(REPO, file);
	const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
	if (existing === want) {
		console.log(`  ✓ ${rel} 與 registry (${reg.revision}) 一致`);
		continue;
	}
	if (!FIX) {
		console.log(`✘ ${rel} 與 registry 不一致${existing === null ? '（尚未產生）' : ''}`);
		stale = true;
		continue;
	}
	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(file, want, 'utf8');
	console.log(`✓ 已${existing === null ? '建立' : '更新'} ${rel}（registry ${reg.revision}）`);
}
if (stale) {
	console.log('   修法：node scripts/pull-claims.mjs --fix');
	process.exit(1);
}
