import Vue from 'vue';
import Vuex from 'vuex';
import { Seat } from '@/logic/game';
import { Lobby } from '@/logic/lobby';
import { State } from '@/logic/state';

Vue.use(Vuex);

export default new Vuex.Store<{ state: State }>({
  state: {
    state: { stage: 'none' },
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
    gameRoute: (state) => {
      if (state.state.stage !== 'none') {
        return `game/${state.state.state.id}`;
      }

      return '/';
    },
  },
});
