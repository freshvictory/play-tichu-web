<template>
  <div>
    <form :class="$style.form">
      <input
        id="name"
        :class="[$style.input, !name ? $style.glow : '']"
        v-model.trim="name"
        placeholder="Enter your name"
        maxlength="20"
        pattern="[A-Za-z0-9 '\-!]+"
      />

      <div :class="$style.box">      
        <button :class="$style.submit" type="button" v-on:click="submit" :disabled="!name" >Host new game!</button>
      </div>

      <div :class="$style.box">
        <input
          id="gameid"
          :class="$style.input"
          v-model.trim="gameid"
          placeholder="Game ID"
          autocomplete="off"
          maxlength="20"
        />
        <button :class="$style.submit" type="button" v-on:click="join" :disabled="!name || !gameid">Join this game!</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import router from '../router';
import store from '../store';

export default defineComponent({
  name: 'NewGame',
  setup: () => {
    const name = ref('');
    const gameid = computed({
      get: () => store.state.clientState.gameId, 
      set: (newValue: string | undefined) => {
          store.commit('setGame', {gameId: newValue});
        } 
    });
    const userid = computed(() => store.state.clientState.userId);

    const submit = async () => {
      console.log(`starting new game!`)
      store.commit('startLobby');

      store.commit('makeUserId', {name: name.value});
      store.commit('joinLobby', { name: name.value, game: gameid.value });
      router.push({path:`game/${gameid.value}`, query: {userId: userid.value} });
    };

    const join = async () => {
      store.commit('makeUserId', {name: name.value});
      store.commit('joinLobby', {name: name.value, game: gameid.value})
      router.push({path:`game/${gameid.value}`, query: {userId: userid.value} });
    }

    return {
      name,
      gameid,
      submit,
      join
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
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  display: grid;
  gap: @px-grid-gap;
}

.input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;

  &:invalid {
    border: 2px solid red;
    box-shadow: 0 0 5px darkred;
  }
}

.glow {
  box-shadow: 0 0 10px @submit-color;
}

.submit {
  border-radius: 3px;
  padding: 5px;
  background-color: @submit-color; 

  &:disabled {
    cursor: not-allowed;
    background-color: lightgray;
    color:gray;
  }
}
</style>
