/* eslint-disable @typescript-eslint/no-var-requires, no-console */
require("dotenv").config();
const path = require("path");

const fse = require("fs-extra");

exports.default = run;

async function run(context) {
  console.log("## Before pack");

  const targetPath = path.join(context.outDir, "../build", "bw-coredump-wrapper.sh");
  const wrapperScript = path.join(__dirname, "./bw-coredump-wrapper.sh");

  if (context.electronPlatformName === "linux") {
    fse.copySync(wrapperScript, targetPath);
  }
}
