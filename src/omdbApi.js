import seedMovies from './movies.json'

const API_URL = 'https://www.omdbapi.com/'

function parseRuntime(value, fallback) {
  return value && value !== 'N/A' ? value : fallback
}

function parseCast(value, fallback) {
  if (!value || value === 'N/A') return fallback
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function parseRating(value, fallback) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : fallback
}

function mapOmdbMovie(seed, data) {
  return {
    ...seed,
    title: data.Title && data.Title !== 'N/A' ? data.Title : seed.title,
    year: data.Year && data.Year !== 'N/A' ? Number.parseInt(data.Year, 10) || seed.year : seed.year,
    genre: data.Genre && data.Genre !== 'N/A' ? data.Genre.split(',')[0].trim() : seed.genre,
    director: data.Director && data.Director !== 'N/A' ? data.Director : seed.director,
    runtime: parseRuntime(data.Runtime, seed.runtime),
    cast: parseCast(data.Actors, seed.cast),
    synopsis: data.Plot && data.Plot !== 'N/A' ? data.Plot : seed.synopsis,
    averageRating: parseRating(data.imdbRating, seed.averageRating),
    imdbRating: data.imdbRating && data.imdbRating !== 'N/A' ? data.imdbRating : null,
    imdbID: data.imdbID && data.imdbID !== 'N/A' ? data.imdbID : null,
    omdbPoster: data.Poster && data.Poster !== 'N/A' ? data.Poster : null,
    // Keep the selected real poster used by the project; OMDb supplies the movie metadata.
    cover: seed.cover || (data.Poster && data.Poster !== 'N/A' ? data.Poster : ''),
    apiSource: 'OMDb'
  }
}

async function fetchMovieFromOmdb(seed, apiKey) {
  const params = new URLSearchParams({
    apikey: apiKey,
    t: seed.title,
    type: 'movie',
    plot: 'full'
  })

  const response = await fetch(`${API_URL}?${params.toString()}`)
  if (!response.ok) {
    throw new Error(`OMDb request failed with HTTP ${response.status}`)
  }

  const data = await response.json()

  if (data.Response === 'False') {
    throw new Error(data.Error || `OMDb could not find "${seed.title}"`)
  }

  return mapOmdbMovie(seed, data)
}

export async function loadMoviesFromOmdb() {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY

  if (!apiKey) {
    return {
      movies: seedMovies,
      connected: false,
      error: 'OMDb API key is missing. Add VITE_OMDB_API_KEY to your .env file.'
    }
  }

  const results = await Promise.all(
    seedMovies.map(async (seed) => {
      try {
        return await fetchMovieFromOmdb(seed, apiKey)
      } catch (error) {
        console.warn(`OMDb lookup failed for ${seed.title}:`, error.message)
        return {
          ...seed,
          apiSource: 'Local fallback',
          apiError: error.message
        }
      }
    })
  )

  const connectedCount = results.filter((movie) => movie.apiSource === 'OMDb').length

  return {
    movies: results,
    connected: connectedCount > 0,
    connectedCount,
    error: connectedCount === 0
      ? 'OMDb could not return any of the selected movies. The app is showing the local fallback data.'
      : null
  }
}
