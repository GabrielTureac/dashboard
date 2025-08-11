import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function MovieDetails({ movie }) {
  const [details, setDetails] = useState(null)

  useEffect(() => {
    let mounted = true
    async function fetchDetails() {
      if (!movie) {
        setDetails(null)
        return
      }
      try {
        const key = import.meta.env.VITE_OMDB_API_KEY
        const res = await axios.get('https://www.omdbapi.com/', {
          params: { apikey: key, i: movie.imdbID, plot: 'short' }
        })
        if (!mounted) return
        if (res.data.Response === "True") setDetails(res.data)
        else setDetails(null)
      } catch {
        setDetails(null)
      }
    }
    fetchDetails()
    return () => { mounted = false }
  }, [movie])

  if (!movie) return null
  if (!details) return <div>Cargando detalles...</div>

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="font-semibold mb-2">{details.Title} ({details.Year})</h3>
      <p><strong>Fecha de estreno:</strong> {details.Released}</p>
      <p><strong>Género:</strong> {details.Genre}</p>
      <p><strong>Duración:</strong> {details.Runtime}</p>
    </div>
  )
}
