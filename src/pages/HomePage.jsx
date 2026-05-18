import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useMindPrint } from '../context'
import Header from '../components/Header'
import DecisionCard from '../components/DecisionCard'
import SearchBar from '../components/SearchBar'
import TagBadge from '../components/TagBadge'

function StatCard({ label, value, accent, sub }) {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
      <p className="text-stone-600 text-[10px] font-mono uppercase tracking-widest mb-2">{label}</p>
      <p className={`font-bold text-2xl font-mono ${accent ? 'text-orange-400' : 'text-stone-100'}`}>
        {value}
      </p>
      {sub && <p className="text-stone-700 text-[10px] font-mono mt-1">{sub}</p>}
    </div>
  )
}

// Banner bileşeni — asset yönetimi (Image.asset eşdeğeri)
function Banner() {
  return (
    <div className="mb-8 rounded-2xl overflow-hidden border border-stone-800">
      <img
        src="/assets/banner.svg"
        alt="MindPrint — Yazılımcının Kara Kutusu"
        className="w-full object-cover"
        style={{ height: '140px' }}
        draggable={false}
      />
    </div>
  )
}

export default function HomePage() {
  const { entries, deleteEntry } = useMindPrint()
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState('grid')

  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = entries.filter(e => {
      const d = new Date(e.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

    const tagCount = {}
    entries.forEach(e => e.tags.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1 }))
    const sorted = Object.entries(tagCount).sort((a, b) => b[1] - a[1])
    const topTag = sorted[0]?.[0] || null
    const topTagCount = sorted[0]?.[1] || 0

    const totalWords = entries.reduce((sum, e) =>
      sum + [e.problem, e.decision, e.alternatives, e.resources]
        .filter(Boolean).join(' ').split(/\s+/).filter(w => w).length
    , 0)

    return {
      total: entries.length,
      tagTypes: Object.keys(tagCount).length,
      thisMonth,
      topTag,
      topTagCount,
      totalWords,
    }
  }, [entries])

  const allTags = useMemo(() => {
    const set = new Set()
    entries.forEach(e => e.tags.forEach(t => set.add(t)))
    return [...set]
  }, [entries])

  const filtered = useMemo(() => {
    return entries.filter(e => {
      const q = search.toLowerCase()
      const matchSearch = !search ||
        e.title.toLowerCase().includes(q) ||
        e.problem.toLowerCase().includes(q) ||
        e.decision.toLowerCase().includes(q)
      const matchTag = !selectedTag || e.tags.includes(selectedTag)
      return matchSearch && matchTag
    })
  }, [entries, search, selectedTag])

  const sorted = useMemo(() => {
    const f = [...filtered]
    if (sort === 'newest') f.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (sort === 'oldest') f.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    if (sort === 'alpha') f.sort((a, b) => a.title.localeCompare(b.title, 'tr'))
    return f
  }, [filtered, sort])

  return (
    <div className="min-h-screen bg-stone-950">
      <Header />
      <main className="max-w-6xl mx-auto px-5 py-8">

        {/* Banner — asset yönetimi gösterimi */}
        <Banner />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Toplam Kayıt" value={stats.total} sub={`${stats.totalWords} kelime`} />
          <StatCard label="Etiket Türü" value={stats.tagTypes} />
          <StatCard label="Bu Ay" value={stats.thisMonth} accent />
          <StatCard
            label="En Çok Tag"
            value={stats.topTag ? `#${stats.topTag}` : '—'}
            sub={stats.topTag ? `${stats.topTagCount}x kullanıldı` : undefined}
          />
        </div>

        {/* Search */}
        <div className="mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="başlık, sorun veya karar içinde ara..."
          />
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center mb-4">
            <span className="text-stone-700 font-mono text-[10px] uppercase tracking-wider">tag:</span>
            <button
              onClick={() => setSelectedTag('')}
              className={`font-mono text-[11px] px-2 py-0.5 rounded border transition-colors ${
                !selectedTag
                  ? 'bg-stone-700 border-stone-600 text-stone-200'
                  : 'border-stone-800 text-stone-600 hover:border-stone-700 hover:text-stone-400'
              }`}
            >
              hepsi
            </button>
            {allTags.map(tag => (
              <TagBadge
                key={tag}
                tag={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                selected={selectedTag === tag}
              />
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-stone-600 text-xs">
            {sorted.length !== entries.length
              ? `${sorted.length} / ${entries.length} sonuç`
              : `${entries.length} kayıt`}
          </span>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-stone-400 text-xs font-mono focus:outline-none focus:border-orange-500/40 transition-colors"
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="alpha">A → Z</option>
            </select>
            <div className="flex border border-stone-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`px-2.5 py-1.5 text-sm transition-colors ${
                  view === 'grid' ? 'bg-stone-700 text-stone-200' : 'bg-stone-900 text-stone-600 hover:text-stone-300'
                }`}
                title="Grid görünüm"
              >⊞</button>
              <button
                onClick={() => setView('list')}
                className={`px-2.5 py-1.5 text-sm transition-colors ${
                  view === 'list' ? 'bg-stone-700 text-stone-200' : 'bg-stone-900 text-stone-600 hover:text-stone-300'
                }`}
                title="Liste görünüm"
              >≡</button>
            </div>
          </div>
        </div>

        {/* Entries */}
        {sorted.length === 0 ? (
          <div className="text-center py-24 border border-stone-800/40 border-dashed rounded-2xl">
            <p className="font-mono text-stone-600 text-sm mb-6">
              {entries.length === 0 ? '// henüz kayıt yok' : '// sonuç bulunamadı'}
            </p>
            {entries.length === 0 && (
              <Link
                to="/add"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-stone-950 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                + İlk Kararı Kaydet
              </Link>
            )}
          </div>
        ) : (
          <div className={
            view === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-2'
          }>
            {sorted.map(entry => (
              <DecisionCard key={entry.id} entry={entry} onDelete={deleteEntry} view={view} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
