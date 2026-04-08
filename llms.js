/**
 * vibe-rules compatible ./llms export.
 *
 * Usage:
 *   npx vibe-rules install claude-code @manifesto-ai/skills
 *   npx vibe-rules install cursor @manifesto-ai/skills
 *   npx vibe-rules install windsurf @manifesto-ai/skills
 *   npx vibe-rules install codex @manifesto-ai/skills
 *
 * Exports an array of VibePackageRuleItem objects consumed by vibe-rules.
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const skillMd = readFileSync(resolve(__dirname, "SKILL.md"), "utf8");

// Strip YAML frontmatter — vibe-rules handles its own editor-specific formatting
const stripped = skillMd.replace(/^---[\s\S]*?---\n*/, "");

// Rewrite @knowledge/ shorthand to node_modules paths for editors that
// don't resolve package-relative paths (Cursor, Windsurf, Copilot, etc.)
const content = stripped.replace(
  /@knowledge\//g,
  "node_modules/@manifesto-ai/skills/knowledge/",
);

export default [
  {
    name: "manifesto",
    rule: content,
    description:
      "Manifesto integration guidance for MEL, SDK, effects, patches, and runtime seams",
    alwaysApply: true,
  },
];
