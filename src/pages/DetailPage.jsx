import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMindPrint } from '../context'
import Header from '../components/Header'
import TagBadge from '../components/TagBadge'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function CopyButton({ text, label }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      setTimeout(() => setDone(false), 1800)
    } catch {
      // clipboard not available
    }
  }
  return (
    <button
      onClick={copy}
      className={`font-mono text-[10px] px-2 py-0.5 rounded border transition-colors ${
        done
          ? 'text-lime-400 border-lime-800/50'
          : 'text-stone-700 border-stone-800 hover:text-stone-400 hover:border-stone-700'
      }`}
    >
      {done ? '✓ kopyalandı' : (label || 'kopyala')}
    </button>
  )
}

function Section({ icon, label, content, highlight }) {
  return (
    <div className={`rounded-xl border overflow-hidden ${highlight ? 'bg-orange-500/5 border-orange-500/20' : 'bg-stone-900 border-stone-800'}`}>
      <div className={`flex items-center justify-between px-5 py-3 border-b ${highlight ? 'border-orange-500/15' : 'border-stone-800'}`}>
        <h3 className={`text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 ${highlight ? 'text-orange-400' : 'text-stone-600'}`}>
          <span>{icon}</span>{label}
        </h3>
        <CopyButton text={content} />
      </div>
      <p className="px-5 py-4 text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  )
}

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEntry, deleteEntry, entries } = useMindPrint()
  const entry = getEntry(id)

  if (!entry) {
    return (
      <div className="min-h-screen bg-stone-950">
        <Header />
        <div className="text-center py-24">
          <p className="font-mono text-stone-600 text-sm">// kayıt bulunamadı</p>
        </div>
      </div>
    )
  }

  const words = [entry.problem, entry.decision, entry.alternatives, entry.resources]
    .filter(Boolean).join(' ').split(/\s+/).filter(w => w).length
  const readMin = Math.max(1, Math.ceil(words / 200))

  const related = entries
    .filter(e => e.id !== entry.id && e.tags.some(t => entry.tags.includes(t)))
    .slice(0, 4)

  const handleDelete = () => {
    if (window.confirm(`"${entry.title}" silinsin mi?`)) {
      deleteEntry(id)
      navigate('/')
    }
  }

  const fullMarkdown = [
    `# ${entry.title}`,
    entry.problem && `\n## Sorun\n${entry.problem}`,
    `\n## Karar\n${entry.decision}`,
    entry.alternatives && `\n## Alternatifler\n${entry.alternatives}`,
    entry.resources && `\n## Kaynaklar\n${entry.resources}`,
    entry.tags.length && `\n## Etiketler\n${entry.tags.map(t => `#${t}`).join(', ')}`,
  ].filter(Boolean).join('\n')

  return (
    <div className="min-h-screen bg-stone-950">
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-8">

        {/* Action bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-1">
            {entry.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
            {entry.tags.length === 0 && (
              <span className="font-mono text-stone-700 text-xs">etiket yok</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/edit/${entry.id}`)}
              className="font-mono text-[11px] text-stone-500 hover:text-orange-400 border border-stone-800 hover:border-orange-500/40 px-3 py-1.5 rounded-lg transition-colors"
            >
              ✎ düzenle
            </button>
            <button
              onClick={handleDelete}
              className="font-mono text-[11px] text-stone-600 hover:text-red-400 border border-stone-800 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              ✕ sil
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-stone-100 font-bold text-2xl leading-snug mb-4">{entry.title}</h2>

        {/* Meta strip */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-8 pb-6 border-b border-stone-800">
          <span className="font-mono text-stone-700 text-[11px]">#{entry.id.slice(-8)}</span>
          <span className="text-stone-800">·</span>
          <span className="font-mono text-stone-500 text-[11px]">{formatDate(entry.createdAt)}</span>
          {entry.updatedAt !== entry.createdAt && (
            <>
              <span className="text-stone-800">·</span>
              <span className="font-mono text-stone-600 text-[11px]">güncellendi {formatDate(entry.updatedAt)}</span>
            </>
          )}
          <span className="text-stone-800">·</span>
          <span className="font-mono text-stone-600 text-[11px]">{words} kelime · ~{readMin} dk okuma</span>
          <div className="ml-auto">
            <CopyButton text={fullMarkdown} label="markdown olarak kopyala" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {entry.problem && (
            <Section icon="⬤" label="Karşılaşılan Sorun" content={entry.problem} />
          )}
          <Section icon="◆" label="Alınan Karar" content={entry.decision} highlight />
          {entry.alternatives && (
            <Section icon="◈" label="Değerlendirilen Alternatifler" content={entry.alternatives} />
          )}
          {entry.resources && (
            <Section icon="◉" label="Başvurulan Kaynaklar" content={entry.resources} />
          )}
        </div>

        {/* Related entries */}
        {related.length > 0 && (
          <div className="mt-10 pt-8 border-t border-stone-800">
            <p className="font-mono text-stone-700 text-[10px] uppercase tracking-widest mb-4">
              // ilgili kayıtlar
            </p>
            <div className="space-y-2">
              {related.map(r => (
                <button
                  key={r.id}
                  onClick={() => navigate(`/detail/${r.id}`)}
                  className="w-full text-left bg-stone-900 hover:bg-stone-800/80 border border-stone-800 hover:border-stone-700 rounded-xl px-4 py-3 transition-colors group"
                >
                  <p className="text-stone-300 group-hover:text-orange-300 text-sm font-medium transition-colors truncate">
                    {r.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {r.tags.filter(t => entry.tags.includes(t)).map(t => (
                      <TagBadge key={t} tag={t} />
                    ))}
                    <span className="font-mono text-stone-700 text-[10px] ml-auto">
                      ortak etiket
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
