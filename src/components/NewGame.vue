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
import store from '../store';

export default defineComponent({
  name: 'NewGame',
  setup: () => {
    const name = ref('Justin');

    const submit = async () => {
      await store.dispatch('startLobby', { name: name.value });
      router.push(store.getters.gameRoute);
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
