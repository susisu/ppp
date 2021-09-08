import fs from "fs";

export async function readFileIfExists(filepath) {
  let file;
  try {
    file = await fs.promises.readFile(filepath, { encoding: "utf8" });
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
  return file;
}
