<script setup lang="ts">
import Calender from '~/components/Calender.vue';
import Calender2 from '~/components/Calender2.vue';
import Header from '~/components/Header.vue';
</script>

<template>
  <div center gap-5 px-5 max-w-1200 mx-auto>
    <!-- <Calender /> -->
    <Calender2 class="grow-1" />
    <Header />
  </div>
</template>
