<template>
  <div id="lobby" :class="$style.lobby">
    <form @submit.prevent="join" :class="$style.form">
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
      </div>
      <input v-if="chosenSeat" :class="$style.name" v-model="name" placeholder="Your name"/>
      <button v-if="chosenSeat" type="submit" :class="$style.submit">Submit</button>
    </form>
    <button v-if="lobby.full" :class="$style.start" @click="start">start</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { Lobby } from '../logic/lobby';
import store from '../store';
import { Seat } from '../logic/game';

export default defineComponent({
  name: 'Lobby',
  props: {
    lobby: { type: Lobby, required: true },
  },
  setup: () => {
    const chosenSeat = ref('');
    const name = ref('');

    const chooseSeat = (seat: Seat) => {
      console.log('Choosing seat', seat);
      chosenSeat.value = seat;
    };

    const join = () => {
      console.log('Joining lobby...');
      store.commit('joinLobby', { name: name.value, seat: chosenSeat.value });
      chosenSeat.value = '';
    };

    const start = () => store.commit('startGame');

    return {
      join,
      chooseSeat,
      chosenSeat,
      name,
      start,
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
  grid-template-columns: 100px 100px;
  grid-template-rows: 100px 100px;
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
  grid-row: 1;
  grid-column: 1;
}

.south {
  grid-row: 2;
  grid-column: 2;
}

.east {
  grid-row: 1;
  grid-column: 2;
}

.west {
  grid-row: 2;
  grid-column: 1;
}

.north, .south {
  --c-team: #ef5840;
  --c-team-light: #ff654a;
}

.east, .west {
  --c-team: #efc940;
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
  margin: 20px;
  padding: 10px 20px;
  background-color: #03a503;
  border-radius: 5px;
}
</style>
