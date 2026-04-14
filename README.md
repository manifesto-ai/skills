# @manifesto-ai/skills

Manifesto guidance pack for AI coding tools.

Install this package only if your team uses Codex, Claude Code, Cursor, Copilot, or Windsurf. It is not required for normal runtime setup.

The packaged guidance is aligned to the current public seams:

- base runtime via `@manifesto-ai/sdk`
- advanced runtime via `@manifesto-ai/lineage` and `@manifesto-ai/governance`
- legality and intent-explanation reads across SDK-derived runtimes
- current MEL/compiler contract including bounded lowering-only sugar such as `absDiff`, `clamp`, `idiv`, `streak`, `match`, `argmax`, and `argmin`
- domain inspection and runtime debugging via `@manifesto-ai/studio-cli`
- projection-first offline analysis via `@manifesto-ai/studio-core`
- projected vs canonical snapshot boundaries

This package targets agents using Manifesto in apps, tools, and experiments — not Manifesto core maintenance.

## Installation

### vibe-rules (recommended)

The simplest way to install for any supported editor:

```bash
npx vibe-rules install claude-code @manifesto-ai/skills
npx vibe-rules install cursor      @manifesto-ai/skills
npx vibe-rules install windsurf    @manifesto-ai/skills
npx vibe-rules install codex       @manifesto-ai/skills
```

### manifesto-skills CLI

For more control, use the bundled CLI directly after installing the package:

```bash
npm i -D @manifesto-ai/skills
```

Install for a specific tool:

```bash
npx manifesto-skills install-codex      # Codex   (always global: ~/.codex/skills/manifesto/)
npx manifesto-skills install-claude     # Claude Code (project: CLAUDE.md)
npx manifesto-skills install-cursor     # Cursor (project: .cursor/rules/manifesto.mdc)
npx manifesto-skills install-copilot    # GitHub Copilot (project: .github/copilot-instructions.md)
npx manifesto-skills install-windsurf   # Windsurf (project: .windsurfrules)

npx manifesto-skills install-all        # All of the above
```

Install globally (user-level, not project-local):

```bash
npx manifesto-skills install-claude    --global   # ~/.claude/CLAUDE.md
npx manifesto-skills install-cursor    --global   # ~/.cursor/rules/manifesto.mdc
npx manifesto-skills install-windsurf  --global   # ~/.windsurf/rules/manifesto.md

npx manifesto-skills install-all       --global
```

Check what is currently installed:

```bash
npx manifesto-skills status
npx manifesto-skills status --global
```

With pnpm, replace `npx` with `pnpm exec`.

## Installer Targets

| Command | Default target | `--global` target | Strategy |
|---------|---------------|-------------------|----------|
| `install-codex` | `~/.codex/skills/manifesto/` | (always global) | Copies skill + knowledge files |
| `install-claude` | `CLAUDE.md` | `~/.claude/CLAUDE.md` | Appends `@`-reference to `SKILL.md` |
| `install-cursor` | `.cursor/rules/manifesto.mdc` | `~/.cursor/rules/manifesto.mdc` | Creates MDC with inlined rules |
| `install-copilot` | `.github/copilot-instructions.md` | (project-only) | Appends inlined rules and knowledge paths |
| `install-windsurf` | `.windsurfrules` | `~/.windsurf/rules/manifesto.md` | Appends inlined rules and knowledge paths |

Project-level installers use a managed-block strategy. They only touch their own delimited section and preserve everything else in the file. Safe to rerun after updates — managed blocks are replaced in place.

## Removing

```bash
npx manifesto-skills uninstall-claude
npx manifesto-skills uninstall-all
npx manifesto-skills uninstall-all --global
```

## When To Use It

Use `@manifesto-ai/skills` when:

- the project already uses Manifesto and you want the AI tool to understand current runtime seams
- you want Codex or another agent to reason about runtime, tooling, and Studio boundaries without inventing local conventions

Do not use it as a substitute for runtime packages such as `@manifesto-ai/sdk`, `@manifesto-ai/compiler`, or `@manifesto-ai/cli`.

## Notes

- This package does not auto-install via `postinstall`. Setup is always explicit.
- The installer refuses to overwrite non-managed files or directories.
- Knowledge files are not duplicated for project-level tools; they reference `node_modules/`.
- The `./llms` export is compatible with [vibe-rules](https://www.vibe-rules.com/) for cross-editor distribution.
