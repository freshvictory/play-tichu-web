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
import { Seat } from '../logic/game'


export default defineComponent({
  name: 'Game',
  beforeRouteEnter: async (to: any, from: unknown, next: Function) => {
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
  height: 100vh;
}
</style>
