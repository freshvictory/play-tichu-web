<template>
  <div :class="$style.hand">
    <div :class="$style.header">
      <span :class="$style.count">
        <PlayerInfo :game="game" :active="active" :seat="seat" />
      </span>
      <div :class="$style.actions">
        <div :class="$style.sort">
          <button @click="sort" :class="$style.button">sort</button>
          <label :class="$style.switch">
            <input v-model="sortReverse" type="checkbox">
            <span :class="$style.slider"></span>
          </label>
        </div>
        
        <transition name="slide-fade">
          <button v-if="selected.length && !canPass" @click="play" :class="$style.button">play</button>
        </transition>
        <transition name="slide-fade">
          <button v-if="hideDeal" @click="pickup" :class="$style.button">pick up</button>
        </transition>
        <transition name="slide-fade">
          <button v-if="canPass && availablePasses.length === 0" @click="pass" :class="$style.button">pass</button>
        </transition>
      </div>
    </div>

    <draggable v-model="sortedHand" tag="div" :class="$style.list"
      :ghost-class="$style.ghost" :drag-class="$style.dragged" :force-fallback="true">
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
        <transition name="slide-fade">
          <div :class="$style['pass-actions']" v-if="canPass && isSelected(card)">
            <div v-if="player = seatCardIsPassedTo(card)" :class="[$style['pass-player'], $style[player]]">
              <span :class="$style.passing">{{ getPlayer(player).name }}</span>
            </div>

            <ol v-else-if="availablePasses.length" :class="$style['pass-options']">
              <li v-for="seat in availablePasses" :key="seat" :class="[$style['pass-option'], $style[seat], $style.button]">
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
import PlayerInfo from '@/components/PlayerInfo.vue';
import { defineComponent, ref, computed, watch } from "@vue/composition-api";
import store from "../store";
import { Card } from "@/logic/card";
import { Seat, SeatMap, Game } from "@/logic/game";

export default defineComponent({
  name: "Hand",
  components: {
    Card: CardComponent,
    Draggable: draggable,
    PlayerInfo
  },
  props: {
    seat: { type: String as () => Seat, required: true },
    active: { type: String as () => Seat, required: true },
    game: { type: Game, required: true },
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

.header {
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  grid-template-columns: max-content;
  grid-gap: 40px;
}

.actions {
  display: flex;
  align-items: center;
  width: 100%;
}

.name {
  margin-right: 20px;
}

.sort {
  display: flex;
  align-items: center;
  margin-right: auto;
}

.switch {
  margin-left: 10px;
  padding: 5px;
  display: flex;
  align-items: center;
  width: 40px;

  border-radius: 20px;
  background-color: #fff;
  box-shadow: 3px 3px;

  cursor: pointer;

  .slider {
    display: inline-block;
    width: 15px;
    height: 15px;

    will-change: transform;
    transform: translateX(100%);
    transition: transform 150ms;
    border-radius: 10px;
    background-color: #5e5e5e;
    box-shadow: 1px 1px;
  }

  input {
    display: none;
  }

  input:checked + .slider {
    transform: translateX(0);
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
      outline: 2px solid;
      
    }
  }

  &:hover {
    .pass-player {
      transform: translateY(-10px);
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
  transition: opacity 300ms;
}

.pass-options {
  display: grid;
  z-index: 1;
  background-color: #5e5e5e;
  padding: @px-grid-gap;
  border-radius: 25px;
  box-shadow: 3px 3px;
}

.pass-option {
  pointer-events: auto;
  padding: 0;
  border-radius: 10px;
  &:not(:last-child) {
    margin-bottom: 10px;
  }

  button {
    width: 100%;
    padding: 10px;
  }
}

.north { background-color: @north-color; }
.south { background-color: @south-color; }
.east { background-color: @east-color; }
.west { background-color: @west-color; }

.cancel {
  .action();
}

.pass-player {
  padding: 10px 5px;
  border-radius: 5px;
  min-width: 100px;
  box-shadow: 3px 3px;

  transform: translateY(calc(100% - 7px)) scaleX(0.8);
  transition: transform 300ms;
  will-change: transform;
}

.count {
  display: flex;
  align-items: center;
}

.icon {
  width: 24px;
  margin: 0 5px;
}
</style>

<style lang="less">
.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
