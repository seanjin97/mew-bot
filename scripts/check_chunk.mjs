import { readFileSync, writeFileSync } from "node:fs";

const check = JSON.parse(readFileSync("scripts/output.json"));

let actual = [];

const numFiles = 44;
for (let i = 1; i <= numFiles; i += 1) {
  const file = JSON.parse(readFileSync(`scripts/chunk_${i}.json`));
  actual = [...actual, ...file];
}

console.log(check.length === actual.length);
