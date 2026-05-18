import React from 'react'

const COLORS = [
  'bg-orange-950/70 text-orange-300 border-orange-800/60',
  'bg-amber-950/70 text-amber-300 border-amber-800/60',
  'bg-lime-950/70 text-lime-300 border-lime-800/60',
  'bg-teal-950/70 text-teal-300 border-teal-800/60',
  'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
  'bg-rose-950/70 text-rose-300 border-rose-800/60',
]

function colorFor(tag) {
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

export default function TagBadge({ tag, onClick, selected }) {
  return (
    <span
      onClick={onClick}
      className={[
        'inline-block px-2 py-0.5 rounded text-[11px] border font-mono font-medium',
        colorFor(tag),
        onClick ? 'cursor-pointer hover:opacity-70 transition-opacity' : '',
        selected ? 'ring-1 ring-orange-400/50' : '',
      ].join(' ')}
    >
      #{tag}
    </span>
  )
}
