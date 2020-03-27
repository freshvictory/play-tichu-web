import Vue from 'vue';
import Vuex from 'vuex';
import { Seat, Game, Trick, SerializedGame } from '@/logic/game';
import { Lobby } from '@/logic/lobby';
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
}

export default new Vuex.Store<{ sharedState: SharedState; clientState: ClientState }>({
  state: {
    sharedState: { stage: 'none' },
    // sharedState: { stage: 'lobby', stageState: new Lobby('Justin') },
    //sharedState: { stage: 'game', stageState: inGame },
    clientState: {
      connected: false,
      host: false
    }
  },
  mutations: {
    connected: (state) => {
      state.clientState.connected = true;
    },
    startLobby: (state, payload: { name: string }) => {
      state.sharedState = { stage: 'lobby', stageState: new Lobby(payload.name) };
      state.clientState.host = true;
    },
    joinLobby: (state, payload: { name: string; seat: Seat }) => {
      if (state.sharedState.stage === 'lobby') {
        state.sharedState.stageState.join(payload.seat, payload.name);
      }
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
    deserialize: (state, { newState }: { newState: {stage: string; stageState: SerializedGame} }) => {
      let stageState = null;
      if(newState.stage === 'game') stageState = Game.deserialize(newState.stageState);
      state.sharedState = {stage: newState.stage, stageState: stageState} as SharedState;
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
  },
  actions: {
    connect: async ({ dispatch, commit, state }) => {
      if(state.clientState.connected) return;
      if(state.sharedState.stage === 'game' || state.sharedState.stage === 'lobby') {
        const handlers = {
          onReceiveState: (newState: {stage: string; stageState: SerializedGame}) => commit('deserialize', { newState }),
          onRequestState: async () => { if(state.clientState.host === true) {await dispatch('sendState')} }
        }

        //let gameId = state.sharedState.stageState.id;
        await server.start('2', handlers);
        await server.joinGame('1', '2');
        commit('connected');
      }
    },
    startLobby: async ({ commit, state }) => {
      //await server.start('2', (newState) => commit('deserialize', { newState }));
      //await server.joinGame('1', '2');
      commit('startLobby', { name: 'Justin' });
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
      if(state.sharedState.stage === 'game') {
        const serialized = {stage: state.sharedState.stage, stageState: state.sharedState.stageState.serialize()}
        await server.pushState('1', serialized);
      }
      else if(state.sharedState.stage === 'lobby'){

      }
    }
  }
});
