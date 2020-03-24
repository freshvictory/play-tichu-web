<template>
  <div :class="$style.view">
      <Table />
    <div v-if="seat" :class="$style.player">
      <Player :seat="seat" />
    </div>
  </div>
</template>

<script lang="ts">
import Table from '@/components/Table.vue';
import Player from '@/components/Player.vue';
import { defineComponent } from '@vue/composition-api';
import { Game, Seat } from '../logic/game';

export default defineComponent({
  name: 'ActiveGame',
  components: {
    Table,
    Player,
  },
  props: {
    game: { type: Game, required: true },
    seat: { type: String },
  },
  // setup: (props) => {

  // },
});
</script>

<style lang="less" module>
.view {
  display: grid;
  grid-template-rows: 1fr max-content;
}

.player {
  border-top: 2px dotted #ddd;
  padding-top: 15px;
}
</style>
