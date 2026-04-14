# Changelog

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
