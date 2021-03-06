<template>
  <div :class="$style.modal">
    <div v-if="showScores">
      <h3 :class="$style.header">Scores</h3>
      <ol :class="$style.scores" v-for="(team, index) in scores" :key="index">
      <li>        
        <strong>Team {{index+1}}</strong>
        <div>
          <strong>{{team.points}}</strong> points total
          <span v-if="team.gems.length">
            <span v-for="suit in team.gems" :key="suit" :class="[$style.gem, $style[suit]]"></span>
          </span>
        </div>
      </li>
      <li
        v-for="score in team.players"
        :key="score.seat"
        :class="$style['score-list']"
      >
        <strong>{{ getPlayer(score.seat).name }}</strong>:
        <ul>
          <li><strong>{{ score.tricks }} </strong>points</li>
          <li v-if="score.bonus"><strong>{{ score.bonus }}</strong> bonus</li>
          <li v-if="score.hand"><strong>{{ score.hand }}</strong> left in hand</li>
        </ul>
      </li>
      </ol>
    </div>
    <button v-else-if="seatsOut.length > 0" @click="showScores = true" :class="$style.button">show scores</button>
    <button @click="deal" :class="$style.button">deal new hand</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api';
import store from '../store';
import { Seat } from '../logic/game';

export default defineComponent({
  name: 'EndHandModal',
  setup: () => {
    const scores = computed(() => store.getters.score);
    const getPlayer = (seat: Seat) => store.getters.player(seat);
    const showScores = ref(false);
    const seatsOut = computed(() => store.getters.seatsOut)

    const deal = async () => {
      store.commit('toggleEndHandModal');
      await store.dispatch('deal');
    }

    return {
      getPlayer,
      deal,
      scores,
      seatsOut,
      showScores
    };
  }
});
</script>

<style lang="less" module>
@import '../shared.less';

.modal {
  padding: @px-grid-gap;
  border-radius: 25px;
  background-color: #5e5e5e;
  box-shadow: 3px 3px;
  text-align: left;

  width: 250px;

  display: grid;
  gap: @px-grid-gap;
}

.scores {
  display: block;
  color: #fff;
  > li {
    margin-bottom: 10px;
  }
}

.score-list {
  margin-left: 10px;
}

.header {
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
  color: #fff;
}

.button {
  .action();

  padding: 10px;
  border-radius: 10px;

  background: linear-gradient(45deg, #efa940, #f0cb66);
}

.gem {
  .suit-gem(8px);
}
</style>
