import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Charts({ selectedMovie, movies }) {
  if (selectedMovie) {
    const ratingData = selectedMovie.Ratings.map(r => {
      let value = r.Value
      if (value.includes('/')) {
        const [num, denom] = value.split('/').map(x => parseFloat(x))
        return { name: r.Source, value: (num / denom) * 10 }
      } else if (value.includes('%')) {
        return { name: r.Source, value: parseFloat(value) / 10 }
      }
      return { name: r.Source, value: 0 }
    })

    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h3 className="font-semibold mb-2">{selectedMovie.Title} — Rating (1-10)</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={ratingData} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 10]} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#7c34f0ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }
}
