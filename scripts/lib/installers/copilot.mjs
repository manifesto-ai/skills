import { resolve } from "node:path";
import { projectRoot } from "../context.mjs";
import { generateInlineSummary } from "../content.mjs";
import { writeBlock, removeBlock, checkBlock } from "../managed-block.mjs";

function targetPath(opts) {
  if (opts?.global) {
    // Copilot has no standard user-level global rules file.
    // Fall back to project-level and warn.
    return null;
  }
  return resolve(projectRoot(), ".github/copilot-instructions.md");
}

export async function install(opts) {
  const filePath = targetPath(opts);
  if (!filePath) {
    console.log(
      "Copilot does not support a global install target. Run without --global to install into the current project.",
    );
    return;
  }
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

export async function uninstall(opts) {
  const filePath = targetPath(opts);
  if (!filePath) {
    console.log("Copilot does not support a global install target.");
    return;
  }
  const removed = await removeBlock(filePath);

  if (removed) {
    console.log(`Removed managed block from ${filePath}`);
  } else {
    console.log(`No managed block found in ${filePath}. Nothing to remove.`);
  }
}

export async function status(opts) {
  const filePath = targetPath(opts);
  if (!filePath) return { installed: false };
  return checkBlock(filePath);
}
