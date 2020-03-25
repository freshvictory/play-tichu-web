<template>
  <div>
    Table

    <ol :class="$style.trick">
      <li :class="$style.play" v-for="([seat, cards], i) in currentTrick" :key="i">
        <p>{{ name(seat) }}</p>
        <ol :class="$style.list">
          <li v-for="card in cards" :key="card.id" :class="$style.card" >
            <Card :card="card"/>
          </li>
        </ol>
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import Card from './Card.vue';
import { defineComponent, computed } from '@vue/composition-api';
import store from '../store';
import { Seat } from '../logic/game';

export default defineComponent({
  name: 'Table',
  components: {
    Card,
  },
  setup: () => {
    const currentTrick = computed(() => store.getters.currentTrick.slice().reverse());
    const name = computed(() => (seat: Seat) => store.getters.player(seat).name);

    return  {
      currentTrick,
      name,
    };
  },
});
</script>

<style lang="less" module>
@import '../shared.less';

.trick {
  display: grid;
  gap: @px-grid-gap;
}

.play {
  text-align: left;
}

.list {
  .card-grid;
}
</style>
