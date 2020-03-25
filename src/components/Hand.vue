<template>
  <div :class="$style.hand">
    <div v-if="selected.length" @click="play">Play</div>
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
import { defineComponent, ref, Ref, computed } from "@vue/composition-api";
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
  setup: props => {
    const checkboxes: { [k: string]: Ref<HTMLInputElement[]> } = {};
    for (const card of props.cards) {
      checkboxes[card.id] = ref<HTMLInputElement[]>([]);
    }

    const selected = ref<Card[]>([]);

    const toggle = (card: Card) => {
      const checkbox = checkboxes[card.id].value[0];
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

    const play = () => {
      store.commit("play", { seat: props.seat, cards: selected.value });
      selected.value = [];
    };

    return {
      ...checkboxes,
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
  display: grid;
  gap: @px-grid-gap;
  grid-auto-flow: row;
  grid-auto-rows: max-content;
}

.list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  grid-auto-rows: 75px 75px;
  justify-content: center;
  padding-right: 50px;
  padding-bottom: 75px;
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
