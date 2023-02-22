<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { observerManager } from '@kricsleo/observer'
import { weeks, focusToday, daysRef, Plan, activePlanId, highlightPlanId, planner, editingPlanId } from '~/composables/days';
import { chunk } from 'lodash-es'
import { areIntervalsOverlapping } from 'date-fns'
import WeekHeader from './WeekHeader.vue'
import CalenderDay from './CalenderDay.vue'
import Adjust from './Adjust.vue'
 
const prevLoader = ref<HTMLElement>()
const nextLoader = ref<HTMLElement>()
const container = ref<HTMLElement>()
const dayRows = computed(() => {
  const dayRowChunk = chunk(daysRef.dayManager.days, weeks.length)
  const dayRows = dayRowChunk.map(row => {
    const inRowPlans = planner.plans.value.filter(plan => areIntervalsOverlapping(
      { start: plan.start, end: plan.end },
      { start: row[0].date, end: row[row.length - 1].date },
    ))
    const rowPlans = inRowPlans.map(plan => {
      const rowPlanStartIdx = row.findIndex(day => day.date === plan.start)
      const rowPlanEndIdx = row.findIndex(day => day.date === plan.end)
      const rowHasPlanStart = rowPlanStartIdx !== -1
      const rowHasPlanEnd = rowPlanEndIdx !== -1
      const style = {
        // backgroundColor: plan.color, 
        left: `${rowHasPlanStart ? rowPlanStartIdx / weeks.length * 100 : 0}%`,
        right: `${rowHasPlanEnd ? (weeks.length - 1 - rowPlanEndIdx) / weeks.length* 100 : 0}%`,
        bottom: `${plan.lane * 24}px`
      }
      const active = plan.id === activePlanId.value
      return { plan, rowPlanStartIdx, rowPlanEndIdx, rowHasPlanStart, rowHasPlanEnd, style, active }
    })
    return { plans: rowPlans, days: row }
  })
  return dayRows
})

onMounted(() => {
  focusToday()
  observerManager.registerObserver('loader', { root: container.value, });
  observerManager.observe('loader', prevLoader.value!, () => {
    daysRef.dayManager.addPrevDays()
    // scroll down a litte so that prev loader can be triggerred again
    container.value!.scrollTop = 0.5
  })
  observerManager.observe('loader', nextLoader.value!, () => daysRef.dayManager.addNextDays())
  return () => observerManager.deleteObserver('loader')
})

function handleMouseoverLane(plan: Plan) {
  highlightPlanId.value = plan.id
}
function handleMouseleaveLane(plan: Plan) {
  highlightPlanId.value = null
}
</script>

<template>
  <section flex="~ col">
    <WeekHeader />
    <div ref="container" grow-1 overflow-auto border rounded class="border-#dadce0 dark:border-#3a3e41">
      <div ref="prevLoader" class="h-0.1px" />
      <div v-for="row in dayRows" :key="row.days[0].id" class="grid grid-cols-7 relative">
        <CalenderDay
          v-for="day in row.days"
          :key="day.id"
          :day="day"
          class="day" />
        <div 
          v-for="rowPlan in row.plans" 
          :key="rowPlan.plan.id" 
          :class="[
          'mb-1 h-5 shrink-0 whitespace-nowrap overflow-hidden text-white y-center', 
          'absolute text-sm transition', {
            'rounded-l': rowPlan.rowHasPlanStart,
            'rounded-r mr-2': rowPlan.rowHasPlanEnd,
            'pointer-events-none': !!editingPlanId
          }, rowPlan.plan.id === activePlanId ? 'op-95 bg-amber-6' : 'op-80 bg-sky-6' ]" 
          :style="rowPlan.style"
          @mouseover="handleMouseoverLane(rowPlan.plan)"
          @mouseleave="handleMouseleaveLane(rowPlan.plan)">
          <Adjust v-show="rowPlan.rowHasPlanStart" isStart :plan="rowPlan.plan" bg-amber shrink-0 />
          <template v-if="rowPlan.rowHasPlanStart">
            <button h-full px-1 transition @click="planner.delete(rowPlan.plan.id)">
              <div class="i-carbon:close" />
            </button>
            <span>{{ rowPlan.plan.workDays }}d({{ rowPlan.plan.workHours }}h)</span>
            <input bg-transparent border-none outline-none w-10 max-w-80 flex-1 />
          </template>
          <Adjust v-show="rowPlan.rowHasPlanEnd" :isStart="false" :plan="rowPlan.plan" shrink-0 ml-auto />
        </div>
      </div>
      <div ref="nextLoader" class="h-1px" />
    </div>
  </section>
</template>
