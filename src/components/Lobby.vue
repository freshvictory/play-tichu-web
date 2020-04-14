<template>
  <div id="lobby" :class="$style.lobby">
    <form @submit.prevent="sit" :class="$style.form">
      <div :class="$style.seats" >
        <div
          v-for="(player, seat) in lobby.seats"
          :class="[
            $style.seat,
            $style[seat],
            chosenSeat === seat ? $style.active : ''
          ]"
          :key="seat"
          :is="player ? 'div' : 'label'"
          :for="seat"
        >
          <label :for="seat" :class="$style['seat-label']">{{ seat }}</label>
          <p>{{ player ? player.name : 'open' }}</p>
          <input v-if="!player"
            type="radio"
            :id="seat"
            name="seats"
            :class="$style.join"
            v-model="chosenSeat"
            :value="seat"
          />
        </div>
        <div :class="$style.buttons">
          <button v-if="chosenSeat && !mySeat" type="submit" :class="$style.submit">Sit Down</button>
          <!-- <button v-if="chosenSeat" type="button" @click="ghost" :class="$style.submit">Ghost</button> -->
          <button v-if="lobby.full" :class="$style.start" @click="start">start</button>
        </div>
      </div>
      <button type="button" :class="$style.submit" @click="copyLink">Copy Invite Link</button>
      <!-- <button type="button" :class="$style.submit" @click="ghostTab">Ghost Tab =></button> -->
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import { Lobby } from '../logic/lobby';
import store from '../store';
import { Seat } from '../logic/game';
import { Player } from '../logic/player';

export default defineComponent({
  name: 'Lobby',
  props: {
    lobby: { type: Lobby, required: true }
  },
  setup: (props, ctx) => {
    const chosenSeat = ref('');
    const name = computed(() => store.state.clientState.name);
    const mySeat = computed(() => store.getters.mySeat);

    const chooseSeat = (seat: Seat) => {
      console.log('Choosing seat', seat);
      chosenSeat.value = seat;
    };

    const sit = () => {
      console.log(`Taking seat as ${name.value}...`);
      store.dispatch('takeSeat', { seat: chosenSeat.value });
      chosenSeat.value = '';
    };
    
    const ghost = () => {
      store.dispatch('ghostSeat', { seat: chosenSeat.value });
      chosenSeat.value = '';
    };

    const start = () => store.dispatch('startGame');

    const copyLink = async () => {
      const gameId = store.state.clientState.gameId;
      if(gameId === undefined) return;
      const routeData = ctx.root.$router.resolve({name: 'Game', params: {id: gameId}});
      const uri = `https://${location.host}${routeData.href}`;
      await navigator.clipboard.writeText(uri);
    };
  
    const ghostTab = () => {
      const gameId = store.state.clientState.gameId;
      if(gameId === undefined) return;
      const ghostId = Player.getId('');
      const routeData = ctx.root.$router.resolve({name: 'Game', query: {userId: ghostId}, params: {id: gameId}});
      window.open(routeData.href,'_blank');
    }

    return {
      sit,
      ghost,
      chooseSeat,
      chosenSeat,
      name,
      mySeat,
      start,
      copyLink,
      ghostTab
    };
  },
});
</script>

<style lang="less" module>
@import '../shared.less';

.lobby {
  margin: auto;
}

.form {
  display: grid;
  gap: @px-grid-gap;
}

.seats {
  display: grid;
  grid-template-columns: 120px 120px 120px;
  grid-template-rows: 120px 120px 120px;
  grid-template-areas: 
    ". north ."
    "west buttons east"
    ". south .";
  gap: @px-grid-gap;
}

.seat {
  --c-team: #ddd;

  border: 2px solid var(--c-team);
  border-radius: 5px;

  display: grid;
  grid-template-rows: max-content 1fr;
  align-items: center;
}

label {
  &.seat {
    cursor: pointer;
  }

  &.active {
    background: var(--c-team);
  }
}

.seat-label {
  font-weight: bold;
  padding: 5px 0;
  background-color: var(--c-team);
  border-bottom: 2px dotted #fff;
}

.north {
  grid-area: north;
  --c-team: @north-color;
}
.south { 
  grid-area: south;
  --c-team: @south-color;
}
.east {
  grid-area: east;
  --c-team: @east-color;
}
.west { 
  grid-area: west;
  --c-team: @west-color;
}

.buttons {
  grid-area: buttons;
  display: grid;
  align-self: center;
  gap: @px-grid-gap;
}

.join {
  display: none;
}

.name {
  border: 2px solid #ddd;
  border-radius: 5px;
  padding: 5px;
}

.submit {
  border: 2px solid #ddd;
  border-radius: 5px;
  padding: 5px;
}

.start {
  color: #fff;
  padding: 10px 20px;
  background-color: #03a503;
  border-radius: 5px;
}
</style>
