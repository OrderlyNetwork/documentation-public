import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import process from "node:process";
import { rimraf } from "rimraf";
import chalk from "chalk";

const techdocPath = "./sdks/tech-doc";

function toPosixPath(value: string) {
  return value.split(path.sep).join(path.posix.sep);
}

function buildTechDocLinkLookup(files: string[]) {
  const lookup = new Map<string, string>();

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const slug = toPosixPath(file.substring(0, file.length - 3));
    lookup.set(path.posix.basename(slug), path.posix.join("/sdks/tech-doc", slug));
  }

  return lookup;
}

function resolveTechDocLink(href: string, currentFile: string, lookup: Map<string, string>) {
  if (
    href.startsWith("http") ||
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("mailto:")
  ) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const rawTarget = hashIndex === -1 ? href : href.slice(0, hashIndex);
  const fragment = hashIndex === -1 ? "" : href.slice(hashIndex);
  const normalizedTarget = toPosixPath(rawTarget);
  const currentDir = path.posix.dirname(toPosixPath(currentFile));

  if (normalizedTarget.startsWith(".")) {
    return path.posix.join("/sdks/tech-doc", path.posix.normalize(path.posix.join(currentDir, normalizedTarget))) + fragment;
  }

  const lookedUpTarget = lookup.get(normalizedTarget);
  if (lookedUpTarget) {
    return `${lookedUpTarget}${fragment}`;
  }

  if (normalizedTarget.includes("/")) {
    return path.posix.join("/sdks/tech-doc", path.posix.normalize(path.posix.join(currentDir, normalizedTarget))) + fragment;
  }

  return href;
}

function rewriteTechDocLinks(content: string, currentFile: string, lookup: Map<string, string>) {
  return content.replace(/\]\(([^)]+)\)/g, (match, href: string) => {
    const resolvedHref = resolveTechDocLink(href, currentFile, lookup);
    if (resolvedHref === href) {
      return match;
    }

    return match.replace(href, resolvedHref);
  });
}

async function main() {
  await updateOpenApi();
  await generateTechDocs();
}

async function updateOpenApi() {
  await rimraf("./build-on-omnichain/restful-api");
  await runCommand(
    "npx @mintlify/scraping@3.0.185 openapi-file ./orderly.openapi.yaml -o ./build-on-omnichain/restful-api"
  );

  let basePath = "./build-on-omnichain/restful-api";
  let files = await fs.readdir(basePath, { recursive: true });
  await Promise.all(
    files.map(async (fileName) => {
      const filePath = path.join(basePath, fileName);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) return;
      let file = await fs.readFile(filePath, { encoding: "utf-8" });
      file = file.replace(/openapi: /, "openapi: orderly.openapi ");
      return fs.writeFile(filePath, file);
    })
  );

}

async function generateTechDocs() {
  const currentCwd = process.cwd();
  const tmpFolder = await fs.mkdtemp(path.join(tmpdir(), "js-sdk-"));
  await runCommand(
    `git clone --depth 1 --branch docs https://github.com/OrderlyNetwork/js-sdk.git ${tmpFolder}`
  );
  process.chdir(tmpFolder);
  await runCommand("npx pnpm install --no-frozen-lockfile");
  await runCommand("npx pnpm run build");
  await runCommand("npx pnpm run docs");
  process.chdir(currentCwd);
  const sdkPath = path.join(tmpFolder, "docs");

  await fs.rm(techdocPath, { recursive: true, force: true });
  await fs.mkdir(techdocPath, { recursive: true });
  const files = await fs.readdir(sdkPath, { recursive: true });
  const techDocLinkLookup = buildTechDocLinkLookup(files);
  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const filePath = path.join(sdkPath, file);
    let fileContent = await fs.readFile(filePath, { encoding: "utf-8" });

    // remove .md from links
    fileContent = fileContent.replace(/\.md/g, "");

    fileContent = rewriteTechDocLinks(fileContent, file, techDocLinkLookup);

    const techdocFilePath = path.join(techdocPath, `${file}x`);
    const techdocDirPath = path.dirname(techdocFilePath);
    await fs.mkdir(techdocDirPath, { recursive: true });
    await fs.writeFile(techdocFilePath, fileContent);
  }

  await rimraf(tmpFolder);
}

function runCommand(input: string) {
  return new Promise<void>((resolve, reject) => {
    const [cmd, ...rest] = input.split(" ");
    const command = spawn(cmd, rest);

    command.stdout.on("data", (data) => {
      console.log(`${data}`);
    });

    command.stderr.on("data", (data) => {
      console.error(chalk.redBright(data));
    });

    command.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

main();
