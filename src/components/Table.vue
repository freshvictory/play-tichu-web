<template>
  <div :class="$style.table">
    <div
      v-for="(s, i) in order"
      :key="s"
      :class="[$style.player, $style[placement[i]], $style[s]]"
    >
      <Player :class="$style.details" :seat="s" :active="seat" :game="game" />
    </div>
    <div :class="$style.tricks">
      <Tricks :seat="seat"/>

      <div v-if="hideDeal && player" :class="$style.hidden">
        <div v-for="card of player.secondDeal" :key="card.id" :class="$style.hiddenCard">
          <div :class="$style.detail"></div>
        </div>
      </div>
    </div>
    <History :class="$style.history" :actions="actionHistory" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import Hand from '@/components/svg/Hand.vue';
import History from '@/components/History.vue';
import Player from '@/components/Player.vue';
import Tricks from '@/components/Tricks.vue';
import { Seat, Game } from '@/logic/game';
import store from '@/store';
import { Card } from '../logic/card';

export default defineComponent({
  name: 'Table',
  components: {
    Hand,
    History,
    Player,
    Tricks
  },
  props: {
    game: { type: Game, required: true },
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

    const actionHistory = computed(() => store.state.stateHistory
      .filter(s => s.stage === 'game')
      .reverse()
      .slice(0, 5)
    );

    return {
      actionHistory,
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
  position: relative;

  display: grid;
  grid-template-areas:
   ". partner ."
   "left table right"
   "me me me";
  grid-template-rows: max-content 1fr;
  grid-auto-rows: max-content;
  grid-template-columns: 55px 1fr 55px;
  grid-gap: @px-grid-gap;
}

.tricks {
  position: relative;
  border-radius: 10px;
  height: 100%;
  grid-area: table;
  overflow-y: auto;
}

.player {
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  z-index: 1;

  &.partner {
    grid-area: partner;

    .details { 
      box-shadow: 3px 3px;
    }
  }
  &.me {
    grid-area: me;
    z-index: 2;

    .details {
      box-shadow: 3px 3px;
    }
  }
  &.left, &.right {
    flex-direction: column;
    .details {
      position: relative;
      left: 50%;
    }
  } 
  &.left {
    grid-area: left;
    .details {
      box-shadow: -3px 3px;
      transform: translateX(-50%) rotate(-90deg);
    }
  }
  &.right {
    grid-area: right;
    .details {
      box-shadow: 3px -3px;
      transform: translateX(-50%) rotate(90deg);
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

    border: 1px solid #000;
    border-radius: 5px;
    box-shadow: 3px 3px;
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

.history {
  grid-column: right;
  grid-row: table;
  width: max-content;
  position: absolute;
  right: 0;
  align-self: flex-end;
  transform: translateY(calc(100% - 24px));
  will-change: transform;
  transition: transform 300ms;
  z-index: 1;
  &:hover {
    transform: translateY(0);
  }
}
</style>
