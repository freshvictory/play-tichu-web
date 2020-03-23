<template>
  <div :class="game">
    <div v-if="seat"></div>
      <Player :seat="seat" />
  </div>
</template>

<script lang="ts">
import Player from '@/components/Player.vue';
import { defineComponent } from '@vue/composition-api';
import { Game, Seat } from '../logic/game';

export default defineComponent({
  name: 'ActiveGame',
  components: {
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
