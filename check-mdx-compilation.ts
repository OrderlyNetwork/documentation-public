import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

// Dynamic import for ESM @mdx-js/mdx
async function getMdxCompiler() {
  const { compile } = await import("@mdx-js/mdx");
  return compile;
}

// Find all MDX files recursively
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
        return entry.name.endsWith(".mdx") ? [res] : [];
      }
    })
  );
  return files.flat();
}

// Strip frontmatter from MDX content
function stripFrontmatter(content: string): string {
  if (content.startsWith("---")) {
    const endIdx = content.indexOf("---", 3);
    if (endIdx !== -1) {
      return content.slice(endIdx + 3);
    }
  }
  return content;
}

async function main() {
  console.log("Starting MDX Compilation and Tag Nesting Checker...");
  const compile = await getMdxCompiler();
  const files = await globFiles(ROOT);
  console.log(`Found ${files.length} MDX files to compile.`);

  let errorCount = 0;

  for (const file of files) {
    const relativeSource = path.relative(ROOT, file);
    const rawContent = await fs.readFile(file, "utf8");
    const content = stripFrontmatter(rawContent);

    try {
      // Compile MDX to verify syntax, HTML tags closing, and JSX nesting
      await compile(content, {
        development: true,
        // We don't need to write the output, just verify it parses
      });
    } catch (err: any) {
      console.error(`[Compilation Error] in ${relativeSource}:`);
      console.error(`    Message: ${err.message}`);
      if (err.line && err.column) {
        console.error(`    At: Line ${err.line}, Column ${err.column}`);
      }
      errorCount++;
    }
  }

  if (errorCount > 0) {
    console.error(`\nDone. Found ${errorCount} file(s) with MDX compilation errors.`);
    process.exitCode = 1;
  } else {
    console.log("\nSuccess! All MDX files compiled successfully.");
  }
}

main().catch((err) => {
  console.error("Error running MDX compiler checker:", err);
  process.exit(1);
});
