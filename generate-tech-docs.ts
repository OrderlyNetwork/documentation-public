import fs from "node:fs/promises";
import path from "node:path";

const sdkPath = "../orderly-web/docs";
const techdocPath = "./sdks/tech-doc";
const groupName = "Technical Documentation";

async function main() {
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
    console.log("file", file);

    const filePath = path.join(sdkPath, file);
    let fileContent = await fs.readFile(filePath, { encoding: "utf-8" });

    // remove .md from links
    fileContent = fileContent.replace(/\.md/g, "");
    // make all links relative so that they are not opened in new tab
    fileContent = fileContent.replace(/\][(]/g, "](./");

    const techdocFilePath = path.join(techdocPath, `${file}x`);
    const techdocDirPath = path.dirname(techdocFilePath);
    const relativePath = path.relative(techdocPath, techdocDirPath);
    await fs.mkdir(techdocDirPath, { recursive: true });
    await fs.writeFile(techdocFilePath, fileContent);

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
  console.log(techDoc.pages);
  await fs.writeFile("./mint.json", JSON.stringify(mint, undefined, 2));
}
main();
