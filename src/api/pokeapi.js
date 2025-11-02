// Base de la API oficial de Pokémon.
const API_BASE = 'https://pokeapi.co/api/v2/'

async function requestJSON(url, opts = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), opts.timeout ?? 12000)
  try {
    const res = await fetch(url, { signal: controller.signal, ...opts })
    if (!res.ok) {

        // no se encontro la solicitud
      if (res.status === 404) throw new Error('Ups, quien es ese Pokémon? No se encontró.')

        //muchas solicitudes en poco tiempo
      if (res.status === 429) throw new Error('Pikachu está recibiendo una sobrecarga. Intenta de nuevo más tarde.')
      throw new Error(`Error HTTP ${res.status}`)
    }
    return await res.json()
  } catch (err) {

    // tardo mucho la solicitud
    if (err.name === 'AbortError') {
      throw new Error('ups, el snorlax se durmió... la solicitud tardó demasiado.')
    }

    // fallo la red
    throw new Error(err?.message || 'Tu equipo se perdió en el camino. Intenta de nuevo.')
  } finally {
    clearTimeout(timeout)
  }
}

// ENDPOINTS PRINCIPALES

// Lista paginada de Pokémon
export async function fetchPokemonList(limit = 20, offset = 0) {
  const url = `${API_BASE}pokemon?limit=${limit}&offset=${offset}`
  return requestJSON(url)
}

// Detalle por id o nombre 
export async function fetchPokemonDetails(idOrName) {
  const url = `${API_BASE}pokemon/${idOrName}`
  return requestJSON(url)
}

// Especie 
export async function fetchPokemonSpecies(idOrName) {
  const url = `${API_BASE}pokemon-species/${idOrName}`
  return requestJSON(url)
}

// Cadena de evolución 
export async function fetchEvolutionChain(url) {
  return requestJSON(url)
}

// Habilidades 
export async function fetchAbilityDetails(idOrName) {
  const url = `${API_BASE}ability/${idOrName}`
  return requestJSON(url)
}

// Tipos 
export async function fetchTypeDetails(idOrName) {
  const url = `${API_BASE}type/${idOrName}`
  return requestJSON(url)
}

// Movimientos 
export async function fetchMoveDetails(idOrName) {
  const url = `${API_BASE}move/${idOrName}`
  return requestJSON(url)
}

// Objetos 
export async function fetchItemDetails(idOrName) {
  const url = `${API_BASE}item/${idOrName}`
  return requestJSON(url)
}

// Ubicaciones 
export async function fetchLocationDetails(idOrName) {
  const url = `${API_BASE}location/${idOrName}`
  return requestJSON(url)
}

// Regiones 
export async function fetchRegionDetails(idOrName) {
  const url = `${API_BASE}region/${idOrName}`
  return requestJSON(url)
}

// Generaciones 
export async function fetchGenerationDetails(idOrName) {
  const url = `${API_BASE}generation/${idOrName}`
  return requestJSON(url)
}

// Métodos de encuentro 
export async function fetchEncounterDetails(idOrName) {
  const url = `${API_BASE}encounter-method/${idOrName}`
  return requestJSON(url)
}

// Stats 
export async function fetchStatDetails(idOrName) {
  const url = `${API_BASE}stat/${idOrName}`
  return requestJSON(url)
}


//IMÁGENES


// Dream World 
export function dreamWorldSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`
}

// Official Artwork 
export function officialArtworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

//arreglo con posibles imágenes 
export function getSpriteCandidates(id) {
  return [dreamWorldSpriteUrl(id), officialArtworkUrl(id)]
}


// UTILIDADE
// Extrae IDs de la evolución 
export function extractEvolutionIds(chainNode, acc = []) {
  if (!chainNode) return acc
  const parts = chainNode.species.url.split('/').filter(Boolean)
  const speciesId = Number(parts[parts.length - 1])
  acc.push(speciesId)
  if (Array.isArray(chainNode.evolves_to)) {
    for (const next of chainNode.evolves_to) {
      extractEvolutionIds(next, acc)
    }
  }
  return acc
}


//"TODO EN UNO"

export async function getPokemonFull(idOrName) {
  const [details, species] = await Promise.all([
    fetchPokemonDetails(idOrName),
    fetchPokemonSpecies(idOrName),
  ])

  const evolutionChainUrl = species?.evolution_chain?.url
  let evolutionChain = null
  let evolutionIds = []

  if (evolutionChainUrl) {
    evolutionChain = await fetchEvolutionChain(evolutionChainUrl)
    evolutionIds = extractEvolutionIds(evolutionChain?.chain)
  }

  return {
    details,        
    species,        
    evolutionChain, 
    evolutionIds,   
  }
}
