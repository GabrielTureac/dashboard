import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'https://www.omdbapi.com/'
const KEY = import.meta.env.VITE_OMDB_API_KEY

export default function useMovies({ query = '', page = 1, auto = true } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query) return
    let mounted = true
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(API, {
          params: { apikey: KEY, s: query, page }
        })
        if (!mounted) return
        setData(res.data)
      } catch (err) {
        if (!mounted) return
        setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (auto) fetchData()
    return () => { mounted = false }
  }, [query, page, auto])

  return { data, loading, error }
}
