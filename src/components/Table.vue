<template>
  <div>
    Table

    <div :class="$style.play" v-for="([seat, cards], i) in currentTrick" :key="i">
      <p>{{ name(seat) }}</p>
      <ol :class="$style.list">
        <li v-for="card in cards" :key="card.id" :class="$style.card" >
          <Card :card="card"/>
        </li>
      </ol>
    </div>
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
.play {
  text-align: left;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;

  display: flex;

  li {
    margin: none;
  }
}

.card {
  &:not(:first-child) {
    margin-left: -50px;
  }
}
</style>
