import React from 'react'

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 font-mono text-sm select-none">
        /
      </span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'ara...'}
        className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-8 pr-10 py-3 text-stone-200 placeholder-stone-600 text-sm font-mono focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-300 transition-colors text-xl leading-none"
        >
          ×
        </button>
      )}
    </div>
  )
}
