<template>
  <header :class="$style.header">
    <router-link to="/" title="Home"><h1 :class="$style.title">tichu</h1></router-link>
    <ul v-if="seat" :class="$style.options">
      <li v-if="allCardsPassed">
        <button :class="$style.button" @click="pickUp">everybody pick up</button>
      </li>
      <li v-if="currentTrick.length">
        <button :class="$style.button" @click="take">take trick</button>
      </li>
      <li>
        <button :class="$style.button" @click="rewind">rewind</button>
      </li>
      <li>
        <button :class="$style.button" @click="endHand">end hand</button>
      </li>
    </ul>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import store from '../store';
import { Seat } from '../logic/game';

export default defineComponent({
  name: 'GameHeader',
  props: {
    seat: { type: String as () => Seat, required: false },
  },
  setup: (props) => {
    const currentTrick = computed(() => store.getters.currentTrick);
    const allCardsPassed = computed(() => store.getters.allCardsPassed);

    const endHand = () => {
      store.commit('toggleEndHandModal');
    };

    const take = async () => {
      await store.dispatch('take', { seat: props.seat, cards: currentTrick.value });
    };

    const pickUp = async () => {
      await store.dispatch('pickUpPassedCards');
    };

    const rewind = async () => {
      await store.dispatch('rewind');
    };

    return {
      currentTrick,
      allCardsPassed,
      endHand,
      take,
      pickUp,
      rewind
    }
  }
});
</script>

<style lang="less" module>
@import '../shared.less';

.header {
  display: flex;
  padding: @px-grid-gap;
  // padding-bottom: 0;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 24px;
  border: 2px dotted #ddd;
  padding: 10px;
  border-radius: 20px;
  line-height: 1;
}

.options {
  display: flex;
}

.button {
  margin-left: 20px;
  .action;
}

.modal {
  position: relative;
  top: 10px;
}
</style>
