# @manifesto-ai/skills

Manifesto guidance pack for AI coding tools.

Install this package only if your team actually uses Codex, Claude Code, Cursor, Copilot, or Windsurf. It is not required for normal runtime setup.

The packaged guidance is aligned to the current public seams:

- base runtime via `@manifesto-ai/sdk`
- advanced runtime via `@manifesto-ai/lineage` and `@manifesto-ai/governance`
- domain inspection and runtime debugging via `@manifesto-ai/studio-cli`
- projection-first offline analysis via `@manifesto-ai/studio-core`
- projected vs canonical snapshot boundaries

This package is aimed at agents using Manifesto in apps, tools, and experiments, not at maintaining Manifesto core itself.

## Quick Start

```bash
npm i -D @manifesto-ai/skills
```

Install only for the tool you use:

```bash
npx manifesto-skills install-codex      # Codex
npx manifesto-skills install-claude     # Claude Code
npx manifesto-skills install-cursor     # Cursor
npx manifesto-skills install-copilot    # GitHub Copilot
npx manifesto-skills install-windsurf   # Windsurf

npx manifesto-skills install-all        # All of the above
```

Check what is currently installed:

```bash
npx manifesto-skills status
```

With pnpm, replace `npx` with `pnpm exec`.

If package-manager exec is unavailable:

```bash
node ./node_modules/@manifesto-ai/skills/scripts/manifesto-skills.mjs install-all
```

## When To Use It

Use `@manifesto-ai/skills` when:

- the project already uses Manifesto and you want the AI tool to load the current Manifesto seams
- you want Codex or another agent to understand runtime, tooling, and Studio boundaries without inventing local conventions

Do not use it as a substitute for runtime/bootstrap packages such as `@manifesto-ai/sdk`, `@manifesto-ai/compiler`, or `@manifesto-ai/cli`.

## Installer Targets

| Command | Target file | Strategy |
|---------|------------|----------|
| `install-codex` | `~/.codex/skills/manifesto/` | Copies skill + knowledge files |
| `install-claude` | `CLAUDE.md` | Appends `@`-reference to `SKILL.md` |
| `install-cursor` | `.cursor/rules/manifesto.mdc` | Creates MDC with inlined rules |
| `install-copilot` | `.github/copilot-instructions.md` | Appends inlined rules and knowledge paths |
| `install-windsurf` | `.windsurfrules` | Appends inlined rules and knowledge paths |

Project-level installers use a managed-block strategy. They only touch their own delimited section and preserve everything else in the file.

## Removing

```bash
npx manifesto-skills uninstall-claude
npx manifesto-skills uninstall-all
```

## Notes

- This package does not auto-install from `postinstall`. Setup is explicit.
- The installer refuses to overwrite existing non-managed files or directories.
- Safe to rerun when the package updates: managed blocks are replaced in place.
- Knowledge files are not duplicated for project-level tools; they reference `node_modules/`.
- The installed knowledge is intended to be self-contained for normal integrations.
