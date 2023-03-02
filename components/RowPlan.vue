<script setup lang="ts">
import { nextTick, computed, ref, StyleValue, watch } from 'vue';
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
const colors = ['#f19c79', '#ff6b6b', '#57cc99', '#00bbf9', '#495867', '#f5cb5c', '#7678ed']
const menuStyle = ref({})
const inputRef = ref<HTMLInputElement>()
const menuVisible = computed(() => menuRowPlanId.value === props.rowPlan.id)

watch(activePlanId, hideMenu)
onKeyStroke('Escape', hideMenu)

function handleMouseoverLane(plan: Plan) {
  // if(menuPlanId.value) {
  //   return
  // }
  highlightPlanId.value = plan.id
}
function handleMouseleaveLane(plan: Plan) {
  highlightPlanId.value = null
}
function showMenu(e: MouseEvent) {
  menuPlanId.value = props.rowPlan.plan.id
  menuRowPlanId.value = props.rowPlan.id
  const preferRight = e.clientX < window.innerWidth - 300
  const preferBottom = e.clientY < window.innerHeight - 300
  menuStyle.value = {
    top: e.offsetY - 15 + 'px',
    left: e.offsetX + 15 + 'px',
    transform: `translate(${preferRight ? 0 : '-100%'}, ${preferBottom ? 0 : '-100%'})`
  }
  nextTick(() => inputRef.value?.focus())
}
function hideMenu() {
  menuPlanId.value = null
  menuRowPlanId.value = null
}
</script>

<template>
  <div
    mb-1 h-5 shrink-0 y-center gap-1
    absolute text-sm transition cursor-default
    :class="[{
      'rounded-l': rowPlan.rowHasPlanStart,
      'rounded-r mr-2': rowPlan.rowHasPlanEnd,
      'pointer-events-none': !!editingPlanId,
      'z-1 scale-x-103': rowPlan.active
    }]" 
    :style="rowPlan.style"
    @mouseover="handleMouseoverLane(rowPlan.plan)"
    @mouseleave="handleMouseleaveLane(rowPlan.plan)"
    @contextmenu.prevent="showMenu">
    <Adjust v-show="rowPlan.rowHasPlanStart" isStart :plan="rowPlan.plan" bg-amber-3 rounded-l shrink-0 />
    <div v-if="rowPlan.rowHasPlanStart" :class="rowPlan.active ? 'text-light' : 'text-light-5'">
      <span>{{ rowPlan.plan.workDays }}d({{ rowPlan.plan.workHours }}h)</span>
      <span v-if="rowPlan.plan.note">: {{ rowPlan.plan.note }}</span>
    </div>
    <Adjust v-show="rowPlan.rowHasPlanEnd" :isStart="false" :plan="rowPlan.plan" shrink-0 ml-auto />
    <Transition
      enter-active-class="ease-in"
      enter-from-class="transition-150 opacity-80">
      <div 
        v-if="menuVisible" 
        :style="menuStyle"
        bg="light dark:dark-2"
        shadow-lg py-1
        absolute rounded flex flex-col items-stretch overflow-hidden>
        <input
          ref="inputRef"
          v-model="rowPlan.plan.note"
          @keydown.enter="hideMenu"
          placeholder="添加标题"
          bg-transparent border-b border-color outline-none grow-1 p-2 />
        <div flex gap-2 p-2>
          <button 
          v-for="color in colors" 
          :key="color" 
          :style="{backgroundColor: color, outlineColor: color}"
          :class="{'outline outline-offset-2': rowPlan.plan.color === color}"
          @click="rowPlan.plan.color = color"
          rounded-full wh-5 />
        </div>
        <button y-center p-2 gap-1 hover:bg-light-9 hover:dark:bg-dark-6 @click="planner.delete(rowPlan.plan.id)">
          <div class="i-carbon:close" text-xl />
          删除
        </button>
        <button y-center p-2 gap-1 hover:bg-light-9 hover:dark:bg-dark-6 @click="hideMenu">
          <div i-carbon:undo text-xl />
          取消
        </button>
      </div>
    </Transition>
  </div>
</template>
