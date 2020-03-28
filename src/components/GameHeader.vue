<template>
  <header :class="$style.header">
    <router-link to="/" title="Home"><h1 :class="$style.title">tichu</h1></router-link>
    <ul :class="$style.options">
      <li v-if="currentTrick.length">
        <button :class="$style.button" @click="take">take trick</button>
      </li>
      <li>
        <button :class="$style.button" @click="endGame">end hand</button>
      </li>
    </ul>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import store from '../store';

export default defineComponent({
  name: 'GameHeader',
  setup: () => {
    const currentTrick = computed(() => store.getters.currentTrick);

    const endGame = () => {
      store.commit('toggleEndGameModal');
    }

    const take = async () => {
      await store.dispatch('take', { seat: 'north', cards: currentTrick.value });
    };

    return {
      currentTrick,
      endGame,
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
