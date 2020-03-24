<template>
  <label
    :for="card.id"
    :class="[
      $style.card,
      $style[card.suit],
      selected ? $style.selected : ''
    ]"
  >
    <input
      :id="card.id"
      ref="checkbox"
      type="checkbox"
      :class="$style.checkbox"
      @change="toggle"
    />
    <div :class="$style.detail">
      <p :class="[$style.name, $style.top]">{{ card.name }}</p>
      <p :class="[$style.name, $style.bottom]">{{ card.name }}</p>
    </div>
  </label>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { Card } from "../logic/card";

export default defineComponent({
  name: "Card",
  props: {
    card: { type: Object as () => Card, required: true }
  },
  setup: () => {
    const selected = ref(false);
    const checkbox = ref<HTMLInputElement>(null);

    const toggle = () => {
      if (checkbox.value) {
        selected.value = checkbox.value.checked;
      }
    };

    return {
      checkbox,
      selected,
      toggle,
    };
  }
});
</script>

<style lang="less" module>
.container {
  position: relative;
}

.checkbox {
  opacity: 0;
  position: absolute;
}

.checkbox:checked + .card {
  transform: scale(1.3);
}

.card {
  --c-card: #000;
  --shadow-color: #ddd;

  display: block;
  height: 150px;
  width: 100px;
  position: relative;

  transform: scale(1);
  will-change: transform;
  transition: transform 200ms;

  border: 1px solid #eee;
  border-radius: 5px;
  box-shadow: 2px 2px 6px 0 var(--shadow-color);
  background-color: #fff;
  color: var(--c-card);

  &:hover {
    transform: scale(1.15);
  }

  &.selected {
    transform: scale(1.3);
  }
  
  &:focus-within {
    --shadow-color: #999;
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
}

.detail {
  margin: 15px;
  background-color: var(--c-card-light);
  border-radius: 3px;
  height: calc(100% - 2 * 15px);
  width: calc(100% - 2 * 15px);
}

.name {
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
