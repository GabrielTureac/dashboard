import React, { useEffect, useState } from 'react'
import useMovies from './hooks/useMovies'
import useConfig from './hooks/useConfig'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import DataTable from './components/DataTable'
import Charts from './components/Charts'
import MovieDetails from './components/MovieDetails'
import { downloadCSV } from './utils/csv'

export default function App() {
  const [query, setQuery] = useState('Batman')
  const [pageSize, setPageSize] = useState(10)
  const { data, loading } = useMovies({ query })
  const { config } = useConfig()
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [dark, setDark] = useState(() => !!localStorage.getItem('dark'))

  const [filters, setFilters] = useState({
    year: '',
    genre: '',
    type: '',
  })

  const [moviesWithDetails, setMoviesWithDetails] = useState([])

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem('dark', dark ? '1' : '')
  }, [dark])

  useEffect(() => {
    async function enrichMovies() {
      if (!data?.Search) {
        setMoviesWithDetails([])
        return
      }

      const basicMovies = data.Search.map(m => ({
        ...m,
        poster_full: m.Poster && m.Poster !== 'N/A' ? m.Poster : null,
      }))

      const apiKey = import.meta.env.VITE_OMDB_API_KEY

      const moviesWithExtra = await Promise.all(
        basicMovies.map(async m => {
          try {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${m.imdbID}`)
            const details = await res.json()
            return {
              ...m,
              Genre: details.Genre || '—',
              Runtime: details.Runtime || '—',
              Ratings: details.Ratings || [],
            }
          } catch {
            return { ...m, Genre: '—', Runtime: '—' }
          }
        })
      )

      setMoviesWithDetails(moviesWithExtra)
    }

    enrichMovies()
  }, [data])

  const filteredMovies = moviesWithDetails.filter(m => {
    if (filters.year && !m.Year.includes(filters.year)) return false
    if (filters.genre && !(m.Genre || '').toLowerCase().includes(filters.genre.toLowerCase())) return false
    if (filters.type && filters.type !== '' && m.Type !== filters.type) return false
    return true
  })

  const pagedMovies = filteredMovies.slice(0, pageSize)

  function handleExport() {
    const rows = filteredMovies.map(m => ({
      id: m.imdbID,
      title: m.Title,
      year: m.Year,
      genre: m.Genre,
      runtime: m.Runtime,
      type: m.Type,
      poster: m.Poster,
    }))
    downloadCSV('movies.csv', rows)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleDark={() => setDark(d => !d)} dark={dark} />

      <div className="flex flex-1">
        <Sidebar pageSize={pageSize} setPageSize={setPageSize} filters={filters} setFilters={setFilters} />

        <main className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Películas</h2>
              <p className="text-sm text-gray-500">Busca por título.</p><br />
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); setSelectedMovie(null) }}
                placeholder="Buscar películas..."
                className="p-2 rounded w-64 bg-gray-100 dark:bg-gray-700"
              />
              <button onClick={handleExport} className="px-3 py-1 border rounded" style={{ marginLeft: '1rem' }}>
                Exportar Excel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              {loading ? (
                <div className="p-6 bg-white/60 dark:bg-gray-800/60 rounded text-center">Cargando...</div>
              ) : (
                <DataTable movies={pagedMovies} onSelectMovie={m => setSelectedMovie(m)} />
              )}
            </div>

            <div className="space-y-4">
              <Charts selectedMovie={selectedMovie} movies={moviesWithDetails} />
              <MovieDetails movie={selectedMovie} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
