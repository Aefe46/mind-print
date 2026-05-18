import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useMindPrint } from '../context'
import TagBadge from './TagBadge'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function calcWords(entry) {
  return [entry.problem, entry.decision, entry.alternatives, entry.resources]
    .filter(Boolean).join(' ').split(/\s+/).filter(w => w).length
}

export default function DecisionCard({ entry, onDelete, view }) {
  const navigate = useNavigate()
  const { toggleFavorite } = useMindPrint()

  const handleEdit = (e) => { e.stopPropagation(); navigate(`/edit/${entry.id}`) }
  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`"${entry.title}" silinsin mi?`)) onDelete(entry.id)
  }
  const handleFavorite = (e) => { e.stopPropagation(); toggleFavorite(entry.id) }

  const starBtn = (
    <button
      onClick={handleFavorite}
      title={entry.isFavorite ? 'Favoriden çıkar' : 'Favoriye ekle'}
      className={`w-6 h-6 rounded flex items-center justify-center transition-colors text-xs ${
        entry.isFavorite
          ? 'text-orange-400 hover:text-stone-500'
          : 'text-stone-700 hover:text-orange-400'
      }`}
    >
      {entry.isFavorite ? '★' : '☆'}
    </button>
  )

  const actions = (
    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      {starBtn}
      <button
        onClick={handleEdit}
        title="Düzenle"
        className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:text-orange-400 hover:bg-stone-800 transition-colors text-xs"
      >✏</button>
      <button
        onClick={handleDelete}
        title="Sil"
        className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:text-red-400 hover:bg-stone-800 transition-colors text-xs"
      >✕</button>
    </div>
  )

  if (view === 'list') {
    return (
      <div
        onClick={() => navigate(`/detail/${entry.id}`)}
        className="group relative bg-stone-900 border border-stone-800 rounded-xl overflow-hidden hover:border-orange-500/40 transition-all duration-200 cursor-pointer"
      >
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-transparent group-hover:bg-orange-500/70 transition-colors duration-300" />
        <div className="px-5 py-4 flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {entry.isFavorite && (
                <span className="text-orange-400 text-xs" title="Favori">★</span>
              )}
              <h3 className="text-stone-100 font-semibold text-sm leading-snug group-hover:text-orange-300 transition-colors truncate">
                {entry.title}
              </h3>
            </div>
            {entry.decision && (
              <p className="text-stone-600 text-xs font-mono truncate">{entry.decision}</p>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex flex-wrap gap-1 max-w-[200px] justify-end">
              {entry.tags.slice(0, 2).map(t => <TagBadge key={t} tag={t} />)}
            </div>
            <span className="font-mono text-stone-600 text-[10px] whitespace-nowrap">
              {formatDate(entry.createdAt)}
            </span>
            {actions}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => navigate(`/detail/${entry.id}`)}
      className="group relative bg-stone-900 border border-stone-800 rounded-xl overflow-hidden hover:border-orange-500/40 transition-all duration-200 cursor-pointer flex flex-col"
    >
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-transparent group-hover:bg-orange-500/70 transition-colors duration-300" />

      <div className="p-5 flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-stone-700 text-[10px] tracking-widest uppercase">
              #{entry.id.slice(-6)}
            </span>
            {entry.isFavorite && (
              <span className="text-orange-400 text-[11px]" title="Favori">★</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-stone-600 text-[10px]">{formatDate(entry.createdAt)}</span>
            {actions}
          </div>
        </div>

        <h3 className="text-stone-100 font-semibold text-sm leading-snug mb-3 group-hover:text-orange-300 transition-colors line-clamp-2">
          {entry.title}
        </h3>

        {entry.problem && (
          <div className="border-l-2 border-stone-700 pl-3 mb-3">
            <p className="text-stone-600 text-[10px] font-mono uppercase tracking-wider mb-0.5">Sorun</p>
            <p className="text-stone-400 text-xs leading-relaxed line-clamp-2">{entry.problem}</p>
          </div>
        )}

        {entry.decision && (
          <div className="bg-orange-500/5 border border-orange-500/15 rounded-lg px-3 py-2.5 mb-3">
            <p className="text-stone-600 text-[10px] font-mono uppercase tracking-wider mb-0.5">Karar</p>
            <p className="text-orange-100/60 text-xs leading-relaxed line-clamp-2">{entry.decision}</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-800">
          <div className="flex flex-wrap gap-1">
            {entry.tags.slice(0, 3).map(tag => <TagBadge key={tag} tag={tag} />)}
            {entry.tags.length > 3 && (
              <span className="text-stone-700 text-[10px] self-center">+{entry.tags.length - 3}</span>
            )}
          </div>
          <span className="font-mono text-stone-700 text-[10px]">{calcWords(entry)} kelime</span>
        </div>
      </div>
    </div>
  )
}
