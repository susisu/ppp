import fs from "fs";
import os from "os";
import path from "path";

import { readFileIfExists } from "./files.js";

function makeTempDir() {
  return fs.promises.mkdtemp(path.join(os.tmpdir(), "@susisu-ppp-test-"));
}

describe("readFileIfExists", () => {
  it("reads the content of a file if exists", async () => {
    const dir = await makeTempDir();
    const file = path.join(dir, "foo.txt");
    await fs.promises.writeFile(file, "bar", { encoding: "utf8" });

    const content = await readFileIfExists(file);
    expect(content).toBe("bar");
  });

  it("returns undefined if the file does not exist", async () => {
    const dir = await makeTempDir();
    const file = path.join(dir, "foo.txt");

    const content = await readFileIfExists(file);
    expect(content).toBe(undefined);
  });

  it("fails if an error occured that is not ENOENT", async () => {
    const dir = await makeTempDir();
    const file = path.join(dir, "foo.txt");
    await fs.promises.writeFile(file, "bar", { encoding: "utf8", mode: 0o000 });

    await expect(readFileIfExists(file)).rejects.toThrow("EACCES");
  });
});
