import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  PACKAGE_NAME,
  MANAGED_MARKER,
  codexSkillsRoot,
  codexSkillDir,
  skillsRoot,
  version,
} from "../context.mjs";

const COPY_ENTRIES = [
  "SKILL.md",
  "knowledge",
  "scripts",
  "claude-code",
  "package.json",
];

async function inspectExistingInstall() {
  if (!existsSync(codexSkillDir)) {
    return "missing";
  }

  const markerPath = resolve(codexSkillDir, MANAGED_MARKER);
  if (existsSync(markerPath)) {
    try {
      const marker = JSON.parse(await readFile(markerPath, "utf8"));
      if (marker?.packageName === PACKAGE_NAME) {
        return "managed";
      }
    } catch {
      return "foreign";
    }
  }

  try {
    const packageStat = await stat(resolve(codexSkillDir, "package.json"));
    const skillStat = await stat(resolve(codexSkillDir, "SKILL.md"));
    if (packageStat.isFile() && skillStat.isFile()) {
      const installedPackageJson = JSON.parse(
        await readFile(resolve(codexSkillDir, "package.json"), "utf8"),
      );
      if (installedPackageJson?.name === PACKAGE_NAME) {
        return "managed";
      }
    }
  } catch {
    return "foreign";
  }

  return "foreign";
}

export async function install(_opts) {
  await mkdir(codexSkillsRoot, { recursive: true });

  const existingState = await inspectExistingInstall();
  if (existingState === "foreign") {
    console.error(
      `Refusing to overwrite existing non-managed skill at ${codexSkillDir}`,
    );
    console.error(
      "Remove or rename that skill directory first, then rerun install-codex.",
    );
    process.exitCode = 1;
    return;
  }

  await rm(codexSkillDir, { recursive: true, force: true });
  await mkdir(codexSkillDir, { recursive: true });

  for (const entry of COPY_ENTRIES) {
    const source = resolve(skillsRoot, entry);
    if (!existsSync(source)) {
      continue;
    }

    const destination = resolve(codexSkillDir, entry);
    await cp(source, destination, {
      recursive: true,
      force: true,
    });
  }

  await writeFile(
    resolve(codexSkillDir, MANAGED_MARKER),
    JSON.stringify(
      {
        packageName: PACKAGE_NAME,
        version,
        sourceRoot: skillsRoot,
        installedAt: new Date().toISOString(),
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  console.log(
    `${existingState === "managed" ? "Updated" : "Installed"} Codex skill at ${codexSkillDir}`,
  );
}

export async function uninstall(_opts) {
  const existingState = await inspectExistingInstall();
  if (existingState === "missing") {
    console.log("Codex skill not installed. Nothing to remove.");
    return;
  }
  if (existingState === "foreign") {
    console.error(
      `Refusing to remove non-managed skill at ${codexSkillDir}`,
    );
    process.exitCode = 1;
    return;
  }

  await rm(codexSkillDir, { recursive: true, force: true });
  console.log(`Removed Codex skill from ${codexSkillDir}`);
}

export async function status(_opts) {
  const existingState = await inspectExistingInstall();
  if (existingState === "managed") {
    try {
      const markerPath = resolve(codexSkillDir, MANAGED_MARKER);
      const marker = JSON.parse(await readFile(markerPath, "utf8"));
      return { installed: true, version: marker.version ?? "unknown" };
    } catch {
      return { installed: true, version: "unknown" };
    }
  }
  return { installed: false };
}
