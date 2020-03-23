import { Lobby } from './lobby'
import { Game } from './game'

export type State = LobbyState | GameState | 'none';

type LobbyState = {
  stage: 'lobby';
  state: Lobby;
}

type GameState = {
  stage: 'game';
  state: Game;
}
