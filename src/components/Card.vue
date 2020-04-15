<template>
  <div
    :class="[
      $style.card,
      $style[card.suit],
      selected ? $style.selected : '',
      $style[card.style]
    ]"
  >
    <div :class="$style.detail" v-if="card.suit != 'blank'">
      <p :class="[$style.name, $style.top]">{{ card.name }}</p>
      <p :class="[$style.name, $style.bottom]">{{ card.name }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { Card } from "../logic/card";

export default defineComponent({
  name: "Card",
  props: {
    card: { type: Object as () => Card, required: true },
    selected: Boolean
  },
});
</script>

<style lang="less" module>
.container {
  position: relative;
}

.card {
  --c-card: #000;
  --shadow-color: #ddd;

  display: block;
  height: 150px;
  width: 100px;
  position: relative;

  transform: scale(1) translateY(0);
  will-change: transform;
  transition: transform 200ms;

  border: 1px solid #eee;
  border-radius: 5px;
  box-shadow: 2px 2px 6px 0 var(--shadow-color);
  background-color: #fff;
  color: var(--c-card);

  &:hover {
    border-color: gold;
  }

  &.selected {
    transform: scale(1.05) translateY(-15px);
  }

  &.red {
    --c-card: #ff2f00;
    --c-card-light: #ffd9d3;    
  }

  &.blue {
    --c-card: #005bff;
    --c-card-light: #cfdfff;
  }

  &.green {
    --c-card: #00b82e;
    --c-card-light: #d8f1d8;
  }

  &.black {
    --c-card: #444444;
    --c-card-light: #dadada;
  }

  &.special {
    --c-card: #efc940;
    --c-card-light: #fcf4db;
  }

  &.blank {
    border: none;
    background: none;
    box-shadow: none;
  }
}

.gemGame {    
  &.card.red {
    --c-card-img: url('/img/fire.svg');
  }
  &.card.blue {
    --c-card-img: url('/img/water.svg');
  }
  &.card.green {
    --c-card-img: url('/img/earth.svg');
  }
  &.card.black {
    --c-card-img: url('/img/air.svg');
  }
}

.detail {
  margin: 15px;
  background-color: var(--c-card-light);
  background-image: var(--c-card-img);
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 3px;
  height: calc(100% - 2 * 15px);
  width: calc(100% - 2 * 15px);
}

.name {
  user-select: none;
  text-align: center;
  font-weight: bold;
  padding: 4px;
  position: absolute;
  background-color: #fff;
  min-height: 30px;
  min-width: 30px;
  border-radius: 60px;
  
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
