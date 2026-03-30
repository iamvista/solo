<!-- SPECTRA:START v1.0.1 -->
# Spectra Instructions

This project uses Spectra for Spec-Driven Development(SDD). Specs live in `openspec/specs/`, change proposals in `openspec/changes/`.

## Use `/spectra:*` skills when:

- A discussion needs structure before coding → `/spectra:discuss`
- User wants to plan, propose, or design a change → `/spectra:propose`
- Tasks are ready to implement → `/spectra:apply`
- There's an in-progress change to continue → `/spectra:ingest`
- User asks about specs or how something works → `/spectra:ask`
- Implementation is done → `/spectra:archive`

## Workflow

discuss? → propose → apply ⇄ ingest → archive

- `discuss` is optional — skip if requirements are clear
- Requirements change mid-work? Plan mode → `ingest` → resume `apply`

## Parked Changes

Changes can be parked（暫存）— temporarily moved out of `openspec/changes/`. Parked changes won't appear in `spectra list` but can be found with `spectra list --parked`. To restore: `spectra unpark <name>`. The `/spectra:apply` and `/spectra:ingest` skills handle parked changes automatically.
<!-- SPECTRA:END -->

---

# Harness 設定

## 啟用角色
- frontend
- backend
- qa
- devops

## 專案規則
- 使用 Spectra SDD 流程時，Harness 工作流自動跳過 PM 階段（由 Spectra 處理需求）
- 所有回覆使用繁體中文，用「臺」不用「台」

## 關鍵檔案（追加）
- openspec/specs/**
- openspec/changes/**

## 關鍵檔案（排除）
- node_modules/**
- .next/**

## 部署設定
- 方式：git push
- 自動部署：false

## 備註
- 本專案同時使用 Spectra（Spec-Driven Development）和 Harness 工程系統
- Spectra 負責需求規格管理，Harness 負責團隊角色協作和品質護欄
- 當兩者並用時：Spectra 的 propose/discuss 取代 PM 角色，後續由 Tech Lead 接手架構設計
