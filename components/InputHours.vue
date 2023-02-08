<script setup lang="ts">
defineProps<{
  modelValue: number
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', v: number): void
}>()
</script>

<template>
  <div class="grid grid-cols-[36px_36px_36px] text-3xl" title="working hours per day">
    <button 
      :disabled="modelValue <= 4"
      @click="emits('update:modelValue', modelValue - 1)" 
      :class="['i-carbon:caret-left', {'text-gray': modelValue <= 4}]" />
    <div class="flex flex-wrap overflow-hidden text-red">
      <span :style="{marginLeft: `-${modelValue - 4}00%`}" class="shrink-0 i-carbon-number-4" />
      <span class="shrink-0 i-carbon-number-5" />
      <span class="shrink-0 i-carbon-number-6" />
      <span class="shrink-0 i-carbon-number-7" />
      <span class="shrink-0 i-carbon-number-8" />
    </div>
    <button 
      :disabled="modelValue >= 8"
      @click="emits('update:modelValue', modelValue + 1)"
      :class="['i-carbon:caret-right', {'text-gray': modelValue >= 8}]" />
  </div>
</template>
