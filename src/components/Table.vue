<template>
  <div :class="$style.table">
    <div
      v-for="(s, i) in order"
      :key="s"
      :class="[$style.player, $style[placement[i]], $style[s]]"
    >
      <Player :class="$style.details" :seat="s" :active="seat" />
    </div>
    <div :class="$style.tricks">
      <Tricks :seat="seat"/>

      <div v-if="hideDeal && player" :class="$style.hidden">
        <div v-for="card of player.secondDeal" :key="card.id" :class="$style.hiddenCard">
          <div :class="$style.detail"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import Hand from '@/components/svg/Hand.vue';
import Player from '@/components/Player.vue';
import Tricks from '@/components/Tricks.vue';
import { Seat } from '@/logic/game';
import store from '@/store';
import { Card } from '../logic/card';

export default defineComponent({
  name: 'Table',
  components: {
    Hand,
    Player,
    Tricks
  },
  props: {
    seat: { type: String as () => Seat, required: false },
    secondDeal: { type: (Set as unknown) as () => Set<Card>, required: false }
  },
  setup: (props) => {
    const order = ['north', 'east', 'south', 'west'];
    const placement = ['left', 'partner', 'right', 'me']; 
    if (props.seat) {
      let s;
      while ((s = order.shift()) && (s !== props.seat)) {
        order.push(s)
      }
      if (s) order.push(s);
    }
    const seats = computed(() => store.getters.seats);

    const player = computed(() => props.seat
      ? store.getters.player(props.seat)
      : undefined
    );
    const hideDeal = computed(
      () => !store.state.clientState.handState.pickedUpSecondDeal
    );

    return {
      hideDeal,
      player,
      placement,
      order,
      seats
    }
  }
});
</script>

<style lang="less" module>
@import '../shared.less';

.table {
  height: 100%;

  display: grid;
  grid-template-areas:
   "partner partner partner"
   "left table right"
   "me me me";
  grid-template-rows: max-content 1fr;
  grid-auto-rows: max-content;
  grid-template-columns: 52px 1fr 52px;
  grid-gap: @px-grid-gap;
}

.tricks {
  position: relative;
  background: #3fd264;
  border-radius: 10px;
  height: 100%;
  grid-area: table;
  overflow-y: auto;
}

.player {
  border-radius: 10px;
  display: flex;
  justify-content: space-around;

  &.north { background-color: @north-color; }
  &.south { background-color: @south-color; }
  &.east { background-color: @east-color; }
  &.west { background-color: @west-color; }

  &.partner {
    grid-area: partner;
  }
  &.me {
    grid-area: me;
    z-index: 1;
  }
  &.left, &.right {
    flex-direction: column;
  } 
  &.left {
    grid-area: left;
    .details {
      transform: rotate(-90deg) translateX(-100%);
    }
  }
  &.right {
    grid-area: right;
    .details {
      transform: rotate(90deg) translateX(-100%);
    }
  }
}

.hidden {
  display: flex;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: @px-grid-gap;
  justify-self: center;

  .hiddenCard {
    display: block;
    height: 150px;
    width: 100px;
    position: relative;
    margin-left: -40px;

    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    color: #333;
  }

  .detail {
    margin: 15px;
    background: rgb(218,218,218);
    background: @card-back-gradient;
    border-radius: 3px;
    height: calc(100% - 2 * 15px);
    width: calc(100% - 2 * 15px);
  }
}
</style>
