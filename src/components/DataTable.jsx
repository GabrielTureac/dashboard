import React, { useMemo, useState } from 'react'

export default function DataTable({ movies = [], onSelectMovie }) {
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState({ key: 'Title', dir: 'asc' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    let list = movies
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(
        m =>
          (m.Title || '').toLowerCase().includes(q) ||
          (m.Year || '').includes(q) ||
          (m.Genre || '').toLowerCase().includes(q) || 
          (m.Runtime || '').toLowerCase().includes(q)
      )
    }
    if (sortBy) {
      list = [...list].sort((a, b) => {
        const av = a[sortBy.key] ?? ''
        const bv = b[sortBy.key] ?? ''
        if (av === bv) return 0
        return sortBy.dir === 'asc' ? (av > bv ? 1 : -1) : av > bv ? -1 : 1
      })
    }
    return list
  }, [movies, query, sortBy])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

  function toggleSort(key) {
    setSortBy(prev => {
      if (prev.key === key) return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      return { key, dir: 'asc' }
    })
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <input
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setPage(1)
          }}
          placeholder="Buscar título, año o género..."
          className="p-2 rounded w-64 bg-gray-100 dark:bg-gray-700"
        />
      </div>

      <div className="overflow-auto rounded shadow-sm border bg-white dark:bg-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-2 text-left">Poster</th>
              <th
                className="p-2 text-left cursor-pointer"
                onClick={() => toggleSort('Title')}
              >
                Título {sortBy.key === 'Title' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th
                className="p-2 text-left cursor-pointer"
                onClick={() => toggleSort('Year')}
              >
                Estreno {sortBy.key === 'Year' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th
                className="p-2 text-left cursor-pointer"
                onClick={() => toggleSort('Genre')}
              >
                Género {sortBy.key === 'Genre' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th
                className="p-2 text-left cursor-pointer"
                onClick={() => toggleSort('Runtime')}
              >
                Duración {sortBy.key === 'Runtime' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {paged.map(m => (
              <tr
                key={m.imdbID}
                className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => onSelectMovie(m)}
              >
                <td className="p-2 w-20">
                  {m.poster_full ? (
                    <img
                      src={m.poster_full}
                      alt="poster"
                      className="w-12 h-18 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-18 bg-gray-200 rounded" />
                  )}
                </td>
                <td className="p-2">{m.Title}</td>
                <td className="p-2">{m.Year || '—'}</td>
                <td className="p-2">{m.Genre || '—'}</td>
                <td className="p-2">{m.Runtime || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-gray-500">
          Mostrando {start + 1} - {Math.min(start + pageSize, total)} de {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-2 py-1 border rounded disabled:opacity-50"
            disabled={page === 1}
          >
            Anterior
          </button>
          <div className="px-3 text-sm">
            {page} / {totalPages}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-2 py-1 border rounded"
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}
