<script setup lang="ts">
import '@unocss/reset/tailwind.css'
import 'uno.css'
</script>

<template>
  <div class="min-h-100vh font-mono text-gray dark:bg-#181a1b">
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
