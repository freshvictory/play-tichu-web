<template>
  <div>
    <form :class="$style.form" @submit.prevent="submit">
      <input id="name" :class="$style.input" v-model.trim="name" placeholder="Your name" />
      <button :class="$style.submit" type="submit">Start a game!</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import router from '../router';

export default defineComponent({
  name: 'NewGame',
  setup: (_, ctx) => {
    const name = ref('Justin');

    const submit = () => {
      ctx.root.$store.commit('startLobby', { name: name.value });
      router.push(`/game/${ctx.root.$store.getters.gameId}`);
    };

    return {
      name,
      submit,
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
