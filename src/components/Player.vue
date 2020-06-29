<template>
  <div :class="[$style.player, $style[seat], active === seat ? $style.active : '']">
    <Hand
      v-if="seat === active"
      :class="$style.hand"
      :cards="player.hand"
      :secondDeal="player.secondDeal"
      :seat="seat"
    />

    <div v-else :class="$style.info">
      <span
        v-if="seat === game.firstOut"
        :class="[$style.out, $style.first]"
      >
        1st
      </span>
      <span
        v-else-if="seat === game.secondOut"
        :class="[$style.out, $style.second]"
      >
        2nd
      </span>
      <span
        v-else-if="seat === game.lastOut"
        :class="[$style.out, $style.last]"
      >
        Last
      </span>
      <strong :class="$style.name">{{ player.name }}</strong>
      <span :class="$style.count">
        <strong>{{ player.hand.size }}</strong>
        <HandSvg :class="$style.icon"/>
      </span>
      <span :class="$style.count">
        <strong>{{ player.tricks.length }}</strong>
        <StackSvg :class="$style.icon"/>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Hand from '@/components/Hand.vue';
import HandSvg from '@/components/svg/Hand.vue';
import StackSvg from '@/components/svg/Stack.vue';
import { defineComponent, computed } from '@vue/composition-api';
import store from '@/store';
import { Game } from '@/logic/game';

export default defineComponent({
  name: "Player",
  components: {
    Hand,
    HandSvg,
    StackSvg
  },
  props: {
    game: { type: Game, required: true },
    seat: String,
    active: String
  },
  setup: props => {
    const player = computed(() => store.getters.player(props.seat));

    return {
      player
    };
  }
});
</script>

<style lang="less" module>
@import '../shared.less';

.player {
  padding: 15px;

  &.active {
    width: 100%;
  }
}

.out {
  margin-right: @px-grid-gap;
  font-weight: bold;
  line-height: 1;
  padding: 5px;
  border-radius: 3px;
}

.first {
  background-color: #ffeb01;
}

.second {
  background-color: #fff;
}

.last {
  background-color: #d4b6b6;
}

.info {
  display: flex;
  align-items: center;
}

.count {
  margin-left: @px-grid-gap;
  display: flex;
  align-items: center;
}

.icon {
  width: 24px;
  margin: 0 5px;
}
</style>
