<script setup lang="ts">
import '@unocss/reset/tailwind.css'
import 'uno.css'
</script>

<template>
  <div class="font-sans text-gray bg-#181a1b min-h-100vh">
    <NuxtPage />
  </div>
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
