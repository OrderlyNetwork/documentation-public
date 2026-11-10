import fs from "node:fs/promises";
import path from "node:path";
import { spawn, execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import process from "node:process";
import { rimraf } from "rimraf";
import chalk from "chalk";

const techdocPath = "./sdks/tech-doc";
const restfulApiPath = "./build-on-omnichain/restful-api";

// Matches the `openapi:` frontmatter key mintlify's scraper writes, with or
// without the `orderly.openapi` source name prefix we add afterwards, e.g.
// "openapi: get /v1/public/announcement" or
// "openapi: orderly.openapi get /v1/public/announcement".
const OPENAPI_KEY_RE = /^openapi:\s*(?:orderly\.openapi\s+)?(.+)$/m;

function extractOpenApiKey(content: string): string | null {
  const match = content.match(OPENAPI_KEY_RE);
  return match ? match[1].trim() : null;
}

/** Recursively collects every string leaf value in a JSON-like structure. */
function collectStrings(value: unknown, out: string[]) {
  if (typeof value === "string") {
    out.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectStrings(item, out);
  }
}

/**
 * Page slugs in docs.json's navigation tree are bare paths with no leading
 * slash and no extension (e.g. "build-on-omnichain/restful-api/public/x").
 * Redirect "source"/"destination" entries reuse the same strings but with a
 * leading slash -- filtered out here since they aren't navigable pages.
 */
async function getDocsJsonPages(): Promise<Set<string>> {
  const raw = await fs.readFile("./docs.json", { encoding: "utf-8" });
  const strings: string[] = [];
  collectStrings(JSON.parse(raw), strings);
  return new Set(
    strings.filter((value) => !value.startsWith("/") && !value.includes("://") && !value.includes("."))
  );
}

/**
 * Builds a lookup of openapi operation key -> docs page path (posix, no
 * extension), one entry per operation, for every page docs.json actually
 * links to (inside or outside restful-api). Reads each page from disk if it
 * currently exists, otherwise falls back to the git HEAD version -- a
 * restful-api page can be legitimately missing right after the scraper runs
 * (see restoreNavReferencedDuplicates) but still "claims" its operation.
 */
async function buildNavOpenApiKeyLookup(docsJsonPages: Set<string>) {
  const lookup = new Map<string, string>();

  for (const docPage of docsJsonPages) {
    if (docPage.startsWith("sdks/tech-doc/")) continue;

    const filePath = `${docPage}.mdx`;
    let content: string | null;
    try {
      content = await fs.readFile(filePath, { encoding: "utf-8" });
    } catch {
      content = readFromGitHead(filePath);
    }
    if (!content) continue;

    const key = extractOpenApiKey(content);
    if (key && !lookup.has(key)) lookup.set(key, docPage);
  }

  return lookup;
}

/**
 * Hand-authored pages sometimes pin frontmatter fields (currently just
 * `title`, e.g. to mark a deprecated endpoint as "(Legacy)" in the sidebar)
 * that the scraper has no knowledge of and overwrites on every run. Re-apply
 * any such field from the git HEAD version of the page onto the freshly
 * generated content, so hand overrides survive regeneration.
 */
function reapplyTitleOverride(generatedContent: string, previousContent: string): string {
  const titleMatch = previousContent.match(/^title:.*$/m);
  if (!titleMatch) return generatedContent;
  if (/^title:/m.test(generatedContent)) return generatedContent;

  return generatedContent.replace(/^---\n/, `---\n${titleMatch[0]}\n`);
}

/**
 * Reads a path as it exists in the git HEAD commit (the state the CI check
 * diffs against), without touching the working tree.
 */
function readFromGitHead(relativePath: string): string | null {
  try {
    return execFileSync("git", ["show", `HEAD:${relativePath}`], {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

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
  const docsJsonPages = await getDocsJsonPages();

  await rimraf(restfulApiPath);
  await runCommand(
    `npx @mintlify/scraping@3.0.185 openapi-file ./orderly.openapi.yaml -o ${restfulApiPath}`
  );

  let basePath = restfulApiPath;
  let files = await fs.readdir(basePath, { recursive: true });
  await Promise.all(
    files.map(async (fileName) => {
      const filePath = path.join(basePath, fileName);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) return;
      let file = await fs.readFile(filePath, { encoding: "utf-8" });
      file = file.replace(/openapi: /, "openapi: orderly.openapi ");
      if (!file.endsWith("\n")) file += "\n";

      const previousContent = readFromGitHead(toPosixPath(filePath).replace(/^\.\//, ""));
      if (previousContent) file = reapplyTitleOverride(file, previousContent);

      return fs.writeFile(filePath, file);
    })
  );

  // Restore aliases first: removing duplicates would otherwise delete the
  // generated page an alias needs to be copied from.
  await restoreNavReferencedDuplicates(docsJsonPages);
  await removeGeneratedDuplicatesOfNavPages(docsJsonPages);
}

/**
 * The openapi scraper writes a page for every operation in the spec,
 * including operations that are already documented by a page docs.json
 * links to elsewhere -- either outside restful-api (e.g. strategy-vault/,
 * build-on-omnichain/blogpost/) or under a different restful-api slug for
 * the same operation (e.g. a stale pre-rename copy). Those extra copies
 * aren't in docs.json navigation and would otherwise reappear as untracked
 * files on every run. Delete them, keeping the one page per operation that
 * docs.json actually links to.
 */
async function removeGeneratedDuplicatesOfNavPages(docsJsonPages: Set<string>) {
  const navKeyToPage = await buildNavOpenApiKeyLookup(docsJsonPages);

  const files = await fs.readdir(restfulApiPath, { recursive: true });
  for (const fileName of files) {
    const filePath = path.join(restfulApiPath, fileName);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) continue;

    const docPage = toPosixPath(filePath).replace(/\.mdx?$/, "").replace(/^\.\//, "");
    if (docsJsonPages.has(docPage)) continue;

    const content = await fs.readFile(filePath, { encoding: "utf-8" });
    const key = extractOpenApiKey(content);
    if (key && navKeyToPage.has(key)) {
      await fs.rm(filePath);
    }
  }
}

/**
 * Some restful-api pages share an operation with another restful-api page
 * (e.g. the multilevel-referral endpoints reuse the same operation as the
 * plain referral ones) but are still individually linked from docs.json
 * navigation under their own URL. The scraper only ever writes one file per
 * operation, so these go missing on every regeneration. Restore them as a
 * byte-for-byte copy of whichever generated file now documents that same
 * operation, using the git HEAD version of the page to learn which
 * operation it used to point at.
 */
async function restoreNavReferencedDuplicates(docsJsonPages: Set<string>) {
  const files = await fs.readdir(restfulApiPath, { recursive: true });
  const generatedKeyToPath = new Map<string, string>();
  for (const fileName of files) {
    const filePath = path.join(restfulApiPath, fileName);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) continue;
    const content = await fs.readFile(filePath, { encoding: "utf-8" });
    const key = extractOpenApiKey(content);
    if (key) generatedKeyToPath.set(key, filePath);
  }

  for (const docPage of docsJsonPages) {
    if (!docPage.startsWith("build-on-omnichain/restful-api/")) continue;

    const filePath = `${docPage}.mdx`;
    const alreadyExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);
    if (alreadyExists) continue;

    const previousContent = readFromGitHead(filePath);
    const previousKey = previousContent ? extractOpenApiKey(previousContent) : null;
    if (!previousKey) {
      console.error(
        chalk.redBright(
          `${filePath} is missing after regeneration and no prior openapi key could be read from git HEAD to restore it.`
        )
      );
      process.exitCode = 1;
      continue;
    }

    const sourcePath = generatedKeyToPath.get(previousKey);
    if (!sourcePath) {
      console.error(
        chalk.redBright(
          `${filePath} is missing after regeneration and no generated page documents its operation (${previousKey}) to restore it from.`
        )
      );
      process.exitCode = 1;
      continue;
    }

    const sourceContent = await fs.readFile(sourcePath, { encoding: "utf-8" });
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    // Keep the alias's own title override rather than inheriting the source's.
    const aliasContent = reapplyTitleOverride(
      sourceContent.replace(/^title:.*\n/m, ""),
      previousContent
    );
    await fs.writeFile(filePath, aliasContent);
  }
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
