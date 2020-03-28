import Vue from 'vue';
import Vuex from 'vuex';
import { Seat, Game, Trick, SerializedGame } from '@/logic/game';
import { Lobby, SerializedLobby } from '@/logic/lobby';
import { State as SharedState } from '@/logic/state';
import { Player } from '@/logic/player';
import { Card } from '@/logic/card';
import { Server, ApiBaseUrl } from '@/server';

Vue.use(Vuex);

const server = new Server(ApiBaseUrl);

const inGame = new Game(
  '1',
  {
    north: new Player('2', 'Justin'),
    south: new Player('3', 'Lydia'),
    east: new Player('4', 'Bailey'),
    west: new Player('5', 'Nick'),
  },
);

export type ClientState = {
  connected: boolean;
  host: boolean;
  userId: string | undefined;
  name: string | undefined;
  gameId: string | undefined;
  showEndGameModal: boolean;
}

export default new Vuex.Store<{ sharedState: SharedState; clientState: ClientState }>({
  state: {
    sharedState: { stage: 'none' },
    // sharedState: { stage: 'lobby', stageState: new Lobby('Justin') },
    //sharedState: { stage: 'game', stageState: inGame },
    clientState: {
      connected: false,
      host: false,
      userId: undefined,
      name: undefined,
      gameId: undefined,
      showEndGameModal: false
    }
  },
  mutations: {
    connected: (state) => {
      state.clientState.connected = true;
    },
    startLobby: (state, payload: { name: string }) => {
      const userId = Lobby.getId();
      
      state.clientState.userId = userId;
      state.clientState.name = payload.name;
      state.clientState.host = true;

      const lobby = new Lobby(Lobby.getId());
      state.clientState.gameId = lobby.id;
      state.sharedState = { stage: 'lobby', stageState: lobby };
    },
    joinLobby: (state, payload: { name: string; game: string }) => {
      const userId = Lobby.getId();      
      state.clientState.userId = userId;
      state.clientState.name = payload.name;
      state.clientState.gameId = payload.game;
    },
    startGame: (state) => {
      if (state.sharedState.stage === 'lobby') {
        if (state.sharedState.stageState.full) {
          console.log('Starting game...');
          const game = state.sharedState.stageState.start();

          state.sharedState = { stage: 'game', stageState: game };
        }
      }
    },
    newGame: (state) => {
      if (state.sharedState.stage === 'game') {
        const players = { ...state.sharedState.stageState.seats };
        for (const player in players) {
          players[player as Seat].hand = new Set([]);
          players[player as Seat].tricks = [];
        }
        state.sharedState.stageState = new Game(state.sharedState.stageState.id, players);
      }
    },
    toggleEndGameModal: (state) => {
      state.clientState.showEndGameModal = !state.clientState.showEndGameModal;
    },
    deserialize: (state, { newState }: { newState: {stage: string; stageState: SerializedGame | SerializedLobby} }) => {
      console.log('received state')
      let stageState = null;
      if(newState.stage === 'game') stageState = Game.deserialize(newState.stageState as SerializedGame);
      else if(newState.stage === 'lobby') stageState = Lobby.deserialize(newState.stageState)
      else console.log('could not deserialize state for stage '+newState.stage)
      
      if(stageState != null) state.sharedState = {stage: newState.stage, stageState: stageState} as SharedState;
    }
  },
  getters: {
    gameRoute: (state): string => {
      if (state.sharedState.stage !== 'none') {
        return `game/${state.sharedState.stageState.id}`;
      }

      return '/';
    },
    player: (state) => (seat: Seat): Player | undefined => {
      switch (state.sharedState.stage) {
        case 'game':
        case 'lobby':
          return state.sharedState.stageState.seats[seat];
        default:
          return undefined;
      }
    },
    currentTrick: (state): [Seat, ReadonlyArray<Card>][] => {
      if (state.sharedState.stage === 'game') {
        return state.sharedState.stageState.currentTrick;
      }

      return [];
    },
    score: (state) => {
      if (state.sharedState.stage === 'game') {
        return state.sharedState.stageState.score();
      }
    }
  },
  actions: {
    connect: async ({ dispatch, commit, state }, { gameId }: {gameId: string}) => {
      if(state.clientState.connected) return;
      if(state.clientState.userId === undefined) throw 'User ID is not set, cannot connect';

        const handlers = {
          onReceiveState: (newState: {stage: string; stageState: SerializedGame}) => commit('deserialize', { newState }),
          onRequestState: async () => { if(state.clientState.host === true) {await dispatch('sendState')} }
        }

        // Connect user to the server
        await server.start(state.clientState.userId, handlers);
        // Subscribe user to the game and request current state
        await server.joinGame(gameId, state.clientState.userId);
        commit('connected');
    },
    takeSeat: async ({ dispatch, state }, {seat}: {seat: Seat}) => {
      if(state.sharedState.stage === 'lobby') {
        
        if(state.clientState.userId === undefined ||
          state.clientState.name === undefined ||
          state.sharedState.stageState.seats[seat] != undefined) return;
        
        state.sharedState.stageState.join(seat, state.clientState.name, state.clientState.userId);
        await dispatch('sendState');
      }
    },
    newGame: async ({ dispatch, state }) => {
      if (state.sharedState.stage === 'game') {
        state.sharedState.stageState.seats.north.hand.clear();
        state.sharedState.stageState.seats.south.hand.clear();
        state.sharedState.stageState.seats.east.hand.clear();
        state.sharedState.stageState.seats.west.hand.clear();
        await dispatch('sendState');
      }
    },
    play: async ({dispatch, state}, { seat, cards }: { seat: Seat; cards: Card[]}) => {
      if (state.sharedState.stage === 'game') {
        state.sharedState.stageState.play(seat, cards);
        await dispatch('sendState');
      }
    },
    take: async ({dispatch, state}, { seat, cards }: { seat: Seat; cards: Trick }) => {
      if (state.sharedState.stage === 'game') {
        state.sharedState.stageState.take(seat, cards);
        await dispatch('sendState');
      }
    },
    deal: async ({dispatch, state}) => {
      if (state.sharedState.stage === 'game') {
        state.sharedState.stageState.deal();
        await dispatch('sendState');
      }
    },
    sendState: async ({state}) => {
      if(state.sharedState.stage != 'none') {
        console.log('sending state for game '+state.sharedState.stageState.id)
        const serialized = {stage: state.sharedState.stage, stageState: state.sharedState.stageState.serialize()}
        await server.pushState(state.sharedState.stageState.id, serialized);
      }
    }
  }
});
