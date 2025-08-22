export interface PlayerRecord {
  historical_events_participated: number;
  historical_event_engagements: number;
  historical_points_earned: number;
  historical_points_spent: number;
  historical_messages_sent: number;
  current_total_points: number;
  days_active_last_30: number;
  current_streak_value: number;

  last_active_ts: string;
  current_team_id: string;
  current_team_name: string;
  player_id: string;
}

export interface PlayerScore {
  player_id: PlayerRecord["player_id"];
  current_team_name: PlayerRecord["current_team_name"];
  score: number;
}

export interface TeamData {
  team_name: string;
  total_score: number;
  players: PlayerScore[];
}

export type TeamSummary = Record<string, TeamData>; 

export type NormalizedPlayerRecordKeys =
  | "historical_events_participated"
  | "historical_event_engagements"
  | "historical_points_earned"
  | "historical_messages_sent"
  | "days_active_last_30";
