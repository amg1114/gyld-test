import { TeamData, TeamSummary } from "./models/player.interface.js";
import {
  calculatePlayerScores,
  getTeams,
  normalizeColumns,
  readCSV,
} from "./utils/data.js";

async function main() {
  const filePath = "data/level_a_players.csv";

  const playerRecords = await readCSV(filePath);
  const teams_data: TeamSummary = {};

  // Initialize teams_data with team names
  getTeams(playerRecords).forEach((team_name) => {
    teams_data[team_name] = {
      team_name,
      total_score: 0,
      players: [],
    };
  });

  normalizeColumns(playerRecords);

  const scores = calculatePlayerScores(playerRecords).sort(
    (a, b) => b.score - a.score
  );

  scores.forEach((score) => {
    const team_with_less_score = Object.values(teams_data).reduce(
      (prev, curr) => {
        return prev.total_score < curr.total_score ? prev : curr;
      }
    );

    team_with_less_score.total_score += score.score;
    team_with_less_score.players.push({
      player_id: score.player_id,
      current_team_name: score.current_team_name,
      score: score.score,
    });

    console.log(
      `Player ${score.player_id} => ${team_with_less_score.team_name}`
    );
  });

  console.log("------------------------");
  console.log("\nTeams Summary:\n");

  Object.values(teams_data).forEach((team: TeamData) => {
    const total_score = Math.round(team.total_score * 100) / 100;

    const logs = [
      `Team: ${team.team_name}`,
      `Size: ${team.players.length}`,
      `Total Score: ${total_score}`,
    ]

    console.log(`${logs.join(",\n")}\n`);
  });
}

main();
