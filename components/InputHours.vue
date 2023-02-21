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
  <div flex="~ col" items-center>
    <button
      i-carbon:caret-up text-2xl
      :disabled="hourIdx <= 0"
      @click="emits('update:modelValue', hourList[hourIdx - 1])" 
      :class="{'op-50': hourIdx <= 0}" />
    <div flex="~ col" wh-1em whitespace-nowrap overflow-hidden>
      <span v-for="(hour, idx) in hourList" center shrink-0 transition-margin leading-none :style="idx === 0 &&hourIdx ? {marginTop: `-${hourIdx}00%`} : {}">{{ hour }}</span>
    </div>
    <span class="text-sm mt-0.5">h/d</span>
    <button 
      :disabled="hourIdx >= hourList.length - 1"
      @click="emits('update:modelValue', hourList[hourIdx + 1])"
      :class="['i-carbon:caret-down text-2xl', {'op-50': hourIdx >= hourList.length - 1}]" />
  </div>
</template>
