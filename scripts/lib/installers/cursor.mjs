import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { projectRoot, skillsRoot, cursorGlobalRulePath } from "../context.mjs";
import { writeBlock, removeBlock, checkBlock } from "../managed-block.mjs";

function targetPath(opts) {
  if (opts?.global) return cursorGlobalRulePath;
  return resolve(projectRoot(), ".cursor/rules/manifesto.mdc");
}

function rewriteKnowledgePaths(content, opts) {
  if (opts?.global) {
    return content.replace(
      /@knowledge\//g,
      `${resolve(skillsRoot, "knowledge")}/`,
    );
  }
  return content.replace(
    /@knowledge\//g,
    "node_modules/@manifesto-ai/skills/knowledge/",
  );
}

async function generateContent(opts) {
  const skillMd = await readFile(
    resolve(skillsRoot, "SKILL.md"),
    "utf8",
  );

  // Strip YAML frontmatter — Cursor MDC has its own
  const stripped = skillMd.replace(/^---[\s\S]*?---\n*/, "");
  return rewriteKnowledgePaths(stripped, opts);
}

const MDC_FRONTMATTER = `---
description: Manifesto integration guidance for MEL, SDK, effects, patches, and runtime seams
globs:
alwaysApply: true
---`;

export async function install(opts) {
  const filePath = targetPath(opts);
  const content = await generateContent(opts);
  const fullContent = `${MDC_FRONTMATTER}\n\n${content}`;
  const result = await writeBlock(filePath, fullContent);

  const verb =
    result === "created"
      ? "Created"
      : result === "updated"
        ? "Updated"
        : "Appended to";
  const scope = opts?.global ? " (global)" : "";
  console.log(`${verb} ${filePath}${scope}`);
}

export async function uninstall(opts) {
  const filePath = targetPath(opts);
  const removed = await removeBlock(filePath);

  if (removed) {
    console.log(`Removed managed block from ${filePath}`);
  } else {
    console.log(`No managed block found in ${filePath}. Nothing to remove.`);
  }
}

export async function status(opts) {
  return checkBlock(targetPath(opts));
}
