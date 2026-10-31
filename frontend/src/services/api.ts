const API = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export async function getPopularMovies() {
  const response = await fetch(`${API}/api/movies/popular`)
  if (!response.ok) throw new Error('Could not load movies')
  return response.json()
}

export async function globalSearch(query: string) {
  const response = await fetch(`${API}/api/search/?q=${encodeURIComponent(query)}`)
  if (!response.ok) throw new Error('Search failed')
  return response.json()
}

export async function getSportsStatus() {
  const response = await fetch(`${API}/api/sports/live`)
  if (!response.ok) throw new Error('Could not load sports status')
  return response.json()
}
