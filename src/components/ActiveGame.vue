<template>
  <div :class="$style.view">
    <GameHeader :seat="seat"/>
    <div :class="$style.table">
      <Table :seat="seat" />
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
  // gap: @px-grid-gap;
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

.container {
  display: inline-flex;
  align-items: center;
  justify-items: center;
}

.gem {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  margin-right: 5px;

  &.north { background: @north-color; }
  &.south { background: @south-color; }
  &.east { background: @east-color; }
  &.west { background: @west-color; }
}

.first, .last {
  font-weight: bold;
  margin-right: 5px;
  &.north { color: @north-color; }
  &.south { color: @south-color; }
  &.east { color: @east-color; }
  &.west { color: @west-color; }
}

.size {
    margin: 0 10px;
}

.table {
  background-color: #fff;
  border-radius: 25px;
  margin: @px-grid-gap;
  margin-top: 0;
  padding: @px-grid-gap;
  overflow: hidden;
}

.history {  
  border: 2px dotted #ddd;
  border-radius: 20px;
  margin: 5px 20px 60px 5px;
  padding: 10px;
  // Height would ideally be calculated to resize, but it needs to be capped to prevent stretching the page
  height: 180px;
  overflow: hidden;
}

.modal {
  position: absolute;
  left: 50%;
  top: 25%;
  transform: translate(-50%, -25%);
}

.shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.3;
  background-color: #000;
}

.out {
  color: lightgray;
}
</style>
