<script setup>
import pokeball from '@/assets/pokeball.svg'
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom">
    <div class="container container-narrow">
      <a class="navbar-brand d-flex align-items-center gap-2" href="#/">
        <img :src="pokeball" alt="Pokéball" width="28" height="28" />
        <span class="fw-bold">Pokegame <span class="text-primary">Clone</span></span>
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navPoke" aria-controls="navPoke" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="navPoke" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="#/">Inicio</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
