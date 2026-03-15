import fs from "node:fs/promises";
import path from "node:path";

type DocsNode = string | { pages?: DocsNode[] };

type LlmsConfig = {
  site: {
    baseUrl: string;
  };
  compactSections: Array<{ title: string; routes: string[] }>;
  canonicalPages: string[];
  pageContract?: {
    requiredSections?: string[];
    requiredFrontmatter?: string[];
    enforceOnCanonicalPages?: boolean;
  };
  verification?: {
    forbiddenRoutePatterns?: string[];
    readOnlyGeneratedDirectories?: string[];
  };
};

const ROOT = process.cwd();

async function main() {
  const docs = await readJson<{
    navigation?: { versions?: Array<{ version?: string; tabs?: Array<{ groups?: Array<{ pages?: DocsNode[] }> }> }> };
  }>("docs.json");
  const llms = await readJson<LlmsConfig>("llms.config.json");

  const liveRoutes = collectLiveRoutes(docs);
  const liveRouteSet = new Set(liveRoutes);

  const errors: string[] = [];

  await ensureFileExists("llms.txt", errors);
  await ensureFileExists("llms-full.txt", errors);

  validateConfigRoutes(llms, liveRouteSet, errors);
  await validateRouteFiles([...liveRoutes], errors);
  await validateRouteFiles(llms.canonicalPages, errors);

  const llmsTxt = await readTextSafe("llms.txt");
  const llmsFullTxt = await readTextSafe("llms-full.txt");
  const artifactText = `${llmsTxt}\n${llmsFullTxt}`;

  const artifactRoutes = extractArtifactRoutes(artifactText, llms.site.baseUrl);
  validateArtifactRoutes(artifactRoutes, liveRouteSet, errors);
  validateForbiddenRoutePatterns(artifactRoutes, llms.verification?.forbiddenRoutePatterns ?? [], errors);
  validateDuplicateCompactRoutes(llmsTxt, llms.site.baseUrl, errors);

  if (llms.pageContract?.enforceOnCanonicalPages) {
    await validatePageContract(llms, errors);
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`AI_DOCS_CHECK_FAILED: ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("AI docs verification passed.");
}

function collectLiveRoutes(docs: {
  navigation?: { versions?: Array<{ version?: string; tabs?: Array<{ groups?: Array<{ pages?: DocsNode[] }> }> }> };
}) {
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

function validateConfigRoutes(config: LlmsConfig, liveRouteSet: Set<string>, errors: string[]) {
  for (const section of config.compactSections) {
    for (const route of section.routes) {
      const normalized = normalizeRoute(route);
      if (!liveRouteSet.has(normalized)) {
        errors.push(`compact section '${section.title}' contains unknown route: ${normalized}`);
      }
    }
  }

  for (const route of config.canonicalPages) {
    const normalized = normalizeRoute(route);
    if (!liveRouteSet.has(normalized)) {
      errors.push(`canonical page is not present in docs.json: ${normalized}`);
    }
  }
}

async function validateRouteFiles(routes: string[], errors: string[]) {
  for (const route of routes) {
    const filePath = await resolveRouteFile(normalizeRoute(route));
    if (!filePath) {
      errors.push(`missing local page file for route: ${normalizeRoute(route)}`);
    }
  }
}

function extractArtifactRoutes(text: string, baseUrl: string) {
  const escapedBaseUrl = escapeRegex(baseUrl);
  const routePattern = new RegExp(`${escapedBaseUrl}/([A-Za-z0-9_./'’-]+)`, "g");
  const found = new Set<string>();
  let match = routePattern.exec(text);

  while (match) {
    found.add(normalizeRoute(match[1]));
    match = routePattern.exec(text);
  }

  return found;
}

function validateArtifactRoutes(routes: Set<string>, liveRouteSet: Set<string>, errors: string[]) {
  for (const route of routes) {
    if (!liveRouteSet.has(route)) {
      errors.push(`AI artifact contains drifted route: ${route}`);
    }
  }
}

function validateForbiddenRoutePatterns(routes: Set<string>, patterns: string[], errors: string[]) {
  for (const route of routes) {
    for (const pattern of patterns) {
      const normalizedPattern = normalizeRoute(pattern);
      if (route === normalizedPattern) {
        errors.push(`AI artifact contains forbidden drift route: ${normalizedPattern}`);
      }
    }
  }
}

function validateDuplicateCompactRoutes(llmsTxt: string, baseUrl: string, errors: string[]) {
  const escapedBaseUrl = escapeRegex(baseUrl);
  const routePattern = new RegExp(`\(${escapedBaseUrl}/([A-Za-z0-9_./'’-]+)\)`, "g");
  const counts = new Map<string, number>();
  let match = routePattern.exec(llmsTxt);

  while (match) {
    const route = normalizeRoute(match[1]);
    counts.set(route, (counts.get(route) ?? 0) + 1);
    match = routePattern.exec(llmsTxt);
  }

  for (const [route, count] of counts.entries()) {
    if (count > 1) {
      errors.push(`duplicate compact route entry in llms.txt: ${route}`);
    }
  }
}

async function validatePageContract(config: LlmsConfig, errors: string[]) {
  const sections = config.pageContract?.requiredSections ?? [];
  const requiredFrontmatter = config.pageContract?.requiredFrontmatter ?? [];
  for (const route of config.canonicalPages) {
    const filePath = await resolveRouteFile(normalizeRoute(route));
    if (!filePath) {
      continue;
    }

    const content = await fs.readFile(filePath, "utf8");
    const frontmatter = extractFrontmatter(content);

    for (const field of requiredFrontmatter) {
      const value = frontmatter.get(field);
      if (!value || value.trim().length === 0) {
        errors.push(`missing '${field}' frontmatter in canonical page: ${normalizeRoute(route)}`);
      }
    }

    for (const section of sections) {
      const heading = new RegExp(`^#{1,3}\\s+${escapeRegex(section)}\\b`, "im");
      if (!heading.test(content)) {
        errors.push(`missing '${section}' section in canonical page: ${normalizeRoute(route)}`);
      }
    }
  }
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

function extractFrontmatter(content: string) {
  const match = /^---\n([\s\S]*?)\n---/m.exec(content);
  const fields = new Map<string, string>();

  if (!match) {
    return fields;
  }

  for (const line of match[1].split("\n")) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key) {
      fields.set(key, value);
    }
  }

  return fields;
}

async function ensureFileExists(fileName: string, errors: string[]) {
  try {
    const stat = await fs.stat(path.join(ROOT, fileName));
    if (!stat.isFile()) {
      errors.push(`${fileName} is not a file`);
    }
  } catch {
    errors.push(`missing required file: ${fileName}`);
  }
}

async function readTextSafe(fileName: string) {
  try {
    return await fs.readFile(path.join(ROOT, fileName), "utf8");
  } catch {
    return "";
  }
}

function normalizeRoute(route: string) {
  return route.replace(/^\/+/, "").replace(/\/+$/, "");
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function readJson<T>(fileName: string): Promise<T> {
  const raw = await fs.readFile(path.join(ROOT, fileName), "utf8");
  return JSON.parse(raw) as T;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
