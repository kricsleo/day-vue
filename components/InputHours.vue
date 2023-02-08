<script setup lang="ts">
const props = defineProps<{
  modelValue: number
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', v: number): void
}>()
const hourList = [4, 5, 6, 7, 8]
const hourIdx = computed(() => hourList.indexOf(props.modelValue) || 0)
</script>

<template>
  <div class="y-center font-mono">
    <button 
      :disabled="hourIdx <= 0"
      @click="emits('update:modelValue', hourList[hourIdx - 1])" 
      :class="['i-carbon:caret-left text-xl', {'op-50': hourIdx <= 0}]" />
    <div class="flex w-1em whitespace-nowrap overflow-hidden">
      <span v-for="(hour, idx) in hourList" class="w-1em shrink-0 transition-margin" :style="idx === 0 &&hourIdx ? {marginLeft: `-${hourIdx}00%`} : {}">{{ hour }}</span>
    </div>
    <span class="text-sm mt-0.5">h/d</span>
    <button 
      :disabled="hourIdx >= hourList.length - 1"
      @click="emits('update:modelValue', hourList[hourIdx + 1])"
      :class="['i-carbon:caret-right text-xl', {'op-50': hourIdx >= hourList.length - 1}]" />
  </div>
</template>
