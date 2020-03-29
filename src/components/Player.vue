<template>
  <div :class="$style.player">
    <Hand :class="$style.hand" :cards="player.hand" :secondDeal="player.secondDeal" :seat="seat"/>
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

<style lang="less" module>
.player {
  border: 2px dotted #ddd;
  border-radius: 20px;
  backdrop-filter: blur(5px);
}

.hand {
  margin: 15px;
}
</style>
