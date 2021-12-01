<template>
  <div :class="[$style.player, $style[seat], active === seat ? $style.active : '']">
    <Hand
      v-if="seat === active"
      :class="$style.hand"
      :player="player"
      :seat="seat"
      :active="active"
      :game="game"
    />

    <PlayerInfo v-else :seat="seat" :game="game" :active="active" />
  </div>
</template>

<script lang="ts">
import Hand from '@/components/Hand.vue';
import PlayerInfo from '@/components/PlayerInfo.vue';
import { defineComponent, computed } from '@vue/composition-api';
import store from '@/store';
import { Game } from '@/logic/game';
import { Card } from '@/logic/card';

export default defineComponent({
  name: "Player",
  components: {
    Hand,
    PlayerInfo
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
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  width: max-content;

  &.north { background-color: @north-color; }
  &.south { background-color: @south-color; }
  &.east { background-color: @east-color; }
  &.west { background-color: @west-color; }

    border-radius: 10px;
  &.active {
    width: 100%;
  }
}
</style>
