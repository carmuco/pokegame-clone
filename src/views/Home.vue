<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchPokemonList, fetchPokemonDetails, getSpriteCandidates } from '@/api/pokeapi.js'

const q = ref('')          
const loading = ref(false) 
const error = ref('')    
const items = ref([])      

/* Paginación */
const limit = 20          
const offset = ref(0)       
const total = ref(0)       
const page = computed(() => Math.floor(offset.value / limit) + 1)
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / limit)))

/* Helpers */
function getIdFromUrl(url) {
  const parts = url.split('/').filter(Boolean)
  return Number(parts[parts.length - 1])
}
function formatId(n) { return `#${String(n).padStart(3, '0')}` }

/* Carga de datos */
async function loadPage(newOffset = 0) {
  loading.value = true; error.value = ''
  try {
    const data = await fetchPokemonList(limit, newOffset)
    total.value = data.count
    items.value = data.results.map(r => ({ id: getIdFromUrl(r.url), name: r.name }))
    offset.value = newOffset
  } catch (e) {
    error.value = e.message || 'Error cargando Pokémon'
    items.value = []
  } finally {
    loading.value = false
  }
}

async function onSearch() {
  const term = q.value.trim().toLowerCase()
  if (!term) return loadPage(0)
  loading.value = true; error.value = ''
  try {
    const data = await fetchPokemonDetails(term)
    items.value = [{ id: data.id, name: data.name }]
    total.value = 1; offset.value = 0
  } catch (e) {
    error.value = 'No se encontró el Pokémon'
    items.value = []; total.value = 0
  } finally {
    loading.value = false
  }
}

/* Navegación */
function nextPage(){ if (page.value < pageCount.value) loadPage(offset.value + limit) }
function prevPage(){ if (offset.value - limit >= 0) loadPage(offset.value - limit) }

/* Montaje inicial */
onMounted(() => loadPage(0))
</script>

<template>
  <div class="container container-narrow my-4 bg-glass p-3 p-md-4">
    <h1 class="title-pokemon text-center">Pokegame Clone</h1>
    <!-- Buscador -->
    <form @submit.prevent="onSearch" class="row g-2 mb-3">
      <div class="col-12 col-md-8">
        <input
          v-model="q"
          type="text"
          class="form-control"
          placeholder="Buscar por nombre o ID… (ej: pikachu o 25)"
          aria-label="Buscar Pokémon por nombre o ID"
        />
      </div>
      <div class="col-6 col-md-2 d-grid">
        <button class="btn-poke" type="submit">Buscar</button>
      </div>
      <div class="col-6 col-md-2 d-grid">
        <button class="btn-poke-outline" type="button" @click="q=''; loadPage(0)">Limpiar</button>
      </div>
    </form>

    <!-- Mensajes de estado -->
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="loading" class="d-flex justify-content-center my-4">
      <div class="spinner-border" role="status" aria-label="Cargando"></div>
    </div>

    <!-- Grid de cards -->
    <div v-if="!loading && !error" class="row g-3">
      <div v-for="p in items" :key="p.id" class="col-6 col-sm-4 col-md-3 col-lg-2">
        <div class="card card-poke card-poke--primary h-100 text-center">
          <div class="card-body">
            <!-- Imagen-->
            <img
              :src="getSpriteCandidates(p.id)[0]"
              :alt="p.name"
              class="img-fluid mb-2"
              style="max-height: 120px; object-fit: contain;"
              loading="lazy"
              @error="(e)=>{ const c = getSpriteCandidates(p.id); if (e.target.src !== c[1]) e.target.src = c[1] }"
            />
            <h6 class="card-subtitle mb-1 text-muted">{{ formatId(p.id) }}</h6>
            <h5 class="card-title text-capitalize mb-2">{{ p.name }}</h5>

            <!-- Botón para ir al detalle -->
            <RouterLink :to="{ name: 'pokemon', params: { id: p.id } }" class="btn-poke-secondary btn-block btn-poke-sm">
              Ver tarjeta
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="!loading && total > 1" class="d-flex align-items-center justify-content-center gap-2 mt-4">
      <button class="btn-poke-outline" @click="prevPage" :disabled="page <= 1">◀ Anterior</button>
      <span class="text-secondary">Página {{ page }} / {{ pageCount }}</span>
      <button class="btn-poke-outline" @click="nextPage" :disabled="page >= pageCount">Siguiente ▶</button>
    </div>
  </div>
</template>
