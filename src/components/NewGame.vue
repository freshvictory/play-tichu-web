<template>
  <div>
    <form :class="$style.form">
      <input
        id="name"
        :class="$style.input"
        v-model.trim="name"
        placeholder="Your name"
      />

      <input
        id="gameid"
        :class="$style.input"
        v-model.trim="gameid"
        placeholder="Game ID"
        autocomplete="off"
      />
      
      <button v-if="gameid" :class="$style.submit" type="button" v-on:click="join">Join this game!</button>
      <button v-else :class="$style.submit" type="button" v-on:click="submit">Start new game!</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import router from '../router';
import store from '../store';
import { Player } from '../logic/player';

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

.form {
  display: grid;
  gap: @px-grid-gap;
}

.input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.submit {
  border-radius: 3px;
  padding: 5px;
  background-color: #efc940;
}
</style>
