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
    const sorted_teams = Object.values(teams_data).sort((a, b) => {
      if (a.total_score === b.total_score) {
        return a.players.length - b.players.length;
      }
      return a.total_score - b.total_score;
    });

    const team_with_less_score = sorted_teams[0];

    if (!team_with_less_score) {
      throw new Error("No team found to assign the player.");
    }

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
    const average_score = Math.round((total_score / team.players.length) * 100) / 100;

    const logs = [
      `Team: ${team.team_name}`,
      `Size: ${team.players.length}`,
      `Users Average Score: ${average_score}`,
      `Total Score: ${total_score}`,
    ]

    console.log(`${logs.join(",\n")}\n`);
  });
}

main();
