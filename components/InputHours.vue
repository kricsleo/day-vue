<script setup lang="ts">
import { computed } from 'vue';

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
  <div flex="~ col" items-center text-2xl>
    <button
      i-carbon:caret-up
      :disabled="hourIdx <= 0"
      @click="emits('update:modelValue', hourList[hourIdx - 1])" 
      :class="{'op-50': hourIdx <= 0}" />
    <div flex="~ col" wh-1em whitespace-nowrap overflow-hidden>
      <span v-for="(hour, idx) in hourList" center shrink-0 transition leading-none :style="{marginTop: idx === 0 && hourIdx ? `-${hourIdx}00%` : undefined}">{{ hour }}</span>
    </div>
    <span text-sm mt-0.5>h/d</span>
    <button 
      i-carbon:caret-down
      :disabled="hourIdx >= hourList.length - 1"
      @click="emits('update:modelValue', hourList[hourIdx + 1])"
      :class="{'op-50': hourIdx >= hourList.length - 1}" />
  </div>
</template>
