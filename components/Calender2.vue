<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { observerManager } from '@kricsleo/observer'
import { weeks, focusToday, daysRef, Plan } from '~/composables/days';
import CalenderDay2 from './CalenderDay2.vue'
import { chunk } from 'lodash-es'
import { areIntervalsOverlapping } from 'date-fns'
 
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
        backgroundColor: plan.color, 
          left: `${rowHasPlanStart ? rowPlanStartIdx / weeks.length * 100 : 0}%`,
          right: `${rowHasPlanEnd ? (weeks.length - 1 - rowPlanEndIdx) / weeks.length* 100 : 0}%`,
          bottom: `${plan.lane * 22}px`
      }
      return { plan, rowPlanStartIdx, rowPlanEndIdx, rowHasPlanStart, rowHasPlanEnd, style }
    })
    return { plans: rowPlans, days: row }
  })
  return dayRows
})

onMounted(() => focusToday())

onMounted(() => {
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
  <section flex="~ col" h-100vh pb-5>
    <WeekHeader />
    <div ref="container" overflow-auto border rounded class="border-#dadce0 dark:border-#3a3e41">
      <div ref="prevLoader" class="h-0.1px" />
      <div v-for="row in dayRows" :key="row.days[0].id" class="grid grid-cols-7 relative">
        <CalenderDay2
          v-for="day in row.days"
          :key="day.id"
          :day="day"
          class="day" />
        <div 
          v-for="rowPlan in row.plans" 
          :key="rowPlan.plan.id" :class="[
          'mb-1 h-4 shrink-0 whitespace-nowrap overflow-hidden text-light duration-100 y-center gap-1px', 
          'absolute text-sm origin-left', {
            'rounded-l': rowPlan.rowHasPlanStart,
            'rounded-r mr-2': rowPlan.rowHasPlanEnd,
          }, rowPlan.plan.id === activePlanId ? 'op-100 scale-103' : 'op-50' ]" 
          :style="rowPlan.style"
          @mouseover="handleMouseoverLane(rowPlan.plan)"
          @mouseleave="handleMouseleaveLane(rowPlan.plan)">
          <template v-if="rowPlan.rowHasPlanStart">
            <button 
              :class="['w-8 h-full shrink-0 bg-red transition-all center', {'ml--8': rowPlan.plan.id !== activePlanId }]"
              @mousedown.stop="planner.delete(rowPlan.plan.id)">
              <div class="i-carbon:close" />
            </button>
            <div i-carbon:timer shrink-0 />
            {{ rowPlan.plan.workDays }}d({{ rowPlan.plan.workHours }}h)
            <div i-carbon:text-annotation-toggle />
            <input w-5em bg-transparent border-none outline-none grow-1 />
          </template>
          <Adjust v-if="rowPlan.rowHasPlanEnd" :plan="rowPlan.plan" />
        </div>

      </div>
      <div ref="nextLoader" class="h-1px" />
    </div>
  </section>
</template>
