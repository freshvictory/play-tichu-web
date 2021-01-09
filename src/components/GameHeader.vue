<template>
  <header :class="$style.header">
    <div :class="$style.flex">
      <router-link to="/" title="Home"><h1 :class="$style.title">tichu</h1></router-link>
    </div>
    <div :class="$style.suits">
      <span v-for="suit in suits" :key="suit" :class="[$style.gem, $style[suit]]"></span>
    </div>
    <ul v-if="seat" :class="$style.options">
      <li v-if="allCardsPassed">
        <button :class="$style.button" @click="pickUp">everybody pick up</button>
      </li>
      <li>
        <button :class="$style.button" @click="resync">resync</button>
      </li>
      <li>
        <button :class="$style.button" @click="rewind">rewind</button>
      </li>
      <li>
        <button :class="$style.button" @click="endHand">end hand</button>
      </li>
    </ul>
  </header>
</template>

<script lang="ts">
import PlayerName from '../components/PlayerName.vue';
import { defineComponent, computed } from '@vue/composition-api';
import store from '../store';
import { Seat } from '../logic/game';
import { Suit } from '../logic/gems-deck';

export default defineComponent({
  name: 'GameHeader',
  components: {
    PlayerName
  },
  props: {
    seat: { type: String as () => Seat, required: false },
  },
  setup: () => {
    const currentTrick = computed(() => store.getters.currentTrick);
    const allCardsPassed = computed(() => store.getters.allCardsPassed);

    const suits = computed(() => {
      if(store.state.sharedState.stage === 'none') return undefined;
      if(store.state.sharedState.stageState.type === 'tichu') return [];
      const gemsuits: Suit[] = ['blue', 'green', 'black', 'red'];
      return gemsuits;
    });

    const endHand = () => {
      store.commit('toggleEndHandModal');
    };

    const pickUp = async () => {
      await store.dispatch('pickUpPassedCards');
    };

    const resync = async () => {
      await store.dispatch('sendState');
    };

    const rewind = async () => {
      await store.dispatch('rewind');
    };

    return {
      currentTrick,
      allCardsPassed,
      suits,
      endHand,
      pickUp,
      resync,
      rewind
    }
  }
});
</script>

<style lang="less" module>
@import '../shared.less';

.header {
  width: 100%;
  display: flex;
  padding: @px-grid-gap;
  align-items: center;
  justify-content: space-between;
  background-color: #49bd66;
}

.flex {
  display: flex;
  align-items: center;
}

.title {
  font-size: 24px;
  background: linear-gradient(to right, #efa940, #f0cb66);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  filter: drop-shadow(1px 1px #2c3e50);
}

.options {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.button {
  margin-left: 20px;
  .action();
}

.modal {
  position: relative;
  top: 10px;
}

.suits {
  display: grid;
  grid-template-areas: 
    ". fire ."
    "air . water"
    ". earth .";
  grid-auto-columns: 25px;
  grid-auto-rows: 25px;

  position:absolute;
  top:5px;
  left:50%;
  margin-left:-32px;
}

.gem {
  background-color: var(--c-gem);
  width: 25px;
  height: 25px;
  border-radius: 40%;
  
  &.green {
    --c-gem: @suit-green;    
    background-image: url('/img/earth.svg');
    grid-area: earth;
  }  
  &.blue {
    --c-gem: @suit-blue;
    background-image: url('/img/water.svg');
    grid-area: water;
  }
  &.red {
    --c-gem: @suit-red;
    background-image: url('/img/fire.svg');
    grid-area: fire;
  }
  &.black {
    --c-gem: @suit-black;
    background-image: url('/img/air.svg');
    grid-area: air;
  }
}
</style>
