<template>
  <div :class="$style.name">
    <form v-if="edit" :class="$style.edit" @submit.prevent="submitName">
      <input type="text" placeholder="Enter your name!" v-model="inputName" size="30" />
      <button type="button" :class="$style.cancel" @click="cancelEdit">X</button>
      <button type="submit" :class="$style.submit">change name</button>
  </form>
    <span v-else :class="$style.display" @click="editName">
      <strong>{{playerName}}</strong>
      <Edit :class="[$style.icon, $style[seat]]"/>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import store from '../store';
import Edit from '@/components/svg/Edit.vue';
import { Seat } from '../logic/game';

export default defineComponent({
  name: 'PlayerName',
  components: {
    Edit
  },
  props: {
    seat: { type: String as () => Seat, required: false },
  },
  setup: (props) => {
    const inputName = ref('');

    const edit = ref(false);

    const playerName = computed(() => {
        const name = store.state.sharedState.stage != 'game' ? '' : 
            store.state.sharedState.stageState.seats[props.seat as Seat].name;
        return name ? name : 'Click to enter your name!'
    });

    const editName = () => {
        console.log('edit me!');
        if(edit.value) return;
        edit.value = true;
        inputName.value = playerName.value;
    };

    const submitName = async () => {
        if(!edit.value) return;
        await store.dispatch('changeName', {seat: props.seat, name: inputName.value})
        edit.value = false;
    }

    const cancelEdit = () => {
        edit.value = false;
    }

    return {
        inputName,
        edit,
        playerName,
        editName,
        submitName,
        cancelEdit
    };
  },
});
</script>

<style lang="less" module>
@import '../shared.less';

.display {
  display: flex;
  align-items: center;

  :hover {
    cursor: pointer;
  }
  .edit {
      color: gray;
  }
}

.icon {
  width: 15px;
  height: 15px;
  margin-left: 5px;
  color: gray;

  &.north { --background: @north-color; }
  &.south { --background: @south-color; }
  &.east { --background: @east-color; }
  &.west { --background: @west-color; }
}

.edit {
  input {
    background-color: #fff;
    border-radius: 10px;
    padding: 5px 10px;
  }

  .submit {
    margin-left: 10px;    
    .action;
  }
  .cancel {
    margin-left:-25px;
    .action;
  }
}


</style>
