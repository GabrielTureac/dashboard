export function downloadCSV(filename = 'data.csv', rows = []) {
  if (!rows || !rows.length) return
  const keys = Object.keys(rows[0])
  const lines = [keys.join(',')]
  for (const row of rows) {
    const vals = keys.map(k => {
      const v = row[k]
      if (v === null || v === undefined) return ''
      return `"${String(v).replace(/"/g, '""')}"`
    })
    lines.push(vals.join(','))
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
