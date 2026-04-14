# Changelog

## [1.2.0](https://github.com/manifesto-ai/skills/compare/skills-v1.1.0...skills-v1.2.0) (2026-04-14)


### Features

* add studio guidance to skills pack ([6db54bd](https://github.com/manifesto-ai/skills/commit/6db54bd47140d82c8e2904786f2fa5b33bda6f2f))
* initialize @manifesto-ai/skills repository ([68d643c](https://github.com/manifesto-ai/skills/commit/68d643c92115ace1c2e0d9eca8d276c36dcd4538))
* multi-tool installer for Claude Code, Cursor, Copilot, Windsurf ([8d69c42](https://github.com/manifesto-ai/skills/commit/8d69c427656c7e1771f89a685931dd619197672e))
* **skills:** v0.6.0 — vibe-rules support, global install, knowledge sync to SDK 3.7.0 ([94665ee](https://github.com/manifesto-ai/skills/commit/94665eea3aad0034166b1290cc2ae8b4424d7f4c))


### Bug Fixes

* **ci:** harden manual npm publish workflow ([6c26dcf](https://github.com/manifesto-ai/skills/commit/6c26dcfca048dc48374e58c0c64cd99eaf203be4))


### Documentation

* add claude guidance shim ([ee19085](https://github.com/manifesto-ai/skills/commit/ee19085db20ceee94e1174ef6d2185c2aa1f52d4))
* clarify skills onboarding ([48eb8b0](https://github.com/manifesto-ai/skills/commit/48eb8b0cecdd20f19e7c8871271c536b4e0c50d8))
* **governance:** add settlement observer guidance ([fede132](https://github.com/manifesto-ai/skills/commit/fede13268cee4e6d8389d52a7b3a9e34231151e0))
* **governance:** add settlement observer guidance ([d58ccf8](https://github.com/manifesto-ai/skills/commit/d58ccf878acd31d9ba461f40f8c4480c66144fa6))
* **skills:** sync intent explanation guidance ([2f71474](https://github.com/manifesto-ai/skills/commit/2f7147424694bafa32382d0f926a962b56725eaa))
* **skills:** sync MEL bounded sugar guidance ([b5fb2fb](https://github.com/manifesto-ai/skills/commit/b5fb2fbb7c316f325c261d2e7fbccf23109fae6b))
* **skills:** sync MEL bounded sugar guidance ([6421d25](https://github.com/manifesto-ai/skills/commit/6421d25cdc441613ce524585f024dfdbac299a32))
* **skills:** sync runtime surface guidance ([9ce7990](https://github.com/manifesto-ai/skills/commit/9ce799093464cfc3500f8c8f542059b1f2c4e1b6))
* **skills:** sync runtime surface guidance ([ef685e8](https://github.com/manifesto-ai/skills/commit/ef685e8d61cf00ec3d5fd903e2d90d2826eaa3f9))


### Miscellaneous Chores

* **main:** release 1.0.0 ([a46ea8c](https://github.com/manifesto-ai/skills/commit/a46ea8cb37a3fa6ba24c045a5eb84ff0e151a654))
* **main:** release 1.0.0 ([88cfebb](https://github.com/manifesto-ai/skills/commit/88cfebb0ece801472092a6d27450b644cc5b9a0c))
* **main:** release 1.0.1 ([0b40b1a](https://github.com/manifesto-ai/skills/commit/0b40b1a91fea869a9a8e1815df7aba16df4229f7))
* **main:** release 1.0.1 ([f5667f5](https://github.com/manifesto-ai/skills/commit/f5667f5ebc9f5d6081c91d409545e0cde52ce5cf))
* merge main into skills intent explanation sync ([54408de](https://github.com/manifesto-ai/skills/commit/54408de05e014126925039e7186b796b7c9f91cb))
* prepare 0.3.0 release ([4bec9ec](https://github.com/manifesto-ai/skills/commit/4bec9ec703f50f68fe2bcbc599c2ff1e47a8da73))
* prepare 0.4.0 release ([aea7ed3](https://github.com/manifesto-ai/skills/commit/aea7ed35d61b58fce77a4df06ada91c1e11b10b5))
* **skills:** merge main into bounded sugar docs ([f25fe2f](https://github.com/manifesto-ai/skills/commit/f25fe2f9df4ff4ffe746d115d8a103104d20bb9a))

## [1.0.1](https://github.com/manifesto-ai/skills/compare/v1.0.0...v1.0.1) (2026-04-09)


### Bug Fixes

* **ci:** harden manual npm publish workflow ([6c26dcf](https://github.com/manifesto-ai/skills/commit/6c26dcfca048dc48374e58c0c64cd99eaf203be4))

## [Unreleased]

### Features

- sync installed knowledge to the SDK intent-explanation surface: document `explainIntent()` / `why()` / `whyNot()` on SDK-derived runtimes and `explainIntentFor()` on `@manifesto-ai/sdk/extensions`
- align lineage, governance, and runtime-map notes with the inherited explanation reads and current legality ordering
- refresh skills-pack routing notes so blocked-intent explanation questions resolve to the updated SDK/runtime knowledge files
- sync installed MEL/compiler knowledge to the current bounded sugar contract: `absDiff`, `clamp`, `idiv`, `streak`, `match`, `argmax`, and `argmin`
- refresh skills tracking metadata for MEL/compiler notes against the current `SPEC-v1.0.0`, MEL docs, and compiler package surface

## 1.0.0 (2026-04-08)


### Features

* add studio guidance to skills pack ([6db54bd](https://github.com/manifesto-ai/skills/commit/6db54bd47140d82c8e2904786f2fa5b33bda6f2f))
* initialize @manifesto-ai/skills repository ([68d643c](https://github.com/manifesto-ai/skills/commit/68d643c92115ace1c2e0d9eca8d276c36dcd4538))
* multi-tool installer for Claude Code, Cursor, Copilot, Windsurf ([8d69c42](https://github.com/manifesto-ai/skills/commit/8d69c427656c7e1771f89a685931dd619197672e))
* **skills:** v0.6.0 — vibe-rules support, global install, knowledge sync to SDK 3.7.0 ([94665ee](https://github.com/manifesto-ai/skills/commit/94665eea3aad0034166b1290cc2ae8b4424d7f4c))

## [0.6.0] (2026-04-08)

### Features

- **vibe-rules**: add `./llms` export for cross-editor installation via `npx vibe-rules install <editor> @manifesto-ai/skills`
- **global install**: add `--global` flag to `manifesto-skills` CLI for user-level installs (Claude Code → `~/.claude/CLAUDE.md`, Cursor → `~/.cursor/rules/`, Windsurf → `~/.windsurf/rules/`)
- **knowledge sync**: update knowledge files to SDK v3.7.0 and Core v2.11.0 — document `SchemaGraph.traceUp/traceDown`, `SimulationSession`, `DispatchBlocker`, `hasDispatchableGate`, `validateIntentInput`, and `dispatch:rejected` rejection codes

## [0.4.0](https://github.com/manifesto-ai/core/compare/skills-v0.3.0...skills-v0.4.0) (2026-04-04)

### Features

- multi-tool installer: support Claude Code, Cursor, GitHub Copilot, and Windsurf in addition to Codex
- add `install-all`, `uninstall-*`, and `status` CLI commands
- managed block pattern for safe project-level config file updates

## [0.3.0](https://github.com/manifesto-ai/core/compare/skills-v0.2.3...skills-v0.3.0) (2026-04-04)

### Features

- add Studio CLI and Studio core guidance to the published skills pack
- ignore local IDE and package tarball artifacts in git

## [0.2.3](https://github.com/manifesto-ai/core/compare/skills-v0.2.2...skills-v0.2.3) (2026-04-04)

### Features

- add `@manifesto-ai/studio-cli` guidance for terminal inspection and runtime debugging
- add `@manifesto-ai/studio-core` guidance for projection-first offline analysis

## [0.2.2](https://github.com/manifesto-ai/core/compare/skills-v0.2.1...skills-v0.2.2) (2026-03-30)


### Features

* land core v4 cleanup and action availability queries ([#331](https://github.com/manifesto-ai/core/issues/331)) ([30ec2b4](https://github.com/manifesto-ai/core/commit/30ec2b481cebbf2a2640fe21fd7909d6b033a1b4))

## [0.2.1](https://github.com/manifesto-ai/core/compare/skills-v0.2.0...skills-v0.2.1) (2026-03-28)


### Features

* **skills:** add explicit codex setup flow ([#307](https://github.com/manifesto-ai/core/issues/307)) ([0f6f6eb](https://github.com/manifesto-ai/core/commit/0f6f6eb1b8ed826723c9c386c7dcaced8e3b32d4))

## [0.2.0](https://github.com/manifesto-ai/core/compare/skills-v0.1.1...skills-v0.2.0) (2026-03-25)

### Breaking Changes

- **compiler,monorepo:** `@manifesto-ai/intent-ir` and `@manifesto-ai/translator` are removed from the monorepo. `@manifesto-ai/compiler/loader` now points to Node ESM loader hooks; Webpack users should migrate to `@manifesto-ai/compiler/webpack`.

### Features

- **compiler,monorepo:** remove intent-ir/translator packages and migrate compiler integrations to unplugin ([76eadac](https://github.com/manifesto-ai/core/commit/76eadac9047308563793cf2a2d1299b1830f7f22))
- **skills:** add explicit `manifesto-skills install-codex` setup flow instead of relying on `postinstall`

## [0.1.1](https://github.com/manifesto-ai/core/compare/skills-v0.1.0...skills-v0.1.1) (2026-02-09)

### Features

- add `@manifesto-ai/skills` v0.1 LLM knowledge package ([0a387dd](https://github.com/manifesto-ai/core/commit/0a387dd683b521bfd91396e2d1b2a3c878c3b016))
