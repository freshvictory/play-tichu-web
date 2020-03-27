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

export default new Vuex.Store<{ sharedState: SharedState; connected: boolean }>({
  state: {
    // sharedState: { stage: 'none' },
    // sharedState: { stage: 'lobby', stageState: new Lobby('Justin') },
    sharedState: { stage: 'game', stageState: inGame },
    connected: false
  },
  mutations: {
    connected: (state) => {
      state.connected = true;
    },
    startLobby: (state, payload: { name: string }) => {
      state.sharedState = { stage: 'lobby', stageState: new Lobby(payload.name) };
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
    connect: async ({ commit, state }) => {
      if(state.connected) return;
      if(state.sharedState.stage === 'game' || state.sharedState.stage === 'lobby') {
        //let gameId = state.sharedState.stageState.id;
        await server.start('2', (newState) => commit('deserialize', { newState }));
        await server.joinGame('1', '2');
        commit('connected');
      }
    },
    startLobby: async ({ commit, state }) => {
      //await server.start('2', (newState) => commit('deserialize', { newState }));
      //await server.joinGame('1', '2');
      commit('startLobby', { name: 'Justin' });
    },
    newGame: async ({ state }) => {
      if (state.sharedState.stage === 'game') {
        state.sharedState.stageState.seats.north.hand.clear();
        state.sharedState.stageState.seats.south.hand.clear();
        state.sharedState.stageState.seats.east.hand.clear();
        state.sharedState.stageState.seats.west.hand.clear();
        const serialized = {stage: state.sharedState.stage, stageState: state.sharedState.stageState.serialize()}
        await server.pushState('1', serialized);
      }
    },
    play: async ({state}, { seat, cards }: { seat: Seat; cards: Card[]}) => {
      if (state.sharedState.stage === 'game') {
        state.sharedState.stageState.play(seat, cards);
        const serialized = {stage: state.sharedState.stage, stageState: state.sharedState.stageState.serialize()}
        await server.pushState('1', serialized);
      }
    },
    take: async ({state}, { seat, cards }: { seat: Seat; cards: Trick }) => {
      if (state.sharedState.stage === 'game') {
        state.sharedState.stageState.take(seat, cards);
        const serialized = {stage: state.sharedState.stage, stageState: state.sharedState.stageState.serialize()}
        await server.pushState('1', serialized);
      }
    },
    deal: async ({state}) => {
      if (state.sharedState.stage === 'game') {
        state.sharedState.stageState.deal();
        const serialized = {stage: state.sharedState.stage, stageState: state.sharedState.stageState.serialize()}
        await server.pushState('1', serialized);
      }
    },
  }
});
