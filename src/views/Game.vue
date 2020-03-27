<template>
  <div id="game" :class="$style.game">
    <Lobby v-if="sharedState.stage === 'lobby'" :lobby="sharedState.stageState"/>
    <ActiveGame v-else-if="sharedState.stage === 'game'"
      :game="sharedState.stageState"
      seat="north"
    />
  </div>
</template>

<script lang="ts">
import ActiveGame from '@/components/ActiveGame.vue';
import Lobby from '@/components/Lobby.vue';
import { defineComponent, computed } from '@vue/composition-api';
import store from '../store';


export default defineComponent({
  name: 'Game',
  beforeRouteEnter: (to: unknown, from: unknown, next: Function) => {
    if (store.state.sharedState.stage === 'none') {
      next('/');
    } else {
      next();
    }
  },
  components: {
    ActiveGame,
    Lobby,
  },
  setup: () => {
    const sharedState = computed(() => store.state.sharedState);

    return {
      sharedState,
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
