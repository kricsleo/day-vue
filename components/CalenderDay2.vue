<script setup lang="ts">
import { format } from 'date-fns';
import { Day, toggleMark, marks, highlightPlanId, editingPlanId } from '~/composables/days';

const props = defineProps<{
  day: Day
}>()
</script>

<template>
  <div h-37 cursor-pointer select-none leading-none class="day">
    <span class="text-5">{{ format(day.date, 'd') }}</span>
    <span class="text-3"> /{{ format(day.date, 'L月') }}</span>
  </div>
</template>

<style scoped>
.day {
  --border-color: #dadce0;
  box-shadow: inset -1px 0px 0px var(--border-color),
    inset 0px -1px 0px var(--border-color);
}
.dark .day {
  --border-color: #3a3e41;
}
.day:nth-of-type(7n) {
  box-shadow: inset 0px -1px 0px var(--border-color);
}
.day--peace {
  background-image: radial-gradient(var(--border-color) 15%, transparent 15%), radial-gradient(var(--border-color) 15%, transparent 15%);
  background-position: 0px 0px, 8px 8px;
  background-size: 16px 16px;
  /* background-color: #3a3e4165; */
}
</style>
