<template>
    <transition-group tag="ol" name="play-slide" :class="$style.trick" ref="trick">
      <li
        :class="$style.play"
        :style="`--i:${currentTrick.length < 3 ? i : i - (currentTrick.length - 3)}`"
        v-for="([seat, cards], i) in currentTrick"
        :key="i"
      >
        <div :class="[$style.name, $style[seat]]">
          <p>{{ name(seat) }}</p>
          <span v-if="cards.length > 5" :class="$style.cardCount">
            {{cards.length}} cards
          </span>
        </div>          
        <ol :class="$style.list">
          <li v-for="card in cards" :key="card.id" :class="[$style.card, $style['card-container']]" >
            <Card :card="card"/>
          </li>
        </ol>
      </li>
      <li key="take">
        <button v-if="seat && currentTrick.length" :class="$style.take" @click="take">
          take trick
        </button>
      </li>
  </transition-group>
</template>

<script lang="ts">
import Card from '@/components/Card.vue';
import { defineComponent, computed, ref, watch } from '@vue/composition-api';
import { Seat } from '@/logic/game';
import store from '@/store';

export default defineComponent({
  name: 'Tricks',
  components: {
    Card
  },
  props: {
    seat: { type: String as () => Seat, required: false }
  },
  setup: (props) => {
    const trick = ref<Vue>(null);
    const currentTrick = computed(() => store.getters.currentTrick);
    const name = computed(() => (seat: Seat) => store.getters.player(seat).name);

    watch(currentTrick, () => {
      if (trick.value) {
        const el = trick.value.$el;
        el.children[el.childElementCount - 2]
          ?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    });

    const take = async () => {
      await store.dispatch('take', { seat: props.seat, cards: currentTrick.value });
    };

    return  {
      currentTrick,
      name,
      trick,
      take,
    };
  },
});
</script>

<style lang="less" module>
@import '../shared.less';

.trick {
  display: flex;
  padding: @px-grid-gap;
  padding-bottom: 0;
  flex-wrap: wrap;
  justify-items: center;
  align-items: center;
}

.play {
  margin-right: @px-grid-gap;
  margin-bottom: @px-grid-gap;

  display: grid;
  grid-gap: 5px;
  grid-template-columns: min-content 1fr;
  max-width: max-content;
}


.name {
  padding: 15px 10px;
  border-radius: 5px;
  line-height: 1;
  text-align: right;
  background: #eee;
  font-weight: bold;
  box-shadow: 3px 3px;

  &.north {
    background: @north-color;
    color: black;
  }
  &.south {
    background: @south-color;
    color: black;
  }
  &.east {
    background: @east-color;
    color: black;
  }
  &.west {
    background: @west-color;
    color: black;
  }
}

.list {
  .card-grid;
  position: relative;
  justify-content: center;
}

.cardCount {
  display: block;
  margin-top: @px-grid-gap;
}

.take {
  .button;
  display: inline;
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
