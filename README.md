# @manifesto-ai/skills

Standalone repository for the Manifesto integration skills pack.

LLM knowledge pack for Manifesto.

The packaged guidance is aligned to the current public seams:

- base runtime via `@manifesto-ai/sdk`
- continuity via `@manifesto-ai/lineage`
- legitimacy via `@manifesto-ai/governance`
- domain inspection and runtime debugging via `@manifesto-ai/studio-cli`
- projection-first offline analysis via `@manifesto-ai/studio-core`
- projected vs canonical snapshot boundaries

This package is aimed at agents using Manifesto in apps, tools, and experiments, not at maintaining Manifesto core itself.

## Quick setup

```bash
npm i -D @manifesto-ai/skills
```

Install for your AI coding tool(s):

```bash
npx manifesto-skills install-claude     # Claude Code
npx manifesto-skills install-codex      # Codex
npx manifesto-skills install-cursor     # Cursor
npx manifesto-skills install-copilot    # GitHub Copilot
npx manifesto-skills install-windsurf   # Windsurf

npx manifesto-skills install-all        # All of the above
```

Check what's installed:

```bash
npx manifesto-skills status
```

With pnpm, replace `npx` with `pnpm exec`.

If package-manager exec is unavailable:

```bash
node ./node_modules/@manifesto-ai/skills/scripts/manifesto-skills.mjs install-all
```

## What each installer does

| Command | Target file | Strategy |
|---------|------------|----------|
| `install-codex` | `~/.codex/skills/manifesto/` | Copies skill + knowledge files |
| `install-claude` | `CLAUDE.md` | Appends `@`-reference to SKILL.md |
| `install-cursor` | `.cursor/rules/manifesto.mdc` | Creates MDC with inlined rules |
| `install-copilot` | `.github/copilot-instructions.md` | Appends inlined rules + knowledge paths |
| `install-windsurf` | `.windsurfrules` | Appends inlined rules + knowledge paths |

Project-level installers (claude, cursor, copilot, windsurf) use a **managed block** pattern — they only touch their own delimited section and preserve everything else in the file.

## Removing

```bash
npx manifesto-skills uninstall-claude   # Remove from a specific tool
npx manifesto-skills uninstall-all      # Remove from all tools
```

## Notes

- This package does not auto-install from `postinstall`. Setup is explicit.
- The installer refuses to overwrite existing non-managed files/directories.
- Safe to rerun when the package updates — managed blocks are replaced in place.
- Knowledge files are not duplicated for project-level tools; they reference `node_modules/`.
- The installed knowledge is intended to be self-contained for normal integrations.
