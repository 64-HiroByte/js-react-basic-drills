#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const num = process.argv[2];

if (!num) {
  console.error("使い方: npm run drill 01");
  process.exit(1);
}

const drillsDir = path.join(__dirname, "..", "drills");

// 01_ で始まる js ファイルを探す
const target = fs
  .readdirSync(drillsDir)
  .find((file) => file.startsWith(`${num}_`) && file.endsWith(".js"));

if (!target) {
  console.error(`drill ${num} が見つかりません`);
  process.exit(1);
}

const targetPath = path.join(drillsDir, target);

console.log(`▶ running: ${target}`);
require(targetPath);
