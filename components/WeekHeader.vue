<script setup lang="ts">
import { weeks } from '~~/composables/days';

</script>

<template>
  <section grid grid-cols-7 justify-items-center py-2 op-80>
    <h5 v-for="week in weeks" :key="week.name">
      {{week.name}}
    </h5>
  </section>
</template>
