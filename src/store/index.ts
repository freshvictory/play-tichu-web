import Vue from 'vue';
import Vuex from 'vuex';
import { Lobby } from '@/logic/lobby';
import { State } from '@/logic/state';

Vue.use(Vuex);

export default new Vuex.Store<{ state: State }>({
  state: {
    state: 'none',
  },
  mutations: {
    startLobby: (state, payload: { name: string }) => {
      state.state = { stage: 'lobby', state: new Lobby(payload.name) };
    },
  },
  getters: {
    gameId: (state) => {
      if (state.state !== 'none') {
        return state.state.state.id;
      }

      return undefined;
    },
  },
});
