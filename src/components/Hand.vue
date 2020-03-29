<template>
  <div :class="$style.hand">
    <transition name="slide-fade">
      <button v-if="selected.length" @click="play" :class="$style.play">play</button>
      <button v-if="hideDeal" @click="pickup" :class="$style.play">pick up</button>
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
import { Seat } from "../logic/game";

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
    const selected = ref<Card[]>([]);
    const hideDeal = computed(
      () => !store.state.clientState.pickedUpSecondDeal
    );
    const visibleHand = computed(() =>
      Array.from(props.cards).filter(
        card => !hideDeal.value || !props.secondDeal.has(card)
      )
    );

    const toggle = (card: Card) => {
      const checkbox = (ctx as any).refs[card.id][0];
      if (checkbox) {
        if (checkbox.checked) {
          selected.value.push(card);
        } else {
          const index = selected.value.findIndex(c => c.id === card.id);
          selected.value.splice(index, 1);
        }
      }
    };

    const isSelected = computed(() => (card: Card) =>
      !!selected.value.find(c => c.id === card.id)
    );

    const play = async () => {
      await store.dispatch("play", { seat: props.seat, cards: selected.value });
      selected.value = [];
    };

    const pickup = () => {
      store.commit("pickUpSecondDeal");
    };

    return {
      selected,
      hideDeal,
      visibleHand,
      toggle,
      isSelected,
      play,
      pickup
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
  padding: 0px 20px;
  overflow: hidden;

  .hiddenCard {
    --c-card: #333;
    --c-card-light: #333;
    --shadow-color: #ddd;

    display: block;
    height: 150px;
    width: 100px;
    position: relative;
    margin-left: -30px;

    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 2px 2px 6px 0 var(--shadow-color);
    background-color: #fff;
    color: var(--c-card);
  }

  .detail {
    margin: 15px;
    background-color: var(--c-card-light);
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
  &:focus-within {
    .card {
      box-shadow: 2px 2px 6px 0 #999;
    }
  }
}

.checkbox {
  opacity: 0;
  position: absolute;
}
</style>

<style lang="less">
.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
