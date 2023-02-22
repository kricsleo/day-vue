<script setup lang="ts">
import InputHours from './InputHours.vue'
import { toggleDark } from '~/composables/dark';
import { focusToday, hours, planner } from '~/composables/days'
</script>

<template>
  <!-- <h1 text-center>Keep in mind: 996.icu</h1> -->
  <div flex="~ col" gap-5 center text-2xl>
    <button @click="focusToday" class="i-carbon:location-heart-filled" />
    <InputHours v-model="hours" />
    <button i-carbon:clean @click="planner.clean" />
    <button @click="toggleDark()" class="dark:i-carbon-moon i-carbon-sun" />
    <a
      class="i-carbon-logo-github"
      rel="noreferrer"
      href="https://github.com/kricsleo/day"
      target="_blank"
      title="GitHub"
    />
  </div>
</template>
