<template>
  <div class="player">
    <Hand :cards="player.hand"/>
  </div>
</template>

<script lang="ts">
import Hand from '@/components/Hand.vue';
import { defineComponent, computed } from '@vue/composition-api';
import store from '../store';

export default defineComponent({
  name: 'Player',
  components: {
    Hand,
  },
  props: {
    seat: String,
  },
  setup: (props) => {
    const player = computed(() => store.getters.player(props.seat));

    return {
      player,
    };
  },
});
</script>
