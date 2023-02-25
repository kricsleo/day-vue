<script setup lang="ts">
import { StyleValue } from 'vue';
import { planner, Plan, editingPlanId, highlightPlanId } from '~~/composables/days';
import Adjust from './Adjust.vue';

const props = defineProps<{
  rowPlan:{
    plan: Plan
    rowPlanStartIdx: number
    rowPlanEndIdx: number
    rowHasPlanStart: boolean
    rowHasPlanEnd: boolean
    style: StyleValue
    active: boolean
  }
}>()
// const rowPlans = computed(() => {
//   const inRowPlans = planner.plans.value.filter(plan => areIntervalsOverlapping(
//     { start: plan.start, end: plan.end },
//     { start: props.days[0].date, end: props.days[props.days.length - 1].date },
//   ))
//   const rowPlans = inRowPlans.map(plan => {
//     const rowPlanStartIdx = props.days.findIndex(day => day.date === plan.start)
//     const rowPlanEndIdx = props.days.findIndex(day => day.date === plan.end)
//     const rowHasPlanStart = rowPlanStartIdx !== -1
//     const rowHasPlanEnd = rowPlanEndIdx !== -1
//     const style = {
//       // backgroundColor: plan.color, 
//       left: `${rowHasPlanStart ? rowPlanStartIdx / weeks.length * 100 : 0}%`,
//       right: `${rowHasPlanEnd ? (weeks.length - 1 - rowPlanEndIdx) / weeks.length* 100 : 0}%`,
//       bottom: `${plan.lane * 24}px`
//     }
//     const active = plan.id === activePlanId.value
//     return { plan, rowPlanStartIdx, rowPlanEndIdx, rowHasPlanStart, rowHasPlanEnd, style, active }
//   })
//   return rowPlans
// })

function handleMouseoverLane(plan: Plan) {
  highlightPlanId.value = plan.id
}
function handleMouseleaveLane(plan: Plan) {
  highlightPlanId.value = null
}
function handleContextmenu(e: MouseEvent) {
  console.log('handleContextmenu', e)
}
</script>

<template>
  <div
    mb-1 h-5 shrink-0 whitespace-nowrap overflow-hidden text-white y-center
    absolute text-sm transition
    :class="[{
      'rounded-l': rowPlan.rowHasPlanStart,
      'rounded-r mr-2': rowPlan.rowHasPlanEnd,
      'pointer-events-none': !!editingPlanId
    }, rowPlan.active ? 'op-95 bg-amber-5' : 'op-80 bg-sky-6' ]" 
    :style="rowPlan.style"
    @mouseover="handleMouseoverLane(rowPlan.plan)"
    @mouseleave="handleMouseleaveLane(rowPlan.plan)"
    @contextmenu="handleContextmenu">
    <Adjust v-show="rowPlan.rowHasPlanStart" isStart :plan="rowPlan.plan" bg-amber-3 shrink-0 />
    <template v-if="rowPlan.rowHasPlanStart">
      <button h-full px-1 transition @click="planner.delete(rowPlan.plan.id)">
        <div class="i-carbon:close" />
      </button>
      <span>{{ rowPlan.plan.workDays }}d({{ rowPlan.plan.workHours }}h)</span>
      <input bg-transparent border-none outline-none w-10 max-w-80 flex-1 />
    </template>
    <Adjust v-show="rowPlan.rowHasPlanEnd" :isStart="false" :plan="rowPlan.plan" shrink-0 ml-auto />
  </div>
</template>
