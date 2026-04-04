# Changelog

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
