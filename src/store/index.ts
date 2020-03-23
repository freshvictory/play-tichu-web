import Vue from 'vue';
import Vuex from 'vuex';
import { Seat, Game } from '@/logic/game';
import { Lobby } from '@/logic/lobby';
import { State } from '@/logic/state';
import { Player } from '@/logic/player';

Vue.use(Vuex);

const inGame = new Game(
  '1',
  {
    north: new Player('2', 'Justin'),
    south: new Player('3', 'Lydia'),
    east: new Player('4', 'Bailey'),
    west: new Player('5', 'Nick'),
  },
);

inGame.seats.north.hand = [
  {
    id: '1',
    name: 'Dragon',
    value: 0,
    rank: 0
  },
  {
    id: '2',
    name: 'Dog',
    value: 0,
    rank: 0
  },
  {
    id: '3',
    name: 'Red Three',
    value: 0,
    rank: 0
  },
];

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
  },
});
