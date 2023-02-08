<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { observerManager } from '@kricsleo/observer'
import { weeks, focusToday, daysRef } from '~/composables/days';
import CalenderDay from './CalenderDay.vue'

const prevLoader = ref<HTMLElement>()
const nextLoader = ref<HTMLElement>()
const container = ref<HTMLElement>()

onMounted(() => focusToday())

onMounted(() => {
  observerManager.registerObserver('loader', {
    root: container.value,
  });
  observerManager.observe('loader', prevLoader.value!, () => {
    daysRef.dayManager.addPrevDays()
    // scroll down a litte so that prev loader can be triggerred again
    container.value!.scrollTop = 0.5
  })
  observerManager.observe('loader', nextLoader.value!, () => daysRef.dayManager.addNextDays())
  return () => observerManager.deleteObserver('loader')
})
</script>

<template>
  <section>
    <div class="py-2 grid grid-cols-7 justify-items-center">
      <h5 
        v-for="week in weeks" 
        :key="week.name"
        :class="{'op-60': week.peace}">
        {{week.name}}
      </h5>
    </div>
    <div ref="container" class="h-75vh overflow-auto border rounded">
      <div ref="prevLoader" class="h-0.1px" />
      <div class="grid grid-cols-7">
        <CalenderDay
          v-for="day in daysRef.dayManager.days"
          :key="day.id"
          :day="day"
          class="day" />
      </div>
      <div ref="nextLoader" class="h-0.1px" />
    </div>
  </section>
</template>

<style scoped>
.day {
  box-shadow: inset -1px 0px 0px #3a3e41,
    inset 0px -1px 0px #3a3e41;
}
.day:nth-of-type(7n) {
  border-right: none;
  box-shadow: inset 0px -1px 0px #3a3e41;
}
</style>
