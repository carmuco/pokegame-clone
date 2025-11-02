<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { getPokemonFull, getSpriteCandidates } from '@/api/pokeapi.js'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const data = ref(null) 

const title = computed(() => data.value ? `#${String(data.value.details.id).padStart(3,'0')} — ${data.value.details.name}` : 'Cargando…')

// flavor text en español
function flavorText(species) {
  const es = species?.flavor_text_entries?.find(e => e.language?.name === 'es')
  const en = species?.flavor_text_entries?.find(e => e.language?.name === 'en')
  const txt = (es?.flavor_text || en?.flavor_text || '').replace(/\f|\n/g, ' ')
  return txt
}

async function load(idOrName) {
  loading.value = true; error.value = ''; data.value = null
  try {
    const res = await getPokemonFull(idOrName)
    data.value = res
  } catch (e) {
    error.value = e.message || 'No se pudo cargar el Pokémon'
  } finally {
    loading.value = false
  }
}

onMounted(() => load(route.params.id))
watch(() => route.params.id, (v) => { if (v) load(v) })
</script>

<template>
  <div class="container container-narrow my-4">
    <div class="mb-3">
      <RouterLink to="/" class="btn btn-sm btn-outline-secondary">← Volver</RouterLink>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="loading" class="d-flex justify-content-center my-4">
      <div class="spinner-border" role="status" aria-label="Cargando"></div>
    </div>

    <div v-if="!loading && data" class="card card-poke">
      <div class="card-body">
        <div class="row g-4 align-items-center">
          <!-- Imagen -->
          <div class="col-12 col-md-4 text-center">
            <img
              :src="getSpriteCandidates(data.details.id)[0]"
              :alt="data.details.name"
              class="img-fluid"
              style="max-height: 220px; object-fit: contain;"
              @error="(e)=>{ const c = getSpriteCandidates(data.details.id); if (e.target.src !== c[1]) e.target.src = c[1] }"
            />
          </div>

          <!-- Información -->
          <div class="col-12 col-md-8">
            <h2 class="fw-bold text-capitalize mb-2">{{ title }}</h2>

            <!-- Tipos -->
            <div class="mb-2">
              <span v-for="t in data.details.types" :key="t.slot" class="badge bg-primary-subtle text-primary-emphasis me-1 badge-type">
                {{ t.type.name }}
              </span>
            </div>

            <!-- Flavor text -->
            <p class="text-secondary">{{ flavorText(data.species) }}</p>

            <!-- Stats -->
            <div class="table-responsive">
              <table class="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Stat</th>
                    <th>Base</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in data.details.stats" :key="s.stat.name">
                    <td class="text-capitalize">{{ s.stat.name }}</td>
                    <td>{{ s.base_stat }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Evolución -->
            <div v-if="data.evolutionIds?.length" class="mt-3">
              <h6 class="text-secondary">Línea evolutiva</h6>
              <div class="d-flex flex-wrap gap-3">
                <RouterLink
                  v-for="eid in data.evolutionIds"
                  :key="eid"
                  :to="{ name: 'pokemon', params: { id: eid }}"
                  class="text-decoration-none text-center"
                >
                  <img
                    :src="getSpriteCandidates(eid)[0]"
                    :alt="eid"
                    width="64" height="64"
                    style="object-fit:contain"
                    @error="(e)=>{ const c = getSpriteCandidates(eid); if (e.target.src !== c[1]) e.target.src = c[1] }"
                  />
                  <div class="small text-muted">#{{ String(eid).padStart(3,'0') }}</div>
                </RouterLink>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>
