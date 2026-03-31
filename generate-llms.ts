import fs from "node:fs/promises";
import path from "node:path";

type DocsNode = string | { group?: string; pages?: DocsNode[] };

type DocsTab = { tab?: string; groups?: DocsGroup[] };
type DocsGroup = { group?: string; pages?: DocsNode[] };
type DocsJson = {
  navigation?: { versions?: Array<{ version?: string; tabs?: DocsTab[] }> };
};

type LlmsConfig = {
  site: {
    name: string;
    baseUrl: string;
    description: string;
    apiBase: { mainnet: string; testnet: string };
    auth: string;
  };
  compactSections: Array<{ title: string; routes: string[] }>;
  canonicalPages: string[];
};

type PageInfo = {
  route: string;
  title: string;
  summary: string;
  sourceUrl: string;
  content: string;
};

type OpenApiSummaryMap = Map<string, { summary: string; method: string; path: string }>;

const ROOT = process.cwd();

async function main() {
  const docs = await readJson<DocsJson>("docs.json");
  const llms = await readJson<LlmsConfig>("llms.config.json");

  const openApiSpecs = new Map<string, OpenApiSummaryMap>();
  for (const specName of ["orderly.openapi", "sv.openapi"]) {
    const summaries = await parseOpenApiSummaries(specName);
    openApiSpecs.set(specName, summaries);
  }

  const liveRoutes = collectLiveRoutes(docs);
  const liveRouteSet = new Set(liveRoutes);

  validateCompactRoutes(llms, liveRouteSet);

  const pageCache = new Map<string, PageInfo>();
  for (const route of liveRoutes) {
    const page = await readPage(route, llms.site.baseUrl, openApiSpecs);
    if (page) {
      pageCache.set(route, page);
    }
  }

  const compactOutput = buildCompactOutput(llms, pageCache);
  const fullOutput = buildFullOutput(llms, docs, pageCache);

  await fs.writeFile(path.join(ROOT, "llms.txt"), compactOutput, "utf8");
  await fs.writeFile(path.join(ROOT, "llms-full.txt"), fullOutput, "utf8");

  console.log(`Generated llms.txt (${compactOutput.length} chars)`);
  console.log(`Generated llms-full.txt (${fullOutput.length} chars)`);
}

function collectLiveRoutes(docs: DocsJson) {
  const latestVersion = docs.navigation?.versions?.find((entry) => entry.version === "latest");
  const tabs = latestVersion?.tabs ?? [];
  const routes: string[] = [];
  const seen = new Set<string>();

  const visit = (node: DocsNode) => {
    if (typeof node === "string") {
      const route = normalizeRoute(node);
      if (!seen.has(route)) {
        seen.add(route);
        routes.push(route);
      }
      return;
    }

    for (const child of node.pages ?? []) {
      visit(child);
    }
  };

  for (const tab of tabs) {
    for (const group of tab.groups ?? []) {
      for (const page of group.pages ?? []) {
        visit(page);
      }
    }
  }

  return routes;
}

function buildCompactOutput(config: LlmsConfig, pages: Map<string, PageInfo>) {
  const lines: string[] = [];
  lines.push(`# ${config.site.name}`);
  lines.push("");
  lines.push(`> ${config.site.description}`);
  lines.push("");
  lines.push(
    `API Base: \`${config.site.apiBase.mainnet}\` (Mainnet), \`${config.site.apiBase.testnet}\` (Testnet). ${config.site.auth}`
  );
  lines.push("");

  for (const section of config.compactSections) {
    lines.push(`## ${section.title}`);
    lines.push("");

    for (const route of section.routes) {
      const page = pages.get(normalizeRoute(route));
      if (!page) continue;
      lines.push(`- [${page.title}](${page.sourceUrl}): ${page.summary}`);
    }

    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
}

function buildFullOutput(config: LlmsConfig, docs: DocsJson, pages: Map<string, PageInfo>) {
  const lines: string[] = [];
  lines.push(`# ${config.site.name}`);
  lines.push("");
  lines.push(`> ${config.site.description}`);
  lines.push("");
  lines.push(
    `API Base: \`${config.site.apiBase.mainnet}\` (Mainnet), \`${config.site.apiBase.testnet}\` (Testnet). ${config.site.auth}`
  );
  lines.push("");

  const canonicalSet = new Set(config.canonicalPages.map(normalizeRoute));
  const latestVersion = docs.navigation?.versions?.find((entry) => entry.version === "latest");
  const tabs = latestVersion?.tabs ?? [];

  for (const tab of tabs) {
    const tabName = tab.tab ?? "Untitled";
    lines.push(`## ${tabName}`);
    lines.push("");

    for (const group of tab.groups ?? []) {
      emitGroup(group, pages, canonicalSet, lines, 3);
    }
  }

  return `${lines.join("\n").trim()}\n`;
}

function emitGroup(
  group: DocsGroup | DocsNode,
  pages: Map<string, PageInfo>,
  canonicalSet: Set<string>,
  lines: string[],
  depth: number
) {
  const g = group as { group?: string; pages?: DocsNode[] };
  if (!g.group || !g.pages) return;

  const prefix = "#".repeat(depth);
  lines.push(`${prefix} ${g.group}`);
  lines.push("");

  for (const node of g.pages) {
    if (typeof node === "string") {
      const page = pages.get(normalizeRoute(node));
      if (page) {
        const isReleaseNote = page.route.startsWith("release-notes/");
        if (canonicalSet.has(page.route) && !isReleaseNote) {
          lines.push(`### ${page.title}`);
          lines.push(`Source: ${page.sourceUrl}`);
          lines.push("");
          if (page.content.length > 10000) {
            console.warn(`Warning: Truncating long canonical page: ${page.route} (${page.content.length} chars)`);
          }
          const truncatedContent = page.content.length > 10000 
            ? page.content.slice(0, 9900) + "... (truncated for brevity)"
            : page.content;
          lines.push(truncatedContent);
          lines.push("");
        } else {
          lines.push(`- [${page.title}](${page.sourceUrl}): ${page.summary}`);
        }
      }
    } else if (node.group) {
      if (lines[lines.length - 1] !== "" && lines[lines.length - 1]?.startsWith("- ")) {
        lines.push("");
      }
      emitGroup(node, pages, canonicalSet, lines, depth + 1);
      continue;
    } else if (node.pages) {
      for (const child of node.pages) {
        if (typeof child === "string") {
          const page = pages.get(normalizeRoute(child));
          if (page) {
            const isReleaseNote = page.route.startsWith("release-notes/");
            if (canonicalSet.has(page.route) && !isReleaseNote) {
              lines.push(`### ${page.title}`);
              lines.push(`Source: ${page.sourceUrl}`);
              lines.push("");
              const truncatedContent = page.content.length > 10000 
                ? page.content.slice(0, 9900) + "... (truncated for brevity)"
                : page.content;
              lines.push(truncatedContent);
              lines.push("");
            } else {
              lines.push(`- [${page.title}](${page.sourceUrl}): ${page.summary}`);
            }
          }
        }
      }
    }
  }

  lines.push("");
}

function validateCompactRoutes(config: LlmsConfig, liveRoutes: Set<string>) {
  for (const section of config.compactSections) {
    for (const route of section.routes) {
      const normalized = normalizeRoute(route);
      if (!liveRoutes.has(normalized)) {
        throw new Error(`Compact section route is not in docs.json: ${normalized}`);
      }
    }
  }
}

async function readPage(
  route: string,
  baseUrl: string,
  openApiSpecs: Map<string, OpenApiSummaryMap>
): Promise<PageInfo | null> {
  const filePath = await resolveRouteFile(route);
  if (!filePath) {
    return null;
  }

  const raw = await fs.readFile(filePath, "utf8");
  const title = extractTitle(raw, route);
  const summary =
    route === "home"
      ? "Orderly documentation landing page with navigation to integration guides, API references, SDKs, Strategy Vault docs, troubleshooting, and release notes."
      : extractSummary(raw, openApiSpecs);

  const content = cleanFullContent(raw);

  return {
    route,
    title,
    summary,
    sourceUrl: `${baseUrl}/${route}`,
    content
  };
}

function cleanFullContent(raw: string) {
  return raw
    .replace(/^---[\s\S]*?---\s*/m, "") // Remove frontmatter
    .replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, "") // Remove imports
    .replace(/export\s+const\s+[\s\S]*?;/g, "") // Remove exports
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "") // Remove <style> blocks
    .replace(/style=\{\{[\s\S]*?\}\}/g, "") // Remove inline React styles
    .replace(/className=['"].*?['"]/g, "") // Remove CSS classes (noise for AI)
    .replace(/<svg[\s\S]*?>[\s\S]*?<\/svg>/gi, "[SVG Illustration]") // Replace heavy SVGs
    .trim();
}

async function resolveRouteFile(route: string) {
  const candidates = [
    `${route}.mdx`,
    `${route}.md`,
    path.join(route, "index.mdx"),
    path.join(route, "index.md")
  ];

  for (const candidate of candidates) {
    const absolutePath = path.join(ROOT, candidate);
    try {
      const stat = await fs.stat(absolutePath);
      if (stat.isFile()) {
        return absolutePath;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function extractTitle(content: string, route: string) {
  const frontmatter = getFrontmatter(content);
  const titleMatch = frontmatter.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  if (titleMatch?.[1]) {
    return titleMatch[1].trim();
  }

  const slug = route.split("/").pop() ?? route;
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function extractSummary(content: string, openApiSpecs?: Map<string, OpenApiSummaryMap>) {
  const summarySection = extractSectionText(content, "Summary");
  if (summarySection) {
    return summarizeText(summarySection);
  }

  const frontmatter = getFrontmatter(content);

  const openApiMatch = frontmatter.match(/^openapi:\s*(\S+)\s+(get|post|put|delete|patch)\s+(\S+)\s*$/im);
  if (openApiMatch && openApiSpecs) {
    const specName = openApiMatch[1];
    const method = openApiMatch[2].toLowerCase();
    const apiPath = openApiMatch[3];
    const specMap = openApiSpecs.get(specName);
    if (specMap) {
      const key = `${method} ${apiPath}`;
      const apiInfo = specMap.get(key);
      if (apiInfo) {
        return `[${apiInfo.method.toUpperCase()} ${apiInfo.path}] ${apiInfo.summary}`;
      }
    }
  }

  const descriptionMatch = frontmatter.match(/^description:\s*["']?(.+?)["']?\s*$/m);
  if (descriptionMatch?.[1]) {
    return summarizeText(descriptionMatch[1].trim());
  }

  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\s*/m, "");
  const text = cleanTextBlock(withoutFrontmatter);

  if (!text) {
    return "Reference page.";
  }

  return summarizeText(text);
}

function extractSectionText(content: string, heading: string) {
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\s*/m, "");
  const lines = withoutFrontmatter.split("\n");
  const normalizedHeading = `## ${heading}`.toLowerCase();
  const collected: string[] = [];
  let inSection = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!inSection) {
      if (trimmed.toLowerCase() === normalizedHeading) {
        inSection = true;
      }
      continue;
    }

    if (/^##\s+/.test(trimmed)) {
      break;
    }

    collected.push(line);
  }

  return collected.length > 0 ? cleanTextBlock(collected.join("\n")) : "";
}

function cleanTextBlock(content: string) {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !line.startsWith("import "))
    .filter((line) => !line.startsWith("export "))
    .filter((line) => !line.startsWith("```"))
    .filter((line) => !isLikelyMarkup(line))
    .map((line) => line.replace(/^#{1,6}\s+/, ""))
    .map((line) => line.replace(/^[-*+]\s+/, ""))
    .map((line) => line.replace(/^\d+\.\s+/, ""))
    .map((line) => line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1"))
    .join(" ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function summarizeText(text: string) {
  if (text.length <= 260) {
    return text;
  }

  return `${text.slice(0, 257)}...`;
}

function isLikelyMarkup(line: string) {
  if (line === ">") {
    return true;
  }

  if (/^<[^>]+>$/.test(line)) {
    return true;
  }

  if (/<\/?(?:Card|CardGroup|Steps|Step|Tabs|Tab|Frame|Note|Warning|Info|CodeGroup|Accordion|AccordionGroup)[\s>]/.test(line)) {
    return true;
  }

  return /<\/?[A-Za-z]|\/>|className=|style=\{\{|onClick=|src=|title=|icon=|href=|target=|rel=|cols=|\{[^}]*\}/.test(line);
}


function getFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match?.[1] ?? "";
}

function normalizeRoute(route: string) {
  return route.replace(/^\/+/, "").replace(/\/+$/, "");
}

async function parseOpenApiSummaries(specName: string): Promise<OpenApiSummaryMap> {
  const summaries: OpenApiSummaryMap = new Map();
  const filePath = path.join(ROOT, `${specName}.yaml`);

  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return summaries;
  }

  const lines = raw.split("\n");
  let currentPath = "";
  let currentMethod = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Top-level path: exactly 2-space indented line starting with /
    const pathMatch = line.match(/^  (\/\S+):\s*$/);
    if (pathMatch) {
      currentPath = pathMatch[1];
      currentMethod = "";
      continue;
    }

    // Method: exactly 4-space indented HTTP method
    if (currentPath) {
      const methodMatch = line.match(/^    (get|post|put|delete|patch):\s*$/);
      if (methodMatch) {
        currentMethod = methodMatch[1];
        continue;
      }
    }

    // Summary: exactly 6-space indented summary field under a method
    if (currentPath && currentMethod) {
      const summaryMatch = line.match(/^      summary:\s*["']?(.+?)["']?\s*$/);
      if (summaryMatch) {
        const key = `${currentMethod} ${currentPath}`;
        summaries.set(key, {
          summary: summaryMatch[1],
          method: currentMethod,
          path: currentPath
        });
        currentMethod = "";
        continue;
      }

      // If we hit another top-level key at 4-space indent that isn't a known sub-key of the method, reset
      if (/^    \S/.test(line) && !/^      /.test(line)) {
        currentMethod = "";
      }
    }

    // Reset path if we hit a top-level key (0-indent)
    if (/^\S/.test(line) && !line.startsWith(" ")) {
      currentPath = "";
      currentMethod = "";
    }
  }

  return summaries;
}

async function readJson<T>(fileName: string): Promise<T> {
  const raw = await fs.readFile(path.join(ROOT, fileName), "utf8");
  return JSON.parse(raw) as T;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
