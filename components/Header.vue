<script setup lang="ts">
import { toggleDark } from '~/composables/dark';
import { focusDay, hours } from '~/composables/days'
</script>

<template>
  <!-- <h1 text-center>Keep in mind: 996.icu</h1> -->
  <div class="y-center justify-center gap-3 p-3 text-xl">
    <button @click="focusToday" class="i-carbon:location-heart-filled" />
    <InputHours v-model="hours" />
    <button @click="toggleDark()" class="dark:i-carbon-moon i-carbon-sun" />
    <a
      class="i-carbon-logo-github"
      rel="noreferrer"
      href="https://github.com/kricsleo/days"
      target="_blank"
      title="GitHub"
    />
  </div>
</template>
