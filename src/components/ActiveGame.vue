<template>
  <div :class="$style.view">
    <GameHeader :seat="seat"/>
    <div :class="$style.table">
      <Table :seat="seat" :game="game" />
    </div>
    <div v-if="showEndHandModal">
      <div @click="toggleModal" :class="$style.shield"></div>
      <EndHandModal :class="$style.modal"/>
    </div>
  </div>
</template>

<script lang="ts">
import EndHandModal from '@/components/EndHandModal.vue';
import GameHeader from '@/components/GameHeader.vue';
import Table from '@/components/Table.vue';
import Player from '@/components/Player.vue';
import History from '@/components/History.vue';
import { defineComponent, computed } from '@vue/composition-api';
import { Game } from '../logic/game';
import store from '../store';

export default defineComponent({
  name: 'ActiveGame',
  components: {
    EndHandModal,
    GameHeader,
    Table,
    Player,
    History
  },
  props: {
    game: { type: Game, required: true },
    seat: { type: String },
  },
  setup: () => {
    const showEndHandModal = computed(() =>
      store.state.clientState.handState.showEndHandModal
    );
    const seats = computed(() => store.getters.seats);
    const actionHistory = computed(() => store.state.stateHistory.filter(s => s.stage === 'game').reverse());

    const toggleModal = () => {
      store.commit('toggleEndHandModal');
    };

    return {
      showEndHandModal,
      seats,
      actionHistory,
      toggleModal
    };
  },
});
</script>

<style lang="less" module>
@import '../shared.less';

.view {
  display: grid;
  grid-template-rows: max-content 1fr;
  height: 100vh;
}

.game {
  display: grid;
  grid-template-rows: [table] 1fr;
  grid-auto-rows: auto;
  gap: @px-grid-gap;

  background-color: #fff;
  border-radius: 25px;
  margin: @px-grid-gap;
  margin-top: 0;
  padding: @px-grid-gap;
  overflow: hidden;
}

.table {
  background-color: #fff;
  border-radius: 25px;
  margin: @px-grid-gap;
  margin-top: 0;
  padding: @px-grid-gap;
  overflow: hidden;
}

.modal {
  position: absolute;
  left: 50%;
  top: 25%;
  transform: translate(-50%, -25%);
  z-index: 3;
}

.shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.3;
  background-color: #000;
  z-index: 2;
}

.out {
  color: lightgray;
}
</style>
