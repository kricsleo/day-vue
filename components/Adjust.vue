<script setup lang="ts">
import { useMousePressed } from '@vueuse/core';
import { Plan, editingPlanId } from '~~/composables/days';

const props = defineProps<{plan: Plan}>()
const adjustRef = ref<HTMLButtonElement>()
const { pressed } = useMousePressed({ target: adjustRef })

// watch(pressed, () => {
//   setTimeout(() => {
//     if(pressed.value) {
//       // const newPlanId = planner.add(props.day.date, props.day.date, props.day.date)
//       // todo: set plan id
//       editingPlanId.value = props.plan.id
//     } else {
//       // contexted.value = false
//       editingPlanId.value = null
//     }
//   })
// })
</script>

<template>
  <button ref="adjustRef" title="adjust" class="i-carbon:fit-to-width ml-auto" @mousedown="editingPlanId = props.plan.id" />
</template>
