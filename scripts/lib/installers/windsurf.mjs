import { resolve } from "node:path";
import { projectRoot } from "../context.mjs";
import { generateInlineSummary } from "../content.mjs";
import { writeBlock, removeBlock, checkBlock } from "../managed-block.mjs";

function targetPath() {
  return resolve(projectRoot(), ".windsurfrules");
}

export async function install() {
  const filePath = targetPath();
  const content = await generateInlineSummary();
  const result = await writeBlock(filePath, content);

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
      "No managed block found in .windsurfrules. Nothing to remove.",
    );
  }
}

export async function status() {
  return checkBlock(targetPath());
}
