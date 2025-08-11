import React from 'react'

export default function Header({ onToggleDark, dark }) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 relative">
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
        <h1 className="text-lg font-bold">Dashboard de Películas</h1>
        <span className="text-sm text-gray-500 hidden sm:inline">(OMDb)</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="px-3 py-1 rounded-md border" onClick={onToggleDark}>{dark ? 'Light Mode' : 'Dark Mode'}</button>
      </div>
    </header>
  )
}
