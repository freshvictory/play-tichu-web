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
      <strong :class="$style.name">{{ player.name }}</strong>
      <span :class="$style.count">
        <strong>{{ player.hand.size }}</strong>
        <HandSvg :class="$style.icon"/>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Hand from "@/components/Hand.vue";
import HandSvg from "@/components/svg/Hand.vue";
import { defineComponent, computed } from "@vue/composition-api";
import store from "../store";

export default defineComponent({
  name: "Player",
  components: {
    Hand,
    HandSvg
  },
  props: {
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

.info {
  display: flex;
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
