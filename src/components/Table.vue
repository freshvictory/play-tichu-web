<template>
  <div :class="$style.table">
    <ol :class="$style.trick">
    <transition-group name="play-slide">
        <li
          :class="$style.play"
          :style="`--i:${i}`"
          v-for="([seat, cards], i) in currentTrick"
          :key="i"
        >
          <div :class="$style.name"><p>{{ name(seat) }}</p></div>
          <ol :class="$style.list">
            <li v-for="card in cards" :key="card.id" :class="$style.card" >
              <Card :card="card"/>
            </li>
          </ol>
        </li>
     </transition-group>
    </ol>
  </div>
</template>

<script lang="ts">
import Card from './Card.vue';
import { defineComponent, computed } from '@vue/composition-api';
import store from '../store';
import { Seat } from '../logic/game';

export default defineComponent({
  name: 'Table',
  components: {
    Card,
  },
  setup: () => {
    const currentTrick = computed(() => store.getters.currentTrick);
    const name = computed(() => (seat: Seat) => store.getters.player(seat).name);

    return  {
      currentTrick,
      name,
    };
  },
});
</script>

<style lang="less" module>
@import '../shared.less';

.table {
  padding: 20px;
}

.trick {
  position: relative;
}

.play {
  position: absolute;

  border: 2px dotted #ddd;
  border-radius: 20px;
  backdrop-filter: blur(10px);

  display: grid;
  gap: @px-grid-gap;
  grid-template-columns: min-content max-content;
  max-width: max-content;

  top: calc(var(--i) * 90px);
  // left: calc(var(--i) * 20px);

  transform: scale(1);
  will-change: transform;
  transition: transform 300ms;

  &:hover {
    z-index: 5;
    transform: scale(1.1);
  }
}


.name {
  padding: 15px 10px;
  border-top-left-radius: 18px;
  border-bottom-left-radius: 18px;
  line-height: 1;
  text-align: right;
  background: #eee;
}

.list {
  margin: 15px 15px 15px 0;
  .card-grid;
}
</style>

<style lang="less">
.play-slide-enter-active {
  transition: all 300ms;
}
.play-slide-leave-active {
  transition: all 300ms;
}
.play-slide-enter, .play-slide-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
