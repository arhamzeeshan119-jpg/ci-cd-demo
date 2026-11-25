const fs = require("fs");
const { add } = require("./src/math");

const html = fs
  .readFileSync("public/index.html", "utf8")
  .replace("{{RESULT}}", add(2, 3));

fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist");
fs.writeFileSync("dist/index.html", html);
console.log("Build complete";
