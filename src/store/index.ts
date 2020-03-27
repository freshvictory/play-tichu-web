import Vue from 'vue';
import Vuex from 'vuex';
import { Seat, Game, Trick } from '@/logic/game';
import { Lobby } from '@/logic/lobby';
import { State } from '@/logic/state';
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

export default new Vuex.Store<{ state: State }>({
  state: {
    // state: { stage: 'none' },
    // state: { stage: 'lobby', state: new Lobby('Justin') },
    state: { stage: 'game', state: inGame },
  },
  mutations: {
    startLobby: (state, payload: { name: string }) => {
      state.state = { stage: 'lobby', state: new Lobby(payload.name) };
    },
    joinLobby: (state, payload: { name: string; seat: Seat }) => {
      if (state.state.stage === 'lobby') {
        state.state.state.join(payload.seat, payload.name);
      }
    },
    startGame: (state) => {
      if (state.state.stage === 'lobby') {
        if (state.state.state.full) {
          console.log('Starting game...');
          const game = state.state.state.start();

          state.state = { stage: 'game', state: game };
        }
      }
    },
    play: (state, { seat, cards }: { seat: Seat; cards: Card[]}) => {
      if (state.state.stage === 'game') {
        state.state.state.play(seat, cards);
      }
    },
    take: (state, { seat, cards }: { seat: Seat; cards: Trick }) => {
      if (state.state.stage === 'game') {
        state.state.state.take(seat, cards);
      }
    },
    deal: (state) => {
      if (state.state.stage === 'game') {
        state.state.state.deal();
      }
    },
    newGame: (state) => {
      if (state.state.stage === 'game') {
        const players = { ...state.state.state.seats };
        for (const player in players) {
          players[player as Seat].hand = new Set([]);
          players[player as Seat].tricks = [];
        }
        state.state.state = new Game(state.state.state.id, players);
      }
    },
    deserialize: (state, { newState }: { newState: State }) => {
      state.state = newState;
    }
  },
  getters: {
    gameRoute: (state): string => {
      if (state.state.stage !== 'none') {
        return `game/${state.state.state.id}`;
      }

      return '/';
    },
    player: (state) => (seat: Seat): Player | undefined => {
      switch (state.state.stage) {
        case 'game':
        case 'lobby':
          return state.state.state.seats[seat];
        default:
          return undefined;
      }
    },
    currentTrick: (state): [Seat, ReadonlyArray<Card>][] => {
      if (state.state.stage === 'game') {
        return state.state.state.currentTrick;
      }

      return [];
    },
  },
  actions: {
    startLobby: async ({ commit, state }) => {
      server.start('2', (newState) => commit('deserialize', { newState }));
      await server.joinGame('1', '2');
      commit('startLobby', { name: 'Justin' });
      await server.pushState('1', state.state);
    },
    newGame: async ({ state }) => {
      const players = { ...state.state.state.seats };
      for (const player in players) {
        players[player as Seat].hand = new Set([]);
        players[player as Seat].tricks = [];
      }
      await server.pushState('1', { stage: 'game', state: new Game('1', players) });
    }
  }
});
