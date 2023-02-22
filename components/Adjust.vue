<script setup lang="ts">
import { useMousePressed } from '@vueuse/core';
import { Plan, editingPlanId } from '~~/composables/days';

const props = defineProps<{plan: Plan}>()
const wrapperRef = ref<HTMLButtonElement>()
const { pressed } = useMousePressed({ target: wrapperRef })

watch(pressed, () => {
  console.log('pressed.value', pressed.value)
  pressed.value 
    ? editingPlanId.value = props.plan.id
    : editingPlanId.value = null
})
</script>

<template>
  <button 
    ref="wrapperRef" 
    w-2 bg-red center
    pointer-events-auto cursor-col-resize>
    <!-- <div title="adjust" i-carbon:drag-horizontal /> -->
  </button>
</template>
