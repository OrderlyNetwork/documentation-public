import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();

// Find all MDX files recursively
async function globFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".claude" || entry.name === "tech-doc") {
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

// Extract TSX / TS code blocks from MDX content
function extractCodeBlocks(content: string): Array<{ code: string; line: number; lang: string }> {
  const codeBlocks: Array<{ code: string; line: number; lang: string }> = [];
  const lines = content.split("\n");
  let inBlock = false;
  let currentBlock: string[] = [];
  let startLine = 0;
  let lang = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^```(tsx|typescript|ts|javascript|js|json)\b/);
    if (match) {
      if (inBlock) {
        // Close current block
        codeBlocks.push({
          code: currentBlock.join("\n"),
          line: startLine + 1,
          lang
        });
        currentBlock = [];
        inBlock = false;
      } else {
        // Start new block
        inBlock = true;
        startLine = i;
        lang = match[1];
      }
    } else if (line.startsWith("```") && inBlock) {
      // Close current block (generic closing)
      codeBlocks.push({
        code: currentBlock.join("\n"),
        line: startLine + 1,
        lang
      });
      currentBlock = [];
      inBlock = false;
    } else if (inBlock) {
      currentBlock.push(line);
    }
  }

  return codeBlocks;
}

// Check syntax using TypeScript compiler parser
function checkSyntax(code: string, lang: string): ts.Diagnostic[] {
  const scriptKind = ts.ScriptKind.TSX; // Always parse as TSX to support JSX tags in ts/js/tsx blocks
  const sourceFile = ts.createSourceFile(
    "temp.tsx",
    code,
    ts.ScriptTarget.Latest,
    true,
    scriptKind
  );
  return (sourceFile as any).parseDiagnostics || [];
}

function tryParseLooseJson(code: string): string | null {
  const trimmed = code.trim();
  // If it doesn't look like a full JSON object or array, skip parsing check
  if (!((trimmed.startsWith("{") || trimmed.startsWith("[")) && (trimmed.endsWith("}") || trimmed.endsWith("]")))) {
    return null;
  }

  // 1. Remove multi-line and single-line comments
  let cleaned = trimmed
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*/g, "");

  // 2. Remove ellipses with optional trailing commas
  cleaned = cleaned
    .replace(/\.\.\.,?/g, "")
    .replace(/,\s*\.\.\./g, "");

  // 3. Remove trailing commas before } or ]
  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

  // 5. Clean up any leftover double commas or leading/trailing commas due to removals
  cleaned = cleaned.replace(/,\s*,+/g, ",");
  cleaned = cleaned.replace(/\[\s*,/g, "[");
  cleaned = cleaned.replace(/,\s*\]/g, "]");
  cleaned = cleaned.replace(/\{\s*,/g, "{");
  cleaned = cleaned.replace(/,\s*\}/g, "}");

  // 6. Handle empty objects/arrays
  cleaned = cleaned.replace(/\{\s*\}/g, "{}").replace(/\[\s*\]/g, "[]");

  try {
    JSON.parse(cleaned);
    return null;
  } catch (err: any) {
    return `Cleaned JSON still invalid: ${err.message}`;
  }
}

async function main() {
  console.log("Starting Code Snippet Syntax Checker...");
  const files = await globFiles(ROOT);
  console.log(`Found ${files.length} MDX files to scan.`);

  let errorCount = 0;

  for (const file of files) {
    const relativeSource = path.relative(ROOT, file);
    const content = await fs.readFile(file, "utf8");
    const blocks = extractCodeBlocks(content);

    for (const block of blocks) {
      // We skip json blocks for ts check, as they are not TS
      if (block.lang === "json") {
        const errorMsg = tryParseLooseJson(block.code);
        if (errorMsg) {
          console.error(`[JSON Syntax Error] in ${relativeSource} at line ${block.line}:`);
          console.error(`    ${errorMsg}`);
          errorCount++;
        }
        continue;
      }

      // Check TS/TSX/JS/JSX syntax
      const diagnostics = checkSyntax(block.code, block.lang);
      if (diagnostics.length > 0) {
        // Some diagnostics are not actual syntax errors for snippets (e.g. top-level returns in code fragments, or imports)
        // Let's filter out warnings that are allowed in fragments, but report actual parse/syntax errors
        const actualErrors = diagnostics.filter((diag) => {
          // 1109: Expression expected
          // 1005: Expected ...
          // 1128: Declaration or statement expected (sometimes fragments have top level expressions, that's fine)
          // 1135: React JSX tag must have closing ...
          // 1003: Identifier expected
          const code = diag.code;
          // We report unclosed elements, unexpected tokens, and other critical syntax errors
          return [1005, 1135, 1003, 1109, 1009, 1010, 1011, 1012, 1014, 1015, 1016, 1017, 1030, 1031].includes(code) || 
                 diag.messageText.toString().includes("expected") ||
                 diag.messageText.toString().includes("matching tag");
        });

        if (actualErrors.length > 0) {
          console.error(`[Syntax Error] in ${relativeSource} at line ${block.line} (lang: ${block.lang}):`);
          for (const diag of actualErrors) {
            const pos = ts.getLineAndCharacterOfPosition(diag.file!, diag.start!);
            console.error(`    Error: ${diag.messageText} (at line ${block.line + pos.line}, col ${pos.character})`);
          }
          errorCount++;
        }
      }
    }
  }

  if (errorCount > 0) {
    console.error(`\nDone. Found ${errorCount} code snippet syntax error(s).`);
    process.exitCode = 1;
  } else {
    console.log("\nSuccess! All code snippets syntax check passed.");
  }
}

main().catch((err) => {
  console.error("Error running code snippet checker:", err);
  process.exit(1);
});
