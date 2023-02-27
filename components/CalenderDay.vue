<script setup lang="ts">
import { useElementHover, useMousePressed } from '@vueuse/core';
import { format, max, min, getMonth } from 'date-fns';
import { ref, computed, watch } from 'vue';
import { Day, toggleMark, marks, editingPlanId, planner } from '~/composables/days';

const props = defineProps<{
  day: Day
}>()
const containerRef = ref<HTMLDivElement>()
const { pressed } = useMousePressed({ target: containerRef })
const hovered = useElementHover(containerRef)
const contexted = ref(false)
const isOddMonth = computed(() => getMonth(props.day.date) % 2 === 0)

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
    planner.update(editingPlanId.value, { start, end })
  }
})

function handleContextmenu() {
  contexted.value = true
  toggleMark(props.day.date)
}
</script>

<template>
  <div
    :id="String(day.id)"
    ref="containerRef"
    h-37 select-none leading-none text-4
    :class="['day', { 'day--peace': day.peace}]"
    @contextmenu.prevent="handleContextmenu">
    <div class="y-center">
      <div :class="[
        'mr-auto grow-0 whitespace-nowrap px-5px py-3px m-1',
        day.current ? 'text-light bg-yellow-5 rounded' : isOddMonth ? '' : 'text-red']">
        <span text-5>{{ format(day.date, 'd') }}</span>
        <span> /{{ format(day.date, 'L月') }}</span>
        <span v-if="day.tip">({{ day.tip }})</span>
      </div>
      <div v-if="marks.has(day.date)" i-carbon-star-filled text-yellow-5 mr-1 text-5 />
    </div>
  </div>
</template>

<style scoped>
.day {
  --border-color: #dadce0;
  --bg-color: #dadce065;
  box-shadow: inset -1px 0px 0px var(--border-color),
    inset 0px -1px 0px var(--border-color);
}
.dark .day {
  --border-color: #3a3e41;
  --bg-color: #3a3e4165;
}
.day:nth-of-type(7n) {
  box-shadow: inset 0px -1px 0px var(--border-color);
}
.day--peace {
  background-image: radial-gradient(var(--border-color) 15%, transparent 15%), radial-gradient(var(--border-color) 15%, transparent 25%);
  background-position: 0px 0px, 8px 8px;
  background-size: 16px 16px;
  /* background-color: var(--bg-color); */
}
</style>
