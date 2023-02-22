<script setup lang="ts">
import { useMousePressed } from '@vueuse/core';
import { ref, watch } from 'vue';
import { Plan, editingPlanId } from '~/composables/days';

const props = defineProps<{
  plan: Plan
  isStart: boolean
}>()
const wrapperRef = ref<HTMLButtonElement>()
const { pressed } = useMousePressed({ target: wrapperRef })

watch(pressed, () => {
  console.log('pressed.value', pressed.value)
  if(pressed.value) {
    props.plan.entry = props.isStart ? props.plan.end : props.plan.start
    editingPlanId.value = props.plan.id
  } else {
    editingPlanId.value = null
  }
})
</script>

<template>
  <button 
    ref="wrapperRef"
    h-full w-1 expand-click-10
    pointer-events-auto cursor-col-resize />
</template>
