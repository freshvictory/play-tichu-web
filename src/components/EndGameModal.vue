<template>
  <div :class="$style.modal">
    <div :class="$style.scores">
      <h3 :class="$style.header">Scores</h3>
      <div
        v-for="(score, seat) in scores"
        :key="seat"
      >
        <span><strong>{{ getPlayer(seat).name }}</strong>: {{ score }} points</span>
      </div>
    </div>
      <button @click="deal" :class="$style.button">deal new hand</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import store from '../store';
import { Seat } from '../logic/game';

export default defineComponent({
  name: 'EndGameModal',
  setup: () => {
    const scores = computed(() => store.getters.score);
    const getPlayer = (seat: Seat) => store.getters.player(seat);

    const deal = async () => {
      await store.dispatch('deal');
      store.commit('toggleEndGameModal');
    }

    return {
      getPlayer,
      deal,
      scores
    };
  }
});
</script>

<style lang="less" module>
@import '../shared.less';

.modal {
  border: 2px dotted #ddd;
  padding: 20px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
  text-align: left;

  width: 200px;

  display: grid;
  gap: @px-grid-gap;
}

.scores {
  display: block;
}

.header {
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}

.button {
  line-height: 1;

  border: 2px dotted #efc940;
  padding: 7px;
  border-radius: 5px;

  &:hover {
    background-color: #efc940;
    border-color: #fff;
  }
}
</style>
