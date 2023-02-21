<script setup lang="ts">

</script>

<template>
  <section class="py-2 grid grid-cols-7 justify-items-center">
    <h5 
      v-for="week in weeks" 
      :key="week.name"
      :class="{'op-60': week.peace}">
      {{week.name}}
    </h5>
  </section>
</template>
