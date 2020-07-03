<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48.5 49.53" class="edit-svg">
    <defs>
    </defs>
    <rect class="cls-1" x="1.5" y="7.4" width="41.31" height="41.31" rx="10"/>
    <rect class="cls-2" x="1.5" y="7.4" width="41.31" height="41.31" rx="10"/>
    <rect x="20.33" y="15.14" width="38.69" height="11.65" rx="5" transform="translate(-9.73 35.93) rotate(-50)"/>
    <rect class="cls-3" x="20.33" y="15.14" width="38.69" height="11.65" rx="5" transform="translate(-9.73 35.93) rotate(-50)"/>
    <path d="M22,40.73c-.28,1.07.31,1.57,1.32,1.11l4-1.83a1.17,1.17,0,0,0,.29-2.12L25.11,35.8a1.17,1.17,0,0,0-2,.65Z" transform="translate(-7.85 -1.95)"/>
    <path class="cls-4" d="M22,40.73c-.28,1.07.31,1.57,1.32,1.11l4-1.83a1.17,1.17,0,0,0,.29-2.12L25.11,35.8a1.17,1.17,0,0,0-2,.65Z" transform="translate(-7.85 -1.95)"/>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Edit'
});
</script>

<style lang="less">
.edit-svg {
  .cls-1 {
    fill: transparent;
  }
  .cls-3, .cls-4 {
    fill: none;
    stroke-miterlimit: 10;
  }
  .cls-2, .cls-4 {
    stroke: currentColor;
  }
  .cls-2 {
    fill: var(--background);
    stroke-width: 3px;
  }
  .cls-3 {
    stroke: var(--background);
    fill: currentColor;
    stroke-width: 5px;
  }
  .cls-4 {
    fill: currentColor;
  }
}
</style>
