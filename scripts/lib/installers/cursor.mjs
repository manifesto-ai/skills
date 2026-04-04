import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { projectRoot, skillsRoot } from "../context.mjs";
import { writeBlock, removeBlock, checkBlock } from "../managed-block.mjs";

function targetPath() {
  return resolve(projectRoot(), ".cursor/rules/manifesto.mdc");
}

function rewriteKnowledgePaths(content) {
  return content.replace(
    /@knowledge\//g,
    "node_modules/@manifesto-ai/skills/knowledge/",
  );
}

async function generateContent() {
  const skillMd = await readFile(
    resolve(skillsRoot, "SKILL.md"),
    "utf8",
  );

  // Strip YAML frontmatter — Cursor MDC has its own
  const stripped = skillMd.replace(/^---[\s\S]*?---\n*/, "");
  return rewriteKnowledgePaths(stripped);
}

const MDC_FRONTMATTER = `---
description: Manifesto integration guidance for MEL, SDK, effects, patches, and runtime seams
globs:
alwaysApply: true
---`;

export async function install() {
  const filePath = targetPath();
  const content = await generateContent();
  const fullContent = `${MDC_FRONTMATTER}\n\n${content}`;
  const result = await writeBlock(filePath, fullContent);

  const verb =
    result === "created"
      ? "Created"
      : result === "updated"
        ? "Updated"
        : "Appended to";
  console.log(`${verb} ${filePath}`);
}

export async function uninstall() {
  const filePath = targetPath();
  const removed = await removeBlock(filePath);

  if (removed) {
    console.log(`Removed managed block from ${filePath}`);
  } else {
    console.log(
      "No managed block found in .cursor/rules/manifesto.mdc. Nothing to remove.",
    );
  }
}

export async function status() {
  return checkBlock(targetPath());
}
