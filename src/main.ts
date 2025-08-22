import { createReadStream } from "fs";
import { parse } from "csv-parse";

async function readCSV(filePath: string) {
  const parser = createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    })
  );

  for await (const record of parser) {
    console.log(record);
  }
}

readCSV("data/level_a_players.csv").catch((err) => {
  console.error("Error loading CSV", err);
});
