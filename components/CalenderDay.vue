<script setup lang="ts">
import { Day, toggleMark, marks, highlightPlanId, editingPlanId } from '~/composables/days';
import { format, getMonth, isSameDay, isWithinInterval, max, min } from 'date-fns'
import { computed, watch } from 'vue';
import { useElementHover, useMousePressed } from '@vueuse/core';

const props = defineProps<{
  day: Day
}>()

const containerRef = ref<HTMLDivElement>()
const { pressed } = useMousePressed({ target: containerRef })
const hovered = useElementHover(containerRef)
const contexted = ref(false)
const isOddMonth = computed(() => getMonth(props.day.date) % 2 === 0)
const currentDayPlans = computed(() => {
  const includedPlans = planner.plans.value.filter(
    plan => isWithinInterval(props.day.date, { start: plan.start, end: plan.end })
  )
  const formattedPlans = includedPlans.map(plan => ({
    ...plan,
    isStart: isSameDay(props.day.date, plan.start),
    isEnd: isSameDay(props.day.date, plan.end),
  }))
  const maxLane = formattedPlans.reduce((lane, plan) => Math.max(lane, plan.lane), -1)
  const filledPlans = Array.from(
    {length: maxLane + 1}, (_, lane) => formattedPlans.find(plan => plan.lane === lane) || {id: null, lane}
    ).sort((a, b) => b.lane - a.lane)
  return filledPlans;
})

watch(pressed, () => {
  // conflicts with "contextmenu", setTimeout to make it triggerred later
  setTimeout(() => {
    if(pressed.value && !contexted.value) {
      const newPlanId = planner.add(props.day.date, props.day.date, props.day.date)
      editingPlanId.value = newPlanId
    } else {
      contexted.value = false
      editingPlanId.value = null
    }
  })
})
watch(hovered, () => {
  if(!hovered.value || !editingPlanId.value) {
    return
  }
  const editingPlan = planner.get(editingPlanId.value)
  if(editingPlan) {
    const start = min([props.day.date, editingPlan.entry]).valueOf()
    const end = max([props.day.date, editingPlan.entry]).valueOf()
    planner.delete(editingPlanId.value)
    const newPlanId = planner.add(start, end, editingPlan.entry)
    editingPlanId.value = newPlanId
  }
})

function contextmenu() {
  contexted.value = true
  toggleMark(props.day.date)
}
</script>

<template>
  <div
    ref="containerRef"
    :id="String(day.id)"
    :class="['flex flex-col h-33 cursor-pointer select-none leading-none', { 'peace': day.peace, }]"
    @contextmenu.prevent="contextmenu">

    <div class="y-center">
      <div :class="[
        'mr-auto grow-0 whitespace-nowrap p-2px m-1',
        {'border rounded border-yellow': day.current}, 
        day.current ? 'text-yellow-5' : isOddMonth ? 'text-rose' : 'text-emerald-5']">
        <span class="text-5">{{ format(day.date, 'd') }}</span>
        <span class="text-2"> /{{ format(day.date, 'L月') }}</span>
        <span v-if="day.tip" class="text-2">({{ day.tip }})</span>
      </div>
      <div v-if="marks.has(day.date)" class="i-carbon-star-filled text-yellow-5 mr-1" />
    </div>

    <div class="mt-auto" />
    <template v-for="plan in currentDayPlans" :key="plan.id">
      <div v-if="plan.id" :class="[
        'mb-1 h-5 shrink-0 whitespace-nowrap overflow-hidden text-light duration-100 y-center', {
          'rounded-l': plan.isStart,
          'rounded-r mr-2': plan.isEnd,
        }, plan.id === highlightPlanId ? 'op-100 scale-108 origin-left' : 'op-80' ]" 
        :style="{backgroundColor: plan.color}"
        @mousedown.stop="() => null"
        @mouseover="highlightPlanId = plan.id"
        @mouseleave="highlightPlanId = null">
        <template v-if="plan.isStart">
          <button title="delete" class="shrink-0 self-stretch bg-red" @mousedown.stop="planner.delete(plan.id)">
            <div class="i-carbon:close" />
          </button>
          <div class="text-sm px-1px font-mono y-center">
            <div class="i-carbon:timer" />
            {{ plan.workDays }}d({{ plan.workHours }}h)
          </div>
        </template>
      </div>
      <div v-else class="mb-1 h-5 pointer-events-none" />
    </template>

  </div>
</template>

<style scoped>
.peace {
  background-image: radial-gradient(#3a3e41 15%, transparent 15%), radial-gradient(#3a3e41 15%, transparent 15%);
  background-position: 0px 0px, 8px 8px;
  background-size: 16px 16px;
}
</style>
