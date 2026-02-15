
export interface Player {
  id: string;
  name: string;
}

export interface Round {
  id: string;
  date: number;
  scores: Record<string, number>; // playerId: score
  note?: string;
  isSpecial?: boolean;
}

export enum RuleType {
  NONE = 'NONE',
  SCORE_LIMIT = 'SCORE_LIMIT',
  ROUND_LIMIT = 'ROUND_LIMIT'
}

export interface TableRules {
  type: RuleType;
  value: number;
}

export interface Table {
  id: string;
  name: string;
  createdAt: number;
  players: Player[];
  rounds: Round[];
  rules: TableRules;
  isActive: boolean;
}

export interface GameState {
  tables: Table[];
}
