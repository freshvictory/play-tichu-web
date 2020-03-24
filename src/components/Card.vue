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
    <p :class="[$style.name, $style.top]">{{ card.name }}</p>
    <p :class="[$style.name, $style.bottom]">{{ card.name }}</p>
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
  top: 0;

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
    --shadow-color: var(--c-card);
  }

  &.red {
    --c-card: #ff2f00;
  }

  &.blue {
    --c-card: #005bff;
  }

  &.green {
    --c-card: #00b82e;
  }

  &.black {
    --c-card: #444444;
  }

  &.special {
    --c-card: #efc940;
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
