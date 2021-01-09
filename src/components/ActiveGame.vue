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
import { defineComponent, computed } from '@vue/composition-api';
import { Game } from '../logic/game';
import store from '../store';

export default defineComponent({
  name: 'ActiveGame',
  components: {
    EndHandModal,
    GameHeader,
    Table
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

    const toggleModal = () => {
      store.commit('toggleEndHandModal');
    };

    return {
      showEndHandModal,
      seats,
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
  height: 100%;
}

.table {
  background-color: #49bd66;
  margin-top: 0;
  padding: @px-grid-gap;
  padding-top: 0;
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
