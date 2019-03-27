import { GameType } from '../../types';

export interface Game {
  id: number;
  url: string;
  type: GameType;
  players: number;
  maxPlayers: number;
  city: string;
  lastNotifyTime: number;
  tournamentId: number;
  isGrandFinal: boolean;
  enable: boolean;
}

export interface State {
  games: {
    nextId: number;
    map: Map<number, Game>;
    byUrl: Map<string, Game>;
  };
}
