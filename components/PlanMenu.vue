<script setup lang="ts">
import { computed } from 'vue';
import { menuPlanId, planner } from '~~/composables/days';

const colors = ['#ffb353', '#ffde58', '#5b9dff', '#6fdf74', '#cd7df6']
const menuPlan = computed(() => planner.get(menuPlanId.value))

function hideMenu()  {
  menuPlanId.value = null
}
function deleteMenu() {
  planner.delete(menuPlanId.value!)
  menuPlanId.value = null
}
</script>

<template>
  <div v-if="menuPlan" absolute rounded bg-white text-dark flex flex-col items-stretch overflow-hidden>
    <input 
      v-model="menuPlan.note"
      @keydown.enter="hideMenu"
      placeholder="添加标题"
      bg-transparent border-b outline-none grow-1 p-2 />
    <div flex gap-2 p-2>
      <button 
        v-for="color in colors" 
        :key="color" 
        :style="{backgroundColor: color, outlineColor: color}"
        :class="{'outline outline-offset-2': menuPlan.color === color}"
        @click="menuPlan!.color = color"
        rounded-full wh-5 />
    </div>
    <button y-center gap-1 p-2 hover:bg-gray @click="deleteMenu">
      <div i-carbon:close />
      删除
    </button>
    <button y-center gap-1 p-2 hover:bg-gray @click="hideMenu">
      <div i-carbon:undo />
      取消
    </button>
  </div>
</template>
