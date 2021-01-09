<template>
  <div>
    <form :class="$style.form" @submit.prevent="() => gameid ? join() : submit()">
      <div :class="$style.box">      
        <input
          id="name"
          :class="[$style.input, !name ? $style.glow : '']"
          v-model.trim="name"
          placeholder="Enter your name"
          maxlength="20"
          pattern="[A-Za-z0-9 '\-!]+"
          autocomplete="off"
        />

        <button
          v-if="!gameid"
          :class="$style.submit"
          type="submit"
          :disabled="!name || starting"
        >
          Host new game!
        </button>
        <button
          v-else
          :class="$style.submit"
          type="submit"
          :disabled="!name || starting"
        >
          Join this game!
        </button>
      </div>

      <div>
        <button
          type="button"
          :class="$style.link"
          @click="$emit('changegame')"
        >
          Change game
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import router from '../router';
import store from '../store';
import { GameType } from '../logic/game';

export default defineComponent({
  name: 'NewGame',
  props: {
    gameType: { type: String as () => GameType, required: true }
  },
  setup: (props) => {
    const name = ref('');
    const starting = ref(false);
    const gameid = computed({
      get: () => store.state.clientState.gameId, 
      set: (newValue: string | undefined) => {
          store.commit('setGame', {gameId: newValue});
        } 
    });
    const userid = computed(() => store.state.clientState.userId);

    const submit = async () => {
      console.log(`starting new game!`)
      starting.value = true;
      store.commit('startLobby', {type: props.gameType});

      store.commit('makeUserId', {name: name.value});
      store.commit('joinLobby', { name: name.value, game: gameid.value });
      router.push({path:`game/${gameid.value}`, query: {userId: userid.value} });
    };

    const join = async () => {
      starting.value = true;
      store.commit('makeUserId', {name: name.value});
      store.commit('joinLobby', {name: name.value, game: gameid.value})
      router.push({path:`game/${gameid.value}`, query: {userId: userid.value} });
    }

    return {
      name,
      gameid,
      submit,
      join,
      starting
    };
  },
});
</script>

<style lang="less" module>
@import '../shared.less';

@submit-color: #efc940;

.form {
  display: grid;
  gap: @px-grid-gap;
}

.box {
  background: #fff;
  border-radius: 25px;
  padding: @px-grid-gap;
  display: grid;
  gap: @px-grid-gap;
  box-shadow: 3px 3px;
}

.input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-sizing: border-box;

  &:invalid {
    border: 2px solid red;
    box-shadow: 0 0 5px darkred;
  }
}

.glow {
  border: 2px solid gold;
}

.submit {
  .button();
  padding: 10px;
  border-radius: 10px;
  background-color: @submit-color; 

  &:disabled {
    cursor: not-allowed;
    background-color: lightgray;
    color:gray;
  }
}

.link {
  color: blue;
  text-decoration: underline;
  border: none;
}
</style>
