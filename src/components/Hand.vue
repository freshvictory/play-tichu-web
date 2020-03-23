<template>
  <div :class="$style.hand">
    <div v-for="card in cards" :key="card.id" :class="$style['card-container']">
      <Card :card="card" :class="$style.card"/>
    </div>
  </div>
</template>

<script lang="ts">
import CardComponent from '@/components/Card.vue';
import { Card } from '@/logic/card';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Hand',
  components: {
    Card: CardComponent,
  },
  props: {
    cards: { type: Array as () => Card[], required: true },
  },
});
</script>

<style lang="less" module>
@import '../shared.less';

.hand {
  display: grid;
  gap: @px-grid-gap;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
}

.card-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
