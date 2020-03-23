<template>
  <div :class="game">
    <div v-if="seat"></div>
      <Deck />
      <Player :seat="seat" />
  </div>
</template>

<script lang="ts">
import Deck from '@/components/Deck.vue';
import Player from '@/components/Player.vue';
import { defineComponent } from '@vue/composition-api';
import { Game, Seat } from '../logic/game';

export default defineComponent({
  name: 'ActiveGame',
  components: {
    Deck,
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
