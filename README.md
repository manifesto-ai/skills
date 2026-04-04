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

## Codex setup

With npm:

```bash
npm i -D @manifesto-ai/skills
npm exec manifesto-skills install-codex
```

With pnpm:

```bash
pnpm add -D @manifesto-ai/skills
pnpm exec manifesto-skills install-codex
```

This installs the managed `manifesto` skill into `$CODEX_HOME/skills/manifesto` or `~/.codex/skills/manifesto`.
The setup is explicit so package-manager `postinstall` approval policies do not block installation.
Rerun the install command after upgrading `@manifesto-ai/skills` if you want the managed Codex skill refreshed to the latest seam knowledge.

If package-manager exec is unavailable, run:

```bash
node ./node_modules/@manifesto-ai/skills/scripts/manifesto-skills.mjs install-codex
```

After installation, restart Codex.

## Claude Code setup

Add this to your `CLAUDE.md`:

```md
See @node_modules/@manifesto-ai/skills/SKILL.md for Manifesto integration guidance.
```

Prefer wording like "integration guidance" when describing this package. It is meant for agents using Manifesto in an app, not for maintaining Manifesto core internals.

## Notes

- This package does not auto-install Codex files from `postinstall`.
- The installer refuses to overwrite an existing non-managed `manifesto` skill directory.
- The managed install is safe to rerun when the package updates.
- The managed install copies the skill and its knowledge files only. It does not vendor repo source docs or tracking metadata.
- The installed knowledge is intended to be self-contained for normal integrations.
