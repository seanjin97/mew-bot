import "dotenv/config";
import { writeFileSync } from "node:fs";

let output = [];

let offset = 0;

while (true) {
  const res = await fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_TOKEN}&q=cute%20cat&offset=${offset}`,
  );

  const json = await res.json();

  offset = offset + json.pagination.count;

  output = [...output, ...json.data.map((item) => item.images.original.url)];

  if (offset === json.pagination.total_count) {
    break;
  }
}

writeFileSync("scripts/output.json", JSON.stringify(output));
