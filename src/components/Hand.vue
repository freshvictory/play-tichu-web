<template>
  <div :class="$style.hand">
    <div v-if="selected.length">Play</div>
    <div :class="$style.list">
      <label
        v-for="card in cards"
        :key="card.id"
        :class="$style['card-container']"
        :for="card.id"
      >
        <input
          :id="card.id"
          :ref="card.id"
          type="checkbox"
          :class="$style.checkbox"
          @change="toggle(card.id)"
        />
        <Card :card="card" :class="$style.card" :selected="isSelected(card.id)"/>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import CardComponent from '@/components/Card.vue';
import { Card } from '@/logic/card';
import { defineComponent, ref, Ref, computed } from '@vue/composition-api';

export default defineComponent({
  name: 'Hand',
  components: {
    Card: CardComponent,
  },
  props: {
    cards: { type: Array as () => Card[], required: true },
  },
  setup: (props) => {
    const checkboxes: { [k: string]: Ref<HTMLInputElement[]> } = {};
    for (const card of props.cards) {
      checkboxes[card.id] = ref<HTMLInputElement[]>([]);
    }

    const selected = ref<string[]>([]);

    const toggle = (cardId: string) => {
      const checkbox = checkboxes[cardId].value[0];
      if (checkbox) {
        if (checkbox.checked) {
          selected.value.push(cardId);
        } else {
          const index = selected.value.indexOf(cardId);
          selected.value.splice(index, 1);
        }
      }
    };

    const isSelected = computed(() =>
      (cardId: string) => selected.value.indexOf(cardId) >= 0
    );

    return {
      ...checkboxes,
      isSelected,
      selected,
      toggle,
    }
  },
});
</script>

<style lang="less" module>
@import '../shared.less';

.hand {
  display: grid;
  gap: @px-grid-gap;
  grid-auto-flow: row;
  grid-auto-rows: max-content;
}

.list {
  display: grid;
  gap: @px-grid-gap;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
}

.card-container {
  display: flex;
  align-items: center;
  justify-content: center;

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
