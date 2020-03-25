<template>
  <div :class="$style.table">
    <ol :class="$style.trick">
      <li :class="$style.play" v-for="([seat, cards], i) in currentTrick" :key="i">
        <p :class="$style.name">{{ name(seat) }}</p>
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

.table {
  padding: 20px;
}

.trick {
  display: grid;
  gap: @px-grid-gap;
}

.play {
  border: 2px dotted #ddd;
  border-radius: 20px;
  backdrop-filter: blur(5px);

  display: grid;
  gap: @px-grid-gap;
  max-width: max-content;
}

.name {
  padding: 15px;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  line-height: 1;
  text-align: left;
  background: #ddd;
}

.list {
  margin: 0 15px 15px;
  .card-grid;
}
</style>
