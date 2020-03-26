<template>
  <div :class="$style.table">
    <transition-group tag="ol" name="play-slide" :class="$style.trick" ref="trick">
        <li
          :class="$style.play"
          :style="`--i:${currentTrick.length < 3 ? i : i - (currentTrick.length - 3)}`"
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
    <div v-if="currentTrick.length">
      <button @click="take">Take trick</button>
    </div>
  </div>
</template>

<script lang="ts">
import Card from './Card.vue';
import { defineComponent, computed, watch, ref } from '@vue/composition-api';
import store from '../store';
import { Seat } from '../logic/game';

export default defineComponent({
  name: 'Table',
  components: {
    Card,
  },
  setup: () => {
    const trick = ref<Vue>(null);
    const currentTrick = computed(() => store.getters.currentTrick);
    const name = computed(() => (seat: Seat) => store.getters.player(seat).name);

    watch(currentTrick, () => {
      if (trick.value) {
        const el = trick.value.$el;
        el.children[el.childElementCount - 1]
          .scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    });

    const take = () => {
      store.commit('take', { seat: 'north', cards: currentTrick.value });
    };

    return  {
      currentTrick,
      name,
      take,
      trick,
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
  display: flex;
  flex-wrap: wrap;
  justify-items: center;
}

.play {
  margin: 10px;

  border: 2px dotted #ddd;
  border-radius: 20px;
  backdrop-filter: blur(10px);

  display: grid;
  gap: @px-grid-gap;
  grid-template-columns: min-content 1fr;
  max-width: max-content;
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
  justify-content: center;
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
