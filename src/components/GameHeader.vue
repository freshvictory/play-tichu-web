<template>
  <header :class="$style.header">
    <router-link to="/" title="Home"><h1 :class="$style.title">tichu</h1></router-link>
    <ul v-if="seat" :class="$style.options">
      <li v-if="currentTrick.length">
        <button :class="$style.button" @click="take">take trick</button>
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

    const endHand = () => {
      store.commit('toggleEndHandModal');
    }

    const take = async () => {
      await store.dispatch('take', { seat: props.seat, cards: currentTrick.value });
    };

    return {
      currentTrick,
      endHand,
      take
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
  line-height: 1;

  border: 2px dotted #efc940;
  padding: 7px;
  border-radius: 15px;

  &:hover {
    background-color: #efc940;
    border-color: #fff;
  }
}

.modal {
  position: relative;
  top: 10px;
}
</style>
