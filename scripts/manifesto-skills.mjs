#!/usr/bin/env node

import { version } from "./lib/context.mjs";

import * as codex from "./lib/installers/codex.mjs";
import * as claude from "./lib/installers/claude.mjs";
import * as cursor from "./lib/installers/cursor.mjs";
import * as copilot from "./lib/installers/copilot.mjs";
import * as windsurf from "./lib/installers/windsurf.mjs";

const TOOLS = { codex, claude, cursor, copilot, windsurf };
const TOOL_NAMES = Object.keys(TOOLS);

const args = process.argv.slice(2);
const globalFlag = args.includes("--global");
const opts = { global: globalFlag };
const [command] = args.filter((a) => !a.startsWith("--"));

switch (command) {
  // Individual installs
  case "install-codex":
  case "install-claude":
  case "install-cursor":
  case "install-copilot":
  case "install-windsurf": {
    const tool = command.replace("install-", "");
    await TOOLS[tool].install(opts);
    break;
  }

  // Install all
  case "install-all":
    for (const name of TOOL_NAMES) {
      console.log(`\n— ${name} —`);
      try {
        await TOOLS[name].install(opts);
      } catch (err) {
        console.error(`  Failed: ${err.message}`);
        process.exitCode = 1;
      }
    }
    break;

  // Individual uninstalls
  case "uninstall-codex":
  case "uninstall-claude":
  case "uninstall-cursor":
  case "uninstall-copilot":
  case "uninstall-windsurf": {
    const tool = command.replace("uninstall-", "");
    await TOOLS[tool].uninstall(opts);
    break;
  }

  // Uninstall all
  case "uninstall-all":
    for (const name of TOOL_NAMES) {
      console.log(`\n— ${name} —`);
      try {
        await TOOLS[name].uninstall(opts);
      } catch (err) {
        console.error(`  Failed: ${err.message}`);
        process.exitCode = 1;
      }
    }
    break;

  // Status
  case "status":
    await runStatus(opts);
    break;

  // Help
  case "help":
  case "--help":
  case "-h":
  case undefined:
    printHelp();
    break;

  default:
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exitCode = 1;
}

async function runStatus(opts) {
  const scope = opts?.global ? " (global)" : " (project)";
  console.log(`@manifesto-ai/skills v${version}${scope}\n`);

  for (const name of TOOL_NAMES) {
    const result = await TOOLS[name].status(opts);
    const icon = result.installed ? "●" : "○";
    const ver = result.installed ? `v${result.version}` : "not installed";
    console.log(`  ${icon} ${name.padEnd(10)} ${ver}`);
  }
}

function printHelp() {
  const tools = TOOL_NAMES.join(" | ");
  console.log(`manifesto-skills v${version}

Usage:
  manifesto-skills <command> [--global]

Install:
  install-<tool>          Install for a specific tool (${tools})
  install-all             Install for all supported tools

Uninstall:
  uninstall-<tool>        Remove from a specific tool
  uninstall-all           Remove from all tools

Flags:
  --global                Install/uninstall at the user level (not project-local)
                          Codex is always global. Copilot is always project-local.

Other:
  status [--global]       Show installation status for all tools
  help                    Show this message
`);
}
