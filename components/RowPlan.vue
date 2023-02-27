<script setup lang="ts">
import { computed, ref, StyleValue, watch } from 'vue';
import { planner, Plan, editingPlanId, highlightPlanId, menuPlanId, menuRowPlanId, activePlanId } from '~~/composables/days';
import Adjust from './Adjust.vue';
import { onKeyStroke } from '@vueuse/core'

const props = defineProps<{
  rowPlan:{
    id: string
    plan: Plan
    rowPlanStartIdx: number
    rowPlanEndIdx: number
    rowHasPlanStart: boolean
    rowHasPlanEnd: boolean
    style: StyleValue
    active: boolean
  }
}>()
const menuStyle = ref({})
const colors = ['#ff7065', '#ffb353', '#ffde58', '#5b9dff', '#6fdf74', '#cd7df6']
const menuVisible = computed(() => menuRowPlanId.value === props.rowPlan.id)

watch(activePlanId, hideMenu)
onKeyStroke('Escape', hideMenu)

function handleMouseoverLane(plan: Plan) {
  highlightPlanId.value = plan.id
}
function handleMouseleaveLane(plan: Plan) {
  highlightPlanId.value = null
}
function showMenu(e: MouseEvent) {
  menuPlanId.value = props.rowPlan.plan.id
  menuRowPlanId.value = props.rowPlan.id
  menuStyle.value = {
    top: e.offsetY + 'px',
    left: e.offsetX + 'px'
  }
  console.log('handleContextmenu', e)
}
function hideMenu() {
  menuPlanId.value = null
  menuRowPlanId.value = null
}
</script>

<template>
  <div
    mb-1 h-5 shrink-0 text-white y-center
    absolute text-sm transition
    :class="[{
      'rounded-l': rowPlan.rowHasPlanStart,
      'rounded-r mr-2': rowPlan.rowHasPlanEnd,
      'pointer-events-none': !!editingPlanId
    }, rowPlan.active ? 'op-100 z-1' : 'op-65' ]" 
    :style="rowPlan.style"
    @mouseover="handleMouseoverLane(rowPlan.plan)"
    @mouseleave="handleMouseleaveLane(rowPlan.plan)"
    @contextmenu.prevent="showMenu">
    <Adjust v-show="rowPlan.rowHasPlanStart" isStart :plan="rowPlan.plan" bg-amber-3 rounded-l shrink-0 />
    <template v-if="rowPlan.rowHasPlanStart">
      <span>{{ rowPlan.plan.note }}</span>
      <span>{{ rowPlan.plan.workDays }}d({{ rowPlan.plan.workHours }}h)</span>
    </template>
    <Adjust v-show="rowPlan.rowHasPlanEnd" :isStart="false" :plan="rowPlan.plan" shrink-0 ml-auto />
    <div v-if="menuVisible" :style="menuStyle" absolute rounded bg-white text-dark flex flex-col items-stretch overflow-hidden>
      <input 
        v-model="rowPlan.plan.note"
        @keydown.enter="hideMenu"
        placeholder="添加标题"
        bg-transparent border-b outline-none grow-1 p-2 />
      <div flex gap-2 p-2>
        <button 
          v-for="color in colors" 
          :key="color" 
          :style="{backgroundColor: color, outlineColor: color}"
          :class="{'outline outline-offset-2': rowPlan.plan.color === color}"
          @click="rowPlan.plan.color = color"
          rounded-full wh-5 />
      </div>
      <button y-center gap-1 p-2 hover:bg-gray @click="planner.delete(rowPlan.plan.id)">
        <div class="i-carbon:close" />
        删除
      </button>
      <button y-center gap-1 p-2 hover:bg-gray @click="hideMenu">
        <div i-carbon:undo />
        取消
      </button>
    </div>
  </div>
</template>
