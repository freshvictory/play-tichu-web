<template>
  <div :class="$style.hand">
    <Card v-for="card in cards" :key="card.id" :card="card"/>
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
.hand {
  display: grid;
  grid-auto-flow: column;
}
</style>
