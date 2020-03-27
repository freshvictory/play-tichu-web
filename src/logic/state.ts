import { Lobby } from './lobby';
import { Game } from './game';

export type State = LobbyState | GameState | DefaultState;

type DefaultState = {
  stage: 'none';
}

type LobbyState = {
  stage: 'lobby';
  stageState: Lobby;
}

type GameState = {
  stage: 'game';
  stageState: Game;
}
