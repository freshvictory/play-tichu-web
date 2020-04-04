<template>
  <div :class="$style.view">
    <GameHeader :seat="seat"/>
    <ul :class="$style.players">
      <li v-for="loopSeat in ['north', 'east', 'south', 'west']" :key="loopSeat" :class="[$style.size, $style[seatArrangement[seat][loopSeat]]]">
        <span :class="$style.container">
          <span :class="[$style.gem, $style[loopSeat]]"></span>
          <span v-if="loopSeat === game.firstOut" :class="[$style.first, $style[loopSeat]]">1st</span>
          <span v-if="loopSeat === game.lastOut" :class="[$style.last, $style[loopSeat]]">Last</span>
          <strong :class="seats[loopSeat].hand.size === 0 ? $style.out : ''" @dblclick="log(seats[loopSeat].id)">{{ seats[loopSeat].name }}:</strong>
          <span> {{ seats[loopSeat].hand.size }}&nbsp;|&nbsp;{{ seats[loopSeat].tricks.length }}</span>
        </span>
      </li>
    </ul>
    <div :class="$style.row">
      <div :class="$style.table">
        <Table />
      </div>
      <div :class="$style.history">
        <History :actions="actionHistory" />
      </div>
    </div>
    <div v-if="seat" :class="$style.player">
      <Player :seat="seat" />
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

    const log = (id: string) => {
      console.log(id);
    }

    const seatArrangement = {
      south: {
        north: 'north',
        east: 'east',
        south: 'south',
        west: 'west'
      },
      west: {
        north: 'west',
        east: 'north',
        south: 'east',
        west: 'south'
      },
      north: {
        north: 'south',
        east: 'west',
        south: 'north',
        west: 'east'
      },
      east: {
        north: 'east',
        east: 'south',
        south: 'west',
        west: 'north'
      }
    };

    return {
      showEndHandModal,
      seats,
      actionHistory,
      toggleModal,
      seatArrangement,
      log
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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: 
    ". north ."
    "west . east"
    ". south .";
  justify-content: space-evenly;
  padding: 5px;
  margin-bottom: 5px;
  border: 2px dotted #ddd;
  border-radius: 20px;
  margin: 0 20px;
  
  .north { grid-area: north; }
  .south { grid-area: south; }
  .east { grid-area: east; }
  .west { grid-area: west; }
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

.row {
  display: grid;
  grid-template-columns: 1fr max-content;
}

.table {
  overflow: auto;
  // padding-bottom: 300px;
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

.player {
  margin: 0 20px 20px;
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
  backdrop-filter: blur(5px);
}

.out {
  color: lightgray;
}
</style>
