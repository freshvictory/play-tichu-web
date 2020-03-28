<template>
  <div :class="$style.hand">
    <transition name="slide-fade">
      <button v-if="selected.length" @click="play" :class="$style.play">play</button>
    </transition>
    <div :class="$style.list">
      <label v-for="card in cards" :key="card.id" :class="$style['card-container']" :for="card.id">
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
    cards: { type: (Set as unknown) as () => Set<Card>, required: true }
  },
  setup: (props, ctx) => {
    const selected = ref<Card[]>([]);

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

    return {
      isSelected,
      selected,
      toggle,
      play
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
    transform: scale(1.1)
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
.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
}
</style>
