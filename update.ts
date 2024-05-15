import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import process from "node:process";
import { rimraf } from "rimraf";
import chalk from "chalk";

const techdocPath = "./sdks/tech-doc";
const groupName = "Technical Documentation";

async function main() {
  await updateOpenApi();
  await generateTechDocs();
}

async function updateOpenApi() {
  await rimraf("./build-on-evm/evm-api/restful-api");
  await runCommand(
    "npx @mintlify/scraping@latest openapi-file ./evm.openapi.yaml -o ./build-on-evm/evm-api/restful-api"
  );

  let basePath = "./build-on-evm/evm-api/restful-api";
  let files = await fs.readdir(basePath, { recursive: true });
  await Promise.all(
    files.map(async (fileName) => {
      const filePath = path.join(basePath, fileName);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) return;
      let file = await fs.readFile(filePath, { encoding: "utf-8" });
      file = file.replace(/openapi: /, "openapi: evm.openapi ");
      return fs.writeFile(filePath, file);
    })
  );

  await rimraf("./build-on-near/near-api/restful-api");
  await runCommand(
    "npx @mintlify/scraping@latest openapi-file ./near.openapi.yaml -o ./build-on-near/near-api/restful-api"
  );
  await fs.rename(
    "./build-on-near/near-api/restful-api/restful_public",
    "./build-on-near/near-api/restful-api/public"
  );
  await fs.rename(
    "./build-on-near/near-api/restful-api/restful_private",
    "./build-on-near/near-api/restful-api/private"
  );

  basePath = "./build-on-near/near-api/restful-api";
  files = await fs.readdir(basePath, { recursive: true });
  await Promise.all(
    files.map(async (fileName) => {
      const filePath = path.join(basePath, fileName);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) return;
      let file = await fs.readFile(filePath, { encoding: "utf-8" });
      file = file.replace(/openapi: /, "openapi: near.openapi ");
      return fs.writeFile(filePath, file);
    })
  );
}

async function generateTechDocs() {
  const currentCwd = process.cwd();
  const tmpFolder = await fs.mkdtemp(path.join(tmpdir(), "js-sdk-"));
  await runCommand(`git clone --depth 1 --branch docs https://github.com/OrderlyNetwork/js-sdk.git ${tmpFolder}`);
  process.chdir(tmpFolder);
  await runCommand(`pnpm install --no-frozen-lockfile`);
  await runCommand("pnpm run build");
  await runCommand("pnpm run docs");
  process.chdir(currentCwd);
  const sdkPath = path.join(tmpFolder, "docs");

  try {
    await fs.rm(techdocPath, { recursive: true, force: true });
  } catch {}
  await fs.mkdir(techdocPath, { recursive: true });
  try {
    await fs.unlink("./mint.json");
  } catch {}

  const mint = JSON.parse(await fs.readFile("./mint-base.json", { encoding: "utf-8" }));
  const techDoc: { group: string; pages: (string | { group: string; pages: string[] })[] } = {
    group: groupName,
    pages: []
  };
  mint.navigation.push(techDoc);

  const files = await fs.readdir(sdkPath, { recursive: true });
  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const filePath = path.join(sdkPath, file);
    let fileContent = await fs.readFile(filePath, { encoding: "utf-8" });

    // remove .md from links
    fileContent = fileContent.replace(/\.md/g, "");

    // make all links relative so that they are not opened in new tab
    const regex = /\][(]([^/].*?)[)]/;
    let match = fileContent.match(regex);
    while (
      match != null &&
      match[1] != null &&
      !match[1].startsWith("http") &&
      match.index != null
    ) {
      const fixedLink = path.join("/sdks/tech-doc", path.dirname(file), match[1]);
      fileContent =
        fileContent.slice(0, match.index + 2) +
        fixedLink +
        fileContent.slice(match.index + match[1].length + 2);

      match = fileContent.match(regex);
    }

    const techdocFilePath = path.join(techdocPath, `${file}x`);
    const techdocDirPath = path.dirname(techdocFilePath);
    await fs.mkdir(techdocDirPath, { recursive: true });
    await fs.writeFile(techdocFilePath, fileContent);

    const relativePath = path.relative(techdocPath, techdocDirPath);
    if (!relativePath) {
      techDoc.pages.push(path.join(techdocPath, file.substring(0, file.length - 3)));
    } else {
      const subGroupName = `${relativePath.charAt(0).toUpperCase()}${relativePath.substring(1)}`;
      let subCategory = techDoc.pages.find((nav) => {
        if (typeof nav === "object") {
          return nav.group === subGroupName;
        } else {
          false;
        }
      }) as
        | {
            group: string;
            pages: string[];
          }
        | undefined;
      if (!subCategory) {
        subCategory = { group: subGroupName, pages: [] };
        techDoc.pages.push(subCategory);
      }
      subCategory.pages.push(path.join(techdocPath, file.substring(0, file.length - 3)));
    }
  }
  await fs.writeFile("./mint.json", JSON.stringify(mint, undefined, 2));

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
