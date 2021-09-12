import childProcess from "child_process";
import path from "path";
import url from "url";

describe("main", () => {
  it("can be executed", async () => {
    const res = await new Promise((resolve, reject) => {
      const cwd = path.dirname(url.fileURLToPath(import.meta.url));
      const cp = childProcess.spawn("node", ["./main.js", "--help"], { cwd });
      let out = "";
      let err = "";
      cp.stdout.on("data", chunk => {
        out += chunk;
      });
      cp.stderr.on("data", chunk => {
        err += chunk;
      });
      cp.on("error", err => {
        reject(err);
      });
      cp.on("close", code => {
        resolve({ code, out, err });
      });
    });
    expect(res).toEqual({
      code: 0,
      out: expect.stringContaining("package.json pretty printer"),
      err: "",
    });
  });
});
