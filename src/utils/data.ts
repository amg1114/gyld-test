import { createReadStream } from "fs";
import { parse } from "csv-parse";
import {
  NormalizedPlayerRecordKeys,
  PlayerRecord,
  PlayerScore,
} from "../models/player.interface.js";

const NORMALIZED_COLUMNS: NormalizedPlayerRecordKeys[] = [
  "historical_events_participated",
  "historical_event_engagements",
  "historical_points_earned",
  "historical_messages_sent",
  "days_active_last_30",
];

/**
 * Reads a CSV file from the specified file path and parses its contents into an array of `PlayerRecord` objects.
 *
 * The CSV is expected to have columns matching the properties of `PlayerRecord`. Numeric fields are converted from strings to numbers.
 *
 * @param filePath - The path to the CSV file to read.
 * @returns A promise that resolves to an array of `PlayerRecord` objects parsed from the CSV file.
 *
 * @throws Will throw an error if the file cannot be read or parsed.
 */
export async function readCSV(filePath: string): Promise<PlayerRecord[]> {
  const parser = createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    })
  );

  const records: PlayerRecord[] = [];

  for await (const record of parser) {
    const mapped: PlayerRecord = {
      historical_events_participated: Number(
        record.historical_events_participated
      ),
      historical_event_engagements: Number(record.historical_event_engagements),
      historical_points_earned: Number(record.historical_points_earned),
      historical_points_spent: Number(record.historical_points_spent),
      historical_messages_sent: Number(record.historical_messages_sent),
      current_total_points: Number(record.current_total_points),
      days_active_last_30: Number(record.days_active_last_30),
      current_streak_value: Number(record.current_streak_value),

      last_active_ts: record.last_active_ts,
      current_team_id: record.current_team_id,
      current_team_name: record.current_team_name,
      player_id: record.player_id,
    };

    records.push(mapped);
  }

  return records;
}

/**
 * Returns a list of unique team names from an array of player records.
 *
 * @param data - An array of `PlayerRecord` objects to extract team names from.
 * @returns An array of unique team names (`string[]`) found in the player records.
 */
export function getTeams(data: PlayerRecord[]): string[] {
  return data.reduce((acc: string[], record: PlayerRecord) => {
    if (!acc.includes(record.current_team_name)) {
      acc.push(record.current_team_name);
    }

    return acc;
  }, []);
}

/**
 * Normalizes the specified numeric columns of the given player records in-place.
 * Each column is scaled so that its minimum value becomes 0 and its maximum value becomes 1.
 * If all values in a column are the same, all entries for that column are set to 0.
 *
 * @param data - The array of player records to normalize.
 * @param columns - The list of column keys to normalize. Defaults to `NORMALIZED_COLUMNS`.
 * @throws Will throw an error if a column contains no numeric values or if a value is invalid.
 */
export function normalizeColumns(
  data: PlayerRecord[],
  columns: NormalizedPlayerRecordKeys[] = NORMALIZED_COLUMNS
): void {
  columns.forEach((column) => {
    const values = data
      .map((record) => record[column])
      .filter((v): v is number => typeof v === "number" && !isNaN(v));

    if (values.length === 0) {
      throw new Error(`No numeric values found for column ${column}.`);
    }

    const min = Math.min(...values);
    const max = Math.max(...values);

    data.forEach((record) => {
      const value = record[column];

      if (typeof value !== "number" || isNaN(value)) {
        throw new Error(`Invalid value in column ${column}: ${value}`);
      }

      record[column] = min === max ? 0 : (value - min) / (max - min);
    });
  });
}

/**
 * Calculates the total score for each player based on specified normalized columns.
 *
 * Iterates over an array of player records, sums the numeric values of the fields
 * defined in `NORMALIZED_COLUMNS` for each player, and returns an array of player scores.
 *
 * @param data - An array of `PlayerRecord` objects representing player data.
 * @returns An array of `PlayerScore` objects, each containing the player's ID, current team name, and calculated score.
 */
export function calculatePlayerScores(data: PlayerRecord[]): PlayerScore[] {
  return data.map((record) => {
    const score = Object.entries(record)
      .filter(([key]) =>
        NORMALIZED_COLUMNS.includes(key as NormalizedPlayerRecordKeys)
      )
      .reduce(
        (sum, [_, value]) => sum + (typeof value === "number" ? value : 0),
        0
      );

    return {
      player_id: record.player_id,
      current_team_name: record.current_team_name,
      score,
    };
  });
}
