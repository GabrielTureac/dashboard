import { useEffect, useState } from 'react'

export default function useConfig() {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('omdb_config')
    if (cached) setConfig(JSON.parse(cached))
    else {
      const fakeConfig = { source: 'OMDb no tiene configuración pública' }
      setConfig(fakeConfig)
      sessionStorage.setItem('omdb_config', JSON.stringify(fakeConfig))
    }
  }, [])

  return { config }
}
