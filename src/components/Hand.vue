<template>
  <div :class="$style.hand">
    <transition name="slide-fade">
      <button v-if="selected.length && !canPass" @click="play" :class="[$style.button, $style.right]">play</button>
    </transition>
    <transition name="slide-fade">
      <button v-if="hideDeal" @click="pickup" :class="[$style.button, $style.right]">pick up</button>
    </transition>
    <transition name="slide-fade">
      <button v-if="canPass && availablePasses.length === 0" @click="pass" :class="[$style.button, $style.right]">pass</button>
    </transition>
    <button @click="sort" :class="[$style.button, $style.left]">sort</button>
    <label :class="[$style.switch, $style.left]">
      <input v-model="sortReverse" type="checkbox">
      <span :class="$style.slider"></span>
    </label>
    <div v-if="hideDeal" :class="$style.hidden">
      <div v-for="card of secondDeal" :key="card.id" :class="$style.hiddenCard">
        <div :class="$style.detail"></div>
      </div>
    </div>
    <draggable v-model="sortedHand" tag="div" :class="$style.list"
      :ghost-class="$style.ghost" :drag-class="$style.dragged">
      <div
        v-for="card of sortedHand"
        :key="card.id"
        :class="$style['card-container']"
        :for="card.id"
        @contextmenu.prevent="rightclick(card)"
      >
        <label :for="card.id">
        <input
          v-if="card.suit != 'blank'"
          :id="card.id"
          :ref="card.id"
          type="checkbox"
          :class="$style.checkbox"
          v-model="selected"
          :value="card.id"
          @change="toggle(card)"
        />
        <transition name="play-slide">
          <div :class="$style['pass-actions']" v-if="canPass && isSelected(card)">
            <div v-if="player = seatCardIsPassedTo(card)" :class="$style['pass-player']">
              <div :class="$style.passing">passing</div>
              <span>{{ getPlayer(player).name }}</span>
            </div>

            <ol v-else-if="availablePasses.length" :class="$style['pass-options']">
              <li v-for="seat in availablePasses" :key="seat" :class="$style['pass-option']">
                <button @click.prevent="passCardToSeat(card, seat)">{{ getPlayer(seat).name }}</button>
              </li>
            </ol>
          </div>
        </transition>
        <Card :card="card" :class="$style.card" :selected="isSelected(card)" />
        </label>
      </div>
    </draggable>    
  </div>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import CardComponent from "@/components/Card.vue";
import { defineComponent, ref, computed, watch } from "@vue/composition-api";
import store from "../store";
import { Card } from "@/logic/card";
import { Seat, SeatMap } from "@/logic/game";

export default defineComponent({
  name: "Hand",
  components: {
    Card: CardComponent,
    Draggable: draggable
  },
  props: {
    seat: { type: String as () => Seat, required: true },
    cards: { type: (Set as unknown) as () => Set<Card>, required: true },
    secondDeal: { type: (Set as unknown) as () => Set<Card>, required: true }
  },
  setup: (props, ctx) => {
    const getPlayer = (seat: Seat) => store.getters.player(seat);

    /**
     * Passing
     */

    const passObject = { north: null, south: null, east: null, west: null };
    delete passObject[props.seat];
    const passes = ref<SeatMap<Card | null>>(passObject);
    const availablePasses = computed(() => {
      const available: Seat[] = [];
      for (const seat in passes.value) {
        if (!passes.value[seat as Seat]) {
          available.push(seat as Seat);
        }
      }

      return available;
    });
    const canPass = computed(() => {
      const handState = store.state.clientState.handState;
      const player = getPlayer(props.seat);
      return handState.pickedUpSecondDeal
        && !player.passedCards;
    });
    const passingCard = ref<Card | null>(null);

    const passCardToSeat = (card: Card, seat: Seat) => {
      passingCard.value = null;
      passes.value[seat] = card;
    };

    const seatCardIsPassedTo = (card: Card): Seat | undefined => {
      for (const seat in passes.value) {
        if (passes.value[seat as Seat]?.id === card.id) {
          return seat as Seat;
        }
      }

      return undefined;
    };

    const cancelPass = (card: Card) => {
      passingCard.value = null;
      const seat = seatCardIsPassedTo(card);
      if (seat) {
        passes.value[seat] = null;
      }
    };


    /**
     * Selection
     */

    const selected = ref<string[]>([]);

    const isSelected = computed(() => (card: Card) =>
      !!selected.value.find(c => c === card.id)
    );

    const rightclick = (card: Card) => {
      if(card.suit === 'blank') return;
      const checkbox = (ctx as any).refs[card.id][0];
      checkbox.click();
    }

    const toggle = (card: Card) => {
      const checkbox = (ctx as any).refs[card.id][0];
      if (checkbox) {
        if (!checkbox.checked) {
          cancelPass(card);
        }
      }
    };

    /**
     * Two-stage deal
     */

    const hideDeal = computed(
      () => !store.state.clientState.handState.pickedUpSecondDeal
    );
    const visibleHand = computed(() =>
      Array.from(props.cards).filter(
        card => !hideDeal.value || !props.secondDeal.has(card)
      )
    );

    const sortReverse = ref(false);
    
    const minBlank: Card = {
        id: 'blankMin',
        name: '',
        value: 0,
        rank: -100000,
        suit: 'blank',
        serializedId: -1
    }

    const maxBlank: Card = {
        id: 'blankMax',
        name: '',
        value: 0,
        rank: 100000,
        suit: 'blank',
        serializedId: -1
    }

    const sortedHand = computed({
      get: () => store.state.clientState.handState.sortedHand,
      set: (value) => store.state.clientState.handState.sortedHand = value
    });
    watch(visibleHand, (newHand, oldHand) => {      
      const newHandSet = new Set(newHand.concat(minBlank, maxBlank));
      let newSortedHand: Card[] = [];

      sortedHand.value.forEach((card, index) => {
        if(newHandSet.has(card)) {
          newSortedHand.push(card);
          newHandSet.delete(card);
        }
      });

      // TODO: toggle default sort direction
      const remaining = sortReverse.value 
        ? Array.from(newHandSet).sort((a, b) => b.rank - a.rank)
        : Array.from(newHandSet).sort((a, b) => a.rank - b.rank);
      newSortedHand = newSortedHand.concat(remaining);

      sortedHand.value = newSortedHand;
    });

    const sort = () => {
      const sorted = sortReverse.value 
        ? Array.from(sortedHand.value).sort((a, b) => b.rank - a.rank)
        : Array.from(sortedHand.value).sort((a, b) => a.rank - b.rank);
      sortedHand.value = sorted;
    }

    const pickup = () => {
      store.commit('pickUpSecondDeal');
    };

    const play = async () => {
      const selectedCards: Card[] = [];            
      sortedHand.value.forEach(card => { if(selected.value.findIndex(c => c === card.id) >= 0) selectedCards.push(card); });
      await store.dispatch('play', { seat: props.seat, cards: selectedCards });
      selected.value = [];
    };

    const pass = async () => {
      await store.dispatch('passCards', { fromSeat: props.seat, to: passes.value });
      selected.value = [];
      passes.value = { north: null, south: null, east: null, west: null };
      delete passes.value[props.seat];
      passingCard.value = null;
    };

    return {
      availablePasses,
      canPass,
      cancelPass,
      hideDeal,
      isSelected,
      getPlayer,
      pass,
      passes,
      passingCard,
      passCardToSeat,
      pickup,
      play,
      seatCardIsPassedTo,
      selected,
      visibleHand,
      rightclick,
      toggle,
      sortedHand,
      sortReverse,
      sort
    };
  }
});
</script>

<style lang="less" module>
@import "../shared.less";

.hand {
  position: relative;
  display: grid;
  gap: @px-grid-gap;
  grid-auto-flow: row;
  grid-auto-rows: max-content;
}

.hidden {
  display: flex;
  z-index: -1;
  position: absolute;
  top: -57px;
  justify-self: center;
  height: 40px;
  padding: 0px 80px;
  overflow: hidden;

  .hiddenCard {
    display: block;
    height: 150px;
    width: 100px;
    position: relative;
    margin-left: -40px;

    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 2px 2px 6px 0 #ddd;
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

.button {
  padding: 5px 20px;
  position: absolute;
  top: -57px;

  will-change: transform;
  transform: scale(1);
  transition: transform 300ms, opacity 300ms;

  border-radius: 5px;
  background-color: #efc940;
  box-shadow: 2px 2px 6px 0 #ddd;

  &:hover {
    transform: scale(1.1);
  }

  &.right {
    justify-self: flex-end;
  }

  &.left {
    justify-self: flex-start;
  }
}

.switch {
  padding: 5px;
  margin-left: 80px;
  position: absolute;
  top: -57px;

  border-radius: 20px;
  background-color: #efc940;
  box-shadow: 2px 2px 6px 0 #ddd;

  &.right {
    justify-self: flex-end;
  }

  &.left {
    justify-self: flex-start;
  }

  .slider {
    display: inline-block;
    width: 20px;
    height:20px;
    margin-left: 20px;
    margin-right: 0px;
    border-radius: 10px;
    background-color: white;
  }

  input {
    display: none;
  }

  input:checked + .slider {
    margin-left: 0px;
    margin-right: 20px;
  }
}

.list {
  .card-grid(25px);
  justify-content: center;
}

.card-container {
  display: inline-block;
  position: relative;
  &:focus-within {
    .card {
      box-shadow: 2px 2px 6px 0 #999;
    }
  }

  &:hover {
    .pass-player {
      transform: translateY(-20px);
    }
  }

  &.ghost .card {
    border-color: gold;
    margin-top: -20px;
  }
}

.dragged {
  opacity: 0;
}

.checkbox {
  opacity: 0;
  position: absolute;
}

.pass-actions {
  position: absolute;
  left: 50%;
  transform: translate(-50%, calc(-100% - 25px));
  pointer-events: none;
}

.pass-options {
  display: grid;
  z-index: 2;
  backdrop-filter: blur(10px);
  padding: 10px;
  border: 2px dotted #ddd;
  border-radius: 20px;
}

.pass-option {
  pointer-events: auto;
  &:not(:last-child) {
    margin-bottom: 10px;
  }

  button {
    width: 100%;
    .action;
  }
}

.cancel {
  .action(#ef5840);
}

.pass-player {
  background-color: gold;
  padding: 0 5px;
  border-radius: 5px;

  transform: translateY(calc(100% - 14px)) scaleX(0.8);
  transition: transform 300ms;
  will-change: transform;
}

.passing {
  font-size: 14px;
}
</style>

<style lang="less">
.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
