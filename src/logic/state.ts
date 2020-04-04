import { Lobby, SerializedLobby } from './lobby';
import { Game, SerializedGame } from './game';

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

export type SerializedState = SerializedGameState | SerializedLobbyState;

type SerializedGameState = {
  stage: 'game';
  rewind: boolean;
  sender: string;
  stageState: SerializedGame;
}

type SerializedLobbyState = {
  stage: 'lobby';
  rewind: boolean;
  sender: string;
  stageState: SerializedLobby;
}
