<template>
  <div :class="$style.view">
    <div :class="$style.table">
      <Table />
    </div>
    <div v-if="seat" :class="$style.player">
      <Player :seat="seat" />
    </div>
  </div>
</template>

<script lang="ts">
import Table from '@/components/Table.vue';
import Player from '@/components/Player.vue';
import { defineComponent } from '@vue/composition-api';
import { Game } from '../logic/game';

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
@import '../shared.less';

.view {
  display: grid;
  grid-template-rows: 1fr max-content;
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
</style>
