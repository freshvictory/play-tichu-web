<template>
  <div :class="$style.modal">
    <div v-if="showScores">
      <h3 :class="$style.header">Scores</h3>
      <ol :class="$style.scores" v-for="(team, index) in scores" :key="index">
      <li>        
        <strong>Team {{index+1}}</strong>
        <div>
          {{team.points}} points total
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
          <li>{{ score.tricks }} points</li>
          <li v-if="score.bonus">{{ score.bonus }} bonus</li>
          <li v-if="score.hand">{{ score.hand }} left in hand</li>
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
  border: 2px dotted #ddd;
  padding: 20px;
  border-radius: 20px;
  backdrop-filter: blur(20px);
  text-align: left;

  width: 200px;

  display: grid;
  gap: @px-grid-gap;
}

.scores {
  display: block;
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

.gem {
  .suit-gem(8px);
}
</style>
