<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { observerManager } from '@kricsleo/observer'
import { weeks, focusToday, daysRef, activePlanId, planner, menuRowPlanId } from '~/composables/days';
import { chunk } from 'lodash-es'
import { areIntervalsOverlapping } from 'date-fns'
import WeekHeader from './WeekHeader.vue'
import CalenderDay from './CalenderDay.vue'
import RowPlan from './RowPlan.vue';
 
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
      const id = `${plan.id}${row[0].date}`
      const rowPlanStartIdx = row.findIndex(day => day.date === plan.start)
      const rowPlanEndIdx = row.findIndex(day => day.date === plan.end)
      const rowHasPlanStart = rowPlanStartIdx !== -1
      const rowHasPlanEnd = rowPlanEndIdx !== -1
      const active = plan.id === activePlanId.value
      const style = {
        backgroundColor: active ? plan.color : plan.color + '8c',
        left: `${rowHasPlanStart ? rowPlanStartIdx / weeks.length * 100 : 0}%`,
        right: `${rowHasPlanEnd ? (weeks.length - 1 - rowPlanEndIdx) / weeks.length* 100 : 0}%`,
        bottom: `${plan.lane * 24}px`
      }
      return { id, plan, rowPlanStartIdx, rowPlanEndIdx, rowHasPlanStart, rowHasPlanEnd, style, active }
    })
    const active = rowPlans.some(rowPlan => rowPlan.id === menuRowPlanId.value)
    return { plans: rowPlans, days: row, active }
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

</script>

<template>
  <section flex="~ col">
    <WeekHeader />
    <div ref="container" grow-1 overflow-auto border rounded class="border-#dadce0 dark:border-#3a3e41">
      <div ref="prevLoader" class="h-0.1px" />
      <div v-for="row in dayRows" :key="row.days[0].id" grid grid-cols-7 relative :class="{'z-1': row.active }">
        <CalenderDay v-for="day in row.days" :key="day.id" :day="day" />
        <RowPlan v-for="rowPlan in row.plans" :key="rowPlan.plan.id" :rowPlan="rowPlan" />
      </div>
      <div ref="nextLoader" class="h-1px" />
    </div>
  </section>
</template>
