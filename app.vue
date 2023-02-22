<script setup lang="ts">
import Calender from '~/components/Calender.vue';
import OptPanel from '~/components/OptPanel.vue';
import '@unocss/reset/tailwind.css'
import 'uno.css'
</script>

<template>
  <main 
    h-screen font-mono text-gray dark:bg-dark-8
    center gap-2 px-5 pb-5>
    <Calender h-full grow-1 max-w-400 />
    <OptPanel />
  </main>
</template>

<style>
::-webkit-scrollbar,
::-webkit-scrollbar-thumb,
::-webkit-scrollbar-track {
  display: none;
}

::-webkit-scrollbar-corner {
  background-color: transparent;
}
</style>
