<template>
  <div :class="$style.hand">
    <transition name="slide-fade">
      <button v-if="selected.length && !canPass" @click="play" :class="$style.play">play</button>
    </transition>
    <transition name="slide-fade">
      <button v-if="hideDeal" @click="pickup" :class="$style.play">pick up</button>
    </transition>
    <transition name="slide-fade">
      <button v-if="canPass && availablePasses.length === 0" @click="pass" :class="$style.play">pass</button>
    </transition>
    <div v-if="hideDeal" :class="$style.hidden">
      <div v-for="card of secondDeal" :key="card.id" :class="$style.hiddenCard">
        <div :class="$style.detail"></div>
      </div>
    </div>
    <div :class="$style.list">
      <label
        v-for="card of visibleHand"
        :key="card.id"
        :class="$style['card-container']"
        :for="card.id"
      >
        <input
          :id="card.id"
          :ref="card.id"
          type="checkbox"
          :class="$style.checkbox"
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
  </div>
</template>

<script lang="ts">
import CardComponent from "@/components/Card.vue";
import { Card } from "@/logic/card";
import { defineComponent, ref, computed } from "@vue/composition-api";
import store from "../store";
import { Seat, SeatMap } from "../logic/game";

export default defineComponent({
  name: "Hand",
  components: {
    Card: CardComponent
  },
  props: {
    seat: { type: String as () => Seat, required: true },
    cards: { type: (Set as unknown) as () => Set<Card>, required: true },
    secondDeal: { type: (Set as unknown) as () => Set<Card>, required: true }
  },
  setup: (props, ctx) => {


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
      return handState.pickedUpSecondDeal
        && !handState.passedCards;
    });
    const passingCard = ref<Card | null>(null);

    const passCardToSeat = (card: Card, seat: Seat) => {
      passingCard.value = null;
      passes.value[seat] = card;
    };

    const getPlayer = (seat: Seat) => store.getters.player(seat);

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

    const selected = ref<Card[]>([]);

    const selectCard = (card: Card) => selected.value.push(card);
    const deselectCard = (card: Card) => {
      const index = selected.value.findIndex(c => c.id === card.id);
      if (index >= 0) {
        selected.value.splice(index, 1);
        if (canPass) {
          cancelPass(card);
        }
      }
    }

    const isSelected = computed(() => (card: Card) =>
      !!selected.value.find(c => c.id === card.id)
    );



    const toggle = (card: Card) => {
      const checkbox = (ctx as any).refs[card.id][0];
      if (checkbox) {
        if (checkbox.checked) {
          selectCard(card);
        } else {
          deselectCard(card);
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

    const pickup = () => {
      store.commit('pickUpSecondDeal');
    };

    const play = async () => {
      await store.dispatch('play', { seat: props.seat, cards: selected.value });
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
      toggle,
      visibleHand,
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
    background: linear-gradient(120deg, rgba(218,218,218,1) 10%, rgba(216,241,216,1) 20%, rgba(255,217,211,1) 30%, rgba(207,223,255,1) 40%, rgba(252,244,219,1) 50%);
    border-radius: 3px;
    height: calc(100% - 2 * 15px);
    width: calc(100% - 2 * 15px);
  }
}

.play {
  padding: 5px 20px;
  position: absolute;
  top: -57px;
  justify-self: flex-end;

  will-change: transform;
  transform: scale(1);
  transition: transform 300ms, opacity 300ms;

  border-radius: 5px;
  background-color: #efc940;
  box-shadow: 2px 2px 6px 0 #ddd;

  &:hover {
    transform: scale(1.1);
  }
}

.list {
  .card-grid(25px);
  justify-content: center;
}

.card-container {
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
