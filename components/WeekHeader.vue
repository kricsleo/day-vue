<script setup lang="ts">

</script>

<template>
  <section class="py-2 grid grid-cols-7 justify-items-center op-75">
    <h5 v-for="week in weeks" :key="week.name">
      {{week.name}}
    </h5>
  </section>
</template>
