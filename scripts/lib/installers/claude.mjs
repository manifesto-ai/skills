import { resolve } from "node:path";
import { projectRoot } from "../context.mjs";
import { writeBlock, removeBlock, checkBlock } from "../managed-block.mjs";

const CONTENT = `See @node_modules/@manifesto-ai/skills/SKILL.md for Manifesto integration guidance.`;

function targetPath() {
  return resolve(projectRoot(), "CLAUDE.md");
}

export async function install() {
  const filePath = targetPath();
  const result = await writeBlock(filePath, CONTENT);

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
    console.log("No managed block found in CLAUDE.md. Nothing to remove.");
  }
}

export async function status() {
  return checkBlock(targetPath());
}
