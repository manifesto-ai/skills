import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname } from "node:path";
import { PACKAGE_NAME, version } from "./context.mjs";

const BEGIN_TAG = `<!-- BEGIN MANAGED BLOCK: ${PACKAGE_NAME}`;
const END_TAG = `<!-- END MANAGED BLOCK: ${PACKAGE_NAME} -->`;

function beginLine() {
  return `${BEGIN_TAG} v${version} -->`;
}

function endLine() {
  return END_TAG;
}

/**
 * Wrap content in managed block delimiters.
 */
export function wrapBlock(content) {
  return `${beginLine()}\n${content}\n${endLine()}`;
}

/**
 * Detect a managed block in file content.
 * Returns { found, startIndex, endIndex } where indices are character offsets.
 */
export function detectBlock(fileContent) {
  const startIdx = fileContent.indexOf(BEGIN_TAG);
  if (startIdx === -1) return { found: false, startIndex: -1, endIndex: -1 };

  const endIdx = fileContent.indexOf(END_TAG, startIdx);
  if (endIdx === -1) return { found: false, startIndex: -1, endIndex: -1 };

  return {
    found: true,
    startIndex: startIdx,
    endIndex: endIdx + END_TAG.length,
  };
}

/**
 * Write a managed block into a file.
 *
 * - If file doesn't exist: create it with just the block.
 * - If file exists with a managed block: replace it in place.
 * - If file exists without a managed block: append block at end.
 */
export async function writeBlock(filePath, content) {
  const block = wrapBlock(content);
  const dir = dirname(filePath);

  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  if (!existsSync(filePath)) {
    await writeFile(filePath, block + "\n", "utf8");
    return "created";
  }

  const existing = await readFile(filePath, "utf8");
  const detection = detectBlock(existing);

  if (detection.found) {
    const before = existing.slice(0, detection.startIndex);
    const after = existing.slice(detection.endIndex);
    await writeFile(filePath, before + block + after, "utf8");
    return "updated";
  }

  const separator = existing.endsWith("\n") ? "\n" : "\n\n";
  await writeFile(filePath, existing + separator + block + "\n", "utf8");
  return "appended";
}

/**
 * Remove the managed block from a file.
 * Returns true if a block was removed, false if none found.
 */
export async function removeBlock(filePath) {
  if (!existsSync(filePath)) return false;

  const existing = await readFile(filePath, "utf8");
  const detection = detectBlock(existing);

  if (!detection.found) return false;

  let before = existing.slice(0, detection.startIndex);
  let after = existing.slice(detection.endIndex);

  // Clean up extra blank lines at the join point
  let result = before + after;
  result = result.replace(/\n{3,}/g, "\n\n").trim();

  if (result.length === 0) {
    // File would be empty — leave a blank file or delete it?
    // Leave it empty to avoid surprising deletions.
    await writeFile(filePath, "", "utf8");
  } else {
    await writeFile(filePath, result + "\n", "utf8");
  }

  return true;
}

/**
 * Check if a managed block exists in a file and extract its version.
 */
export async function checkBlock(filePath) {
  if (!existsSync(filePath)) return { installed: false };

  const existing = await readFile(filePath, "utf8");
  const detection = detectBlock(existing);

  if (!detection.found) return { installed: false };

  // Extract version from begin tag
  const blockContent = existing.slice(
    detection.startIndex,
    detection.endIndex,
  );
  const versionMatch = blockContent.match(
    /BEGIN MANAGED BLOCK: @manifesto-ai\/skills v([\d.]+)/,
  );

  return {
    installed: true,
    version: versionMatch ? versionMatch[1] : "unknown",
  };
}
