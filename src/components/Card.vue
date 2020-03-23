<template>
  <div :class="[$style.card, $style[card.suit]]">
    <p :class="[$style.name, $style.top]">{{ card.name }}</p>
    <p :class="[$style.name, $style.bottom]">{{ card.name }}</p>
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
  border-radius: 5px;
  height: 150px;
  width: 100px;
  position: relative;

  border: 1px solid #eee;
  box-shadow: 2px 2px 6px 0 #ddd;

  &.red {
    color: #ff2f00;
  }

  &.blue {
    color: #005bff;
  }

  &.green {
    color: #00b82e;
  }

  &.black {
    color: #444444;
  }

  &.special {
    color: #efc940;
  }
}

.name {
  font-weight: bold;
  margin: 5px;
  position: absolute;
  
  &.top {
    top: 0;
    left: 0;
  }

  &.bottom {
    bottom: 0;
    right: 0;
  }
}
</style>
