<template>
  <div id="game" :class="$style.game">
    <Lobby v-if="sharedState.stage === 'lobby'" :lobby="sharedState.stageState" />
    <ActiveGame v-else-if="sharedState.stage === 'game'"
      :game="sharedState.stageState"
      :seat="mySeat"
    />
  </div>
</template>

<script lang="ts">
import ActiveGame from '@/components/ActiveGame.vue';
import Lobby from '@/components/Lobby.vue';
import { defineComponent, computed } from '@vue/composition-api';
import store from '../store';
import { Route } from 'vue-router';


export default defineComponent({
  name: 'Game',
  beforeRouteEnter: async (to: Route, from: unknown, next: (route?: string) => void) => {
    if(store.state.clientState.userId === undefined && to.query.userId != undefined) {      
      store.commit('setUserId', { userId: to.query.userId });
      store.commit('joinLobby', {name: 'ghost', game: to.params.id})
    }
    if (store.state.clientState.gameId === undefined) {
      store.commit('setGame', { gameId: to.params.id });
      next('/');      
    } else {
      await store.dispatch('connect', { gameId: store.state.clientState.gameId });
      next();
    }
  },
  components: {
    ActiveGame,
    Lobby,
  },
  setup: () => {
    const sharedState = computed(() => store.state.sharedState);
    const mySeat = computed(() => store.getters.mySeat);

    return {
      sharedState,
      mySeat
    };
  },
});
</script>

<style lang="less" module>
@import '../shared.less';

.game {
  display: grid;
  grid-template-rows: 1fr;
  row-gap: @px-grid-gap;
  height: 100%;
}
</style>
