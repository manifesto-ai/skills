import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { skillsRoot } from "./context.mjs";

/**
 * Generate an inline summary for tools that don't support file references
 * (Copilot, Windsurf). Reads SKILL.md and rewrites knowledge paths.
 */
export async function generateInlineSummary() {
  const skillMd = await readFile(resolve(skillsRoot, "SKILL.md"), "utf8");

  // Strip YAML frontmatter
  const stripped = skillMd.replace(/^---[\s\S]*?---\n*/, "");

  // Rewrite @knowledge/ paths to node_modules paths
  const rewritten = stripped.replace(
    /@knowledge\//g,
    "node_modules/@manifesto-ai/skills/knowledge/",
  );

  return rewritten;
}
