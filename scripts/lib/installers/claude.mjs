import { resolve } from "node:path";
import { projectRoot, claudeGlobalPath, skillsRoot } from "../context.mjs";
import { writeBlock, removeBlock, checkBlock } from "../managed-block.mjs";

const PROJECT_CONTENT = `See @node_modules/@manifesto-ai/skills/SKILL.md for Manifesto integration guidance.`;

function globalContent() {
  return `See @${resolve(skillsRoot, "SKILL.md")} for Manifesto integration guidance.`;
}

function targetPath(opts) {
  if (opts?.global) return claudeGlobalPath;
  return resolve(projectRoot(), "CLAUDE.md");
}

function content(opts) {
  return opts?.global ? globalContent() : PROJECT_CONTENT;
}

export async function install(opts) {
  const filePath = targetPath(opts);
  const result = await writeBlock(filePath, content(opts));

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
