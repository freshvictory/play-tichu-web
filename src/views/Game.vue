<template>
  <div id="game" :class="$style.game">
    <h1>{{ state.stage }}</h1>
    <Lobby v-if="state.stage === 'lobby'" :lobby="state.state"/>
    <ActiveGame v-else-if="state.stage === 'game'"
      :game="state.state"
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
    if (store.state.state.stage === 'none') {
      next('/');
    } else {
      next();
    }
  },
  components: {
    Lobby,
    ActiveGame,
  },
  setup: () => {
    const state = computed(() => store.state.state);

    return {
      state,
    };
  },
});
</script>

<style lang="less" module>
@import '../shared.less';

.game {
  margin: 20px;
  display: grid;
  grid-template-rows: max-content 1fr;
  row-gap: @px-grid-gap;
}
</style>
