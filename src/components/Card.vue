<template>
  <div
    :class="[
      $style.card,
      $style[card.suit],
      selected ? $style.selected : '',
      $style[card.style]
    ]"
  >
    <p :class="[$style.name, $style.top]">{{ card.name }}</p>
    <div :class="$style.detail" v-if="card.suit != 'blank'"></div>
    <p :class="[$style.name, $style.bottom]">{{ card.name }}</p>
    <img
      :class="$style.img"
      :src="`/img/tichu/${card.id}.png`"
      alt=""
      onerror="this.parentNode.removeChild(this)"
    />
    <p
      v-if="card.fullName"
      :class="$style.fullname"
    >
      {{ card.fullName }}
    </p>
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

  display: block;
  height: 150px;
  width: 100px;
  box-sizing: border-box;
  position: relative;

  transform: scale(1) translateY(0);
  will-change: transform;
  transition: transform 200ms;

  border: 1px solid #000;
  border-radius: 5px;
  box-shadow: 3px 3px #000;
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

  .img {
    display: none;
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
  background-color: inherit;
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
    transform: rotateZ(180deg)
  }
}

.img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateZ(0); // Force GPU rendering so Chrome isn't blurry
  border-radius: 5px;
}

.fullname {
  position: absolute;
  bottom: 110%;
  background-color: #5e5e5e;
  color: white;
  padding: 5px;
  left: 50%;
  transform: translateX(-50%);
  min-width: max-content;
  font-weight: bold;
  border-radius: 5px;

  display: none;
}

.card:hover .fullname {
  display: block;
}
</style>
