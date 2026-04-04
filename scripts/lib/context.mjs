import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const PACKAGE_NAME = "@manifesto-ai/skills";
export const CODEX_SKILL_NAME = "manifesto";
export const MANAGED_MARKER = ".manifesto-codex-install.json";

export const skillsRoot = resolve(__dirname, "../..");

const packageJson = JSON.parse(
  await readFile(resolve(skillsRoot, "package.json"), "utf8"),
);
export const version = packageJson.version ?? "0.0.0";

export const codexHome = resolve(
  process.env.CODEX_HOME ?? resolve(homedir(), ".codex"),
);
export const codexSkillsRoot = resolve(codexHome, "skills");
export const codexSkillDir = resolve(codexSkillsRoot, CODEX_SKILL_NAME);

export function projectRoot() {
  return process.cwd();
}
