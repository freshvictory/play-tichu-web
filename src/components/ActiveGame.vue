<template>
  <div :class="$style.view">
    <GameHeader :seat="seat"/>
    <ul :class="$style.players">
      <li v-for="seat in ['north', 'east', 'south', 'west']" :key="seat" :class="$style.size">
        <span>
          <strong>{{ seats[seat].name }}</strong>:&nbsp;
          {{ seats[seat].hand.size }}&nbsp;|&nbsp;{{ seats[seat].tricks.length }}
        </span>
      </li>
    </ul>
    <div :class="$style.table">
      <Table />
    </div>
    <div v-if="seat" :class="$style.player">
      <Player :seat="seat" />
    </div>
    <div v-if="showEndHandModal" :class="$style.modal">
      <EndHandModal/>
    </div>
  </div>
</template>

<script lang="ts">
import EndHandModal from '@/components/EndHandModal.vue';
import GameHeader from '@/components/GameHeader.vue';
import Table from '@/components/Table.vue';
import Player from '@/components/Player.vue';
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
  },
  props: {
    game: { type: Game, required: true },
    seat: { type: String },
  },
  setup: () => {
    const showEndHandModal = computed(() => store.state.clientState.showEndHandModal);
    const seats = computed(() => store.getters.seats);

    return {
      showEndHandModal,
      seats,
    };
  },
});
</script>

<style lang="less" module>
@import '../shared.less';

.view {
  display: grid;
  grid-template-rows: max-content max-content 1fr max-content;
  height: 100vh;
  // gap: @px-grid-gap;
}

.players {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 5px;
  margin-bottom: 5px;
  border: 2px dotted #ddd;
  border-radius: 20px;
  margin: 0 20px;
}

.size {
    margin: 0 10px;
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
