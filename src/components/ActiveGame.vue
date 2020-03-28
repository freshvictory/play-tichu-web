<template>
  <div :class="$style.view">
    <GameHeader/>
    <div :class="$style.table">
      <Table />
    </div>
    <div v-if="seat" :class="$style.player">
      <Player :seat="seat" />
    </div>
    <div v-if="showEndGameModal" :class="$style.modal">
      <EndGameModal/>
    </div>
  </div>
</template>

<script lang="ts">
import EndGameModal from '@/components/EndGameModal.vue';
import GameHeader from '@/components/GameHeader.vue';
import Table from '@/components/Table.vue';
import Player from '@/components/Player.vue';
import { defineComponent, computed } from '@vue/composition-api';
import { Game } from '../logic/game';
import store from '../store';

export default defineComponent({
  name: 'ActiveGame',
  components: {
    EndGameModal,
    GameHeader,
    Table,
    Player,
  },
  props: {
    game: { type: Game, required: true },
    seat: { type: String },
  },
  setup: () => {
    const showEndGameModal = computed(() => store.state.clientState.showEndGameModal);

    return {
      showEndGameModal
    };
  },
});
</script>

<style lang="less" module>
@import '../shared.less';

.view {
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  height: 100vh;
  // gap: @px-grid-gap;
}

.table {
  overflow: auto;
  // padding-bottom: 300px;
}

.player {
  margin: 0 20px 20px;
}

.modal {
  position: absolute;
  left: 50%;
  top: 25%;
  transform: translate(-50%, -25%);
}
</style>
