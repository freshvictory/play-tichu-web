<template>
  <div :class="[$style.player, $style[seat], active === seat ? $style.active : '']">
    <div :class="$style.info">
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
      <PlayerName :class="$style.name" :seat="seat" :active="active" />
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
import { defineComponent, computed } from '@vue/composition-api';
import { Game } from '../logic/game';
import PlayerName from '@/components/PlayerName.vue';
import HandSvg from '@/components/svg/Hand.vue';
import StackSvg from '@/components/svg/Stack.vue';
import store from '../store';

export default defineComponent({
  name: 'PlayerInfo',
  components:  {
    PlayerName,
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
})
</script>

<style lang="less" module>
@import '../shared.less';

.out {
  margin-right: @px-grid-gap;
  font-weight: bold;
  line-height: 1;
  padding: 5px;
  border-radius: 3px;
  box-shadow: 3px 3px;
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
