<template>
  <div :class="$style.card">
    <p>{{ card.name }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Card } from '../logic/card';

export default defineComponent({
  name: 'Card',
  props: {
    card: { type: Object as () => Card, required: true },
  },
});
</script>

<style lang="less" module>
.card {
  display: block;
  border: 2px solid #ddd;
  border-radius: 5px;
  height: 150px;
  width: 100px;
}
</style>
