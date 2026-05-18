import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMindPrint } from '../context'

export default function Header() {
  const { pathname } = useLocation()
  const { entries } = useMindPrint()
  const isHome = pathname === '/'
  const isFavoritesPage = pathname === '/favorites'
  const favoriteCount = entries.filter(e => e.isFavorite).length

  return (
    <header className="bg-stone-950 border-b border-stone-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 border border-orange-500/50 rounded-md flex items-center justify-center">
            <span className="text-orange-400 font-mono font-semibold text-[11px] tracking-tight">KB</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-stone-100 font-bold text-[15px] tracking-tight">MindPrint</span>
            <span className="text-orange-500/50 font-mono text-[10px]">v0.1</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <span className="hidden sm:flex font-mono text-stone-600 text-[11px] border border-stone-800 px-2.5 py-1 rounded-md">
            {entries.length} kayıt
          </span>

          {/* Favoriler linki — sepet butonu eşdeğeri */}
          <Link
            to="/favorites"
            title="Favoriler"
            className={`relative flex items-center gap-1.5 font-mono text-[12px] px-3 py-1.5 rounded-lg border transition-colors ${
              isFavoritesPage
                ? 'bg-orange-500/10 border-orange-500/40 text-orange-400'
                : 'border-stone-800 text-stone-500 hover:text-orange-400 hover:border-orange-500/30'
            }`}
          >
            <span>★</span>
            <span className="hidden sm:inline">Favoriler</span>
            {favoriteCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-stone-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </Link>

          {isHome ? (
            <Link
              to="/add"
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-stone-950 font-semibold px-3.5 py-1.5 rounded-lg text-sm transition-colors"
            >
              + Yeni
            </Link>
          ) : (
            <Link to="/" className="text-stone-400 hover:text-stone-200 text-sm transition-colors">
              ← Geri
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
