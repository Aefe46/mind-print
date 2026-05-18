import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useMindPrint } from '../context'
import Header from '../components/Header'
import TagBadge from '../components/TagBadge'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function EmptyFavorites({ onNavigate }) {
  return (
    <div className="text-center py-24 border border-stone-800/40 border-dashed rounded-2xl">
      <div className="text-4xl mb-4 opacity-20">☆</div>
      <p className="font-mono text-stone-500 text-sm mb-2">// favoriler boş</p>
      <p className="font-mono text-stone-700 text-xs mb-8">
        Kayıtları incelerken ★ butonuna basarak buraya ekleyebilirsin.
      </p>
      <button
        onClick={onNavigate}
        className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
      >
        ← Kayıtlara dön
      </button>
    </div>
  )
}

function FavoriteItem({ entry, onToggle }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/detail/${entry.id}`)}
      className="group bg-stone-900 border border-stone-800 hover:border-orange-500/40 rounded-xl px-5 py-4 cursor-pointer transition-all duration-200 flex items-start gap-4"
    >
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(entry.id) }}
        title="Favoriden çıkar"
        className="mt-0.5 text-orange-400 hover:text-stone-500 transition-colors text-sm shrink-0"
      >
        ★
      </button>

      <div className="flex-1 min-w-0">
        <h3 className="text-stone-100 font-semibold text-sm leading-snug group-hover:text-orange-300 transition-colors mb-1.5 truncate">
          {entry.title}
        </h3>
        {entry.decision && (
          <p className="text-stone-600 text-xs font-mono leading-relaxed line-clamp-2 mb-2">
            {entry.decision}
          </p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {entry.tags.slice(0, 4).map(t => <TagBadge key={t} tag={t} />)}
          {entry.tags.length > 4 && (
            <span className="text-stone-700 text-[10px] font-mono">+{entry.tags.length - 4}</span>
          )}
        </div>
      </div>

      <span className="font-mono text-stone-700 text-[10px] whitespace-nowrap shrink-0 mt-0.5">
        {formatDate(entry.createdAt)}
      </span>
    </div>
  )
}

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { entries, toggleFavorite } = useMindPrint()
  const favorites = entries.filter(e => e.isFavorite)

  return (
    <div className="min-h-screen bg-stone-950">
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 border border-orange-500/40 rounded-md flex items-center justify-center">
                <span className="text-orange-400 text-sm">★</span>
              </div>
              <h2 className="text-stone-100 font-bold text-xl">Favoriler</h2>
            </div>
            <p className="text-stone-600 text-xs font-mono">
              // önemli bulduğun kararlar burada birikir
            </p>
          </div>
          {favorites.length > 0 && (
            <span className="font-mono text-stone-600 text-xs border border-stone-800 px-2.5 py-1 rounded-md">
              {favorites.length} kayıt
            </span>
          )}
        </div>

        {favorites.length === 0 ? (
          <EmptyFavorites onNavigate={() => navigate('/')} />
        ) : (
          <div className="space-y-2">
            {favorites.map(entry => (
              <FavoriteItem key={entry.id} entry={entry} onToggle={toggleFavorite} />
            ))}
          </div>
        )}

        {favorites.length > 0 && (
          <div className="mt-8 pt-6 border-t border-stone-800 flex items-center justify-between">
            <span className="font-mono text-stone-700 text-xs">
              {favorites.length} / {entries.length} kayıt favorilendi
            </span>
            <button
              onClick={() => navigate('/')}
              className="font-mono text-xs text-stone-500 hover:text-stone-300 transition-colors"
            >
              ← tüm kayıtlara dön
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
