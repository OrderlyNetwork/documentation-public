import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

// Find all MDX/MD files recursively
async function globFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".claude") {
          return [];
        }
        return globFiles(res);
      } else {
        return (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) ? [res] : [];
      }
    })
  );
  return files.flat();
}

async function resolveRouteFile(route: string) {
  // Strip leading slash if any
  const normalizedRoute = route.startsWith("/") ? route.slice(1) : route;
  const base = path.basename(normalizedRoute);
  const candidates = [
    `${normalizedRoute}.mdx`,
    `${normalizedRoute}.md`,
    path.join(normalizedRoute, "index.mdx"),
    path.join(normalizedRoute, "index.md"),
    path.join(normalizedRoute, `${base}.mdx`),
    path.join(normalizedRoute, `${base}.md`)
  ];

  for (const candidate of candidates) {
    const absolutePath = path.join(ROOT, candidate);
    try {
      const stat = await fs.stat(absolutePath);
      if (stat.isFile()) {
        return absolutePath;
      }
    } catch {
      // ignore
    }
  }
  return null;
}

// Generate anchor ID from heading text (standard markdown slugify)
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "") // Remove HTML tags
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .trim()
    .replace(/[-\s]+/g, "-"); // Replace spaces/hyphens with single hyphen
}

// Extract headers and custom anchors from a file
async function extractAnchors(filePath: string): Promise<Set<string>> {
  const content = await fs.readFile(filePath, "utf8");
  const anchors = new Set<string>();
  const slugCounts = new Map<string, number>();

  // Match markdown headers e.g. ## My Heading
  const headerRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  while ((match = headerRegex.exec(content)) !== null) {
    const headingText = match[2].trim();
    // Strip trailing markdown components like {#custom-id} if any
    const customIdMatch = headingText.match(/\{\s*#([a-zA-Z0-9_-]+)\s*\}/);
    if (customIdMatch) {
      anchors.add(customIdMatch[1]);
    } else {
      const baseSlug = slugify(headingText);
      const count = slugCounts.get(baseSlug) || 0;
      if (count === 0) {
        anchors.add(baseSlug);
        slugCounts.set(baseSlug, 1);
      } else {
        const uniqueSlug = `${baseSlug}-${count}`;
        anchors.add(uniqueSlug);
        slugCounts.set(baseSlug, count + 1);
      }
    }
  }

  // Match HTML anchors e.g. <a id="my-anchor"> or <a name="my-anchor">
  const htmlAnchorRegex = /<a\s+[^>]*(?:id|name)=["']([a-zA-Z0-9_-]+)["']/gi;
  while ((match = htmlAnchorRegex.exec(content)) !== null) {
    anchors.add(match[1]);
  }

  return anchors;
}

async function main() {
  console.log("Starting Global Link Checker...");
  const files = await globFiles(ROOT);
  console.log(`Found ${files.length} MDX/MD files. Scanning links...`);

  let brokenCount = 0;
  const anchorCache = new Map<string, Set<string>>();

  // Helper to get cached anchors for a file
  const getCachedAnchors = async (absolutePath: string) => {
    if (!anchorCache.has(absolutePath)) {
      const anchors = await extractAnchors(absolutePath);
      anchorCache.set(absolutePath, anchors);
    }
    return anchorCache.get(absolutePath)!;
  };

  for (const file of files) {
    const relativeSource = path.relative(ROOT, file);
    const content = await fs.readFile(file, "utf8");

    // Match markdown links e.g. [text](url)
    // We want to capture internal links: starting with /, ./, ../, or just filenames, but not http/https/mailto/ftp
    const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const text = match[1];
      const url = match[2].trim();

      // Skip external links, mailto, etc.
      if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("#") || url.startsWith("ftp:")) {
        continue;
      }

      const [linkPath, hash] = url.split("#");
      const staticExtensions = new Set([".png", ".webp", ".jpg", ".jpeg", ".gif", ".svg", ".pdf", ".json", ".zip"]);
      const isStatic = staticExtensions.has(path.extname(linkPath).toLowerCase());

      let targetFile: string | null = null;
      if (isStatic) {
        const absPath = linkPath.startsWith("/")
          ? path.join(ROOT, linkPath)
          : path.resolve(path.dirname(file), linkPath);
        try {
          const stat = await fs.stat(absPath);
          if (stat.isFile()) {
            targetFile = absPath;
          }
        } catch {
          // targetFile remains null
        }
      } else if (!linkPath) {
        // Self-link with anchor
        targetFile = file;
      } else if (linkPath.startsWith("/")) {
        // Absolute path from documentation root
        targetFile = await resolveRouteFile(linkPath);
      } else {
        // Relative path from current file
        const resolvedPath = path.resolve(path.dirname(file), linkPath);
        const relativeToRoot = path.relative(ROOT, resolvedPath);
        targetFile = await resolveRouteFile(relativeToRoot);
      }

      if (!targetFile) {
        console.error(`[Broken Link] in ${relativeSource}: [${text}](${url}) -> Target path not found.`);
        brokenCount++;
        continue;
      }

      // If there's an anchor and it's not a static file, verify it
      if (hash && !isStatic) {
        const fileAnchors = await getCachedAnchors(targetFile);
        if (!fileAnchors.has(hash)) {
          console.error(`[Broken Anchor] in ${relativeSource}: [${text}](${url}) -> Anchor #${hash} not found in ${path.relative(ROOT, targetFile)}.`);
          brokenCount++;
        }
      }
    }
  }

  if (brokenCount > 0) {
    console.error(`\nDone. Found ${brokenCount} broken link(s)/anchor(s).`);
    process.exitCode = 1;
  } else {
    console.log("\nSuccess! No broken links or anchors found.");
  }
}

main().catch((err) => {
  console.error("Error running link checker:", err);
  process.exit(1);
});
