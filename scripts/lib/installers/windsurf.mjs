import { resolve } from "node:path";
import { projectRoot, windsurfGlobalPath } from "../context.mjs";
import { generateInlineSummary } from "../content.mjs";
import { writeBlock, removeBlock, checkBlock } from "../managed-block.mjs";

function targetPath(opts) {
  if (opts?.global) return windsurfGlobalPath;
  return resolve(projectRoot(), ".windsurfrules");
}

export async function install(opts) {
  const filePath = targetPath(opts);
  const content = await generateInlineSummary();
  const result = await writeBlock(filePath, content);

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
