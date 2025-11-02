<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <Navbar />
  <RouterView />
  <footer class="border-top py-3 mt-4">
    <div class="container container-narrow d-flex justify-content-between align-items-center footer-mini">
      <span>Datos por <a href="https://pokeapi.co/" target="_blank">PokeAPI</a></span>
      <span>Como buscaba nuestro heroe Ash <em>“¡Atrápalos a todos!”</em> 😉</span>
    </div>
  </footer>
</template>
