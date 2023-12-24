import { argv } from "node:process";
import { readdir } from "node:fs/promises";

const [, , year, day] = argv;

console.log(year, "Day", day);

const dayPath = `../src/${year}/${day.padStart(2, "0")}`;

const { part1, part2 } = await import(`${dayPath}/index.ts`);

const inputFiles = await readdir(`src/${dayPath}/input`);

console.log("\nPart 1\n======");
for (const inputFile of inputFiles) {
  console.log(inputFile.padEnd(12, " "), await part1(`./input/${inputFile}`));
}

console.log("\nPart 2\n======");
for (const inputFile of inputFiles) {
  console.log(inputFile.padEnd(12, " "), await part2(`./input/${inputFile}`));
}
