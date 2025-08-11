import React from 'react'

export default function Sidebar({
  pageSize,
  setPageSize,
  filters,
  setFilters
}) {
  const { year = '', genre = '', type = '' } = filters

  function handleChange(e) {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  return (
    <aside className="w-64 p-4 border-r hidden md:block bg-white dark:bg-gray-800/50">
      <div className="mb-4">
        <h2 className="font-semibold">Controles</h2>
      </div>

      <div className="mb-4">
        <label className="text-sm">Año</label>
        <input
          type="text"
          name="year"
          value={year}
          onChange={handleChange}
          placeholder="Ej: 2005"
          className="w-full mt-1 p-2 rounded bg-gray-100 dark:bg-gray-700"
        />
      </div>

      <div className="mb-4">
        <label className="text-sm">Género</label>
        <select
          name="genre"
          value={genre}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded bg-gray-100 dark:bg-gray-700"
        >
          <option value="">Todos</option>
          <option value="Action">Acción</option>
          <option value="Comedy">Comedia</option>
          <option value="Drama">Drama</option>
          <option value="Horror">Terror</option>
          <option value="Romance">Romance</option>
          <option value="Sci-Fi">Ciencia ficción</option>
          <option value="Thriller">Thriller</option>
        </select>
      </div>


      <div className="mb-4">
        <label className="text-sm">Tipo</label>
        <select
          name="type"
          value={type}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded bg-gray-100 dark:bg-gray-700"
        >
          <option value="">Todos</option>
          <option value="movie">Película</option>
          <option value="series">Serie</option>
        </select>
      </div>
    </aside>
  )
}
