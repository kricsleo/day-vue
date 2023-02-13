<script setup lang="ts">
import { Plan, editingPlanId } from '~~/composables/days';

const props = defineProps<{plan: Plan}>()
</script>

<template>
  <button 
    title="adjust" 
    :class="['i-carbon:drag-horizontal ml-auto shrink-0 transition-all', {'translate-x-100%': activePlanId !== props.plan.id}]" 
    @mousedown="editingPlanId = props.plan.id" />
</template>
