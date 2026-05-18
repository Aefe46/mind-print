import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMindPrint } from '../context'
import Header from '../components/Header'

const EMPTY = { title: '', problem: '', decision: '', alternatives: '', resources: '', tags: '' }

function inputCls(err) {
  return [
    'w-full bg-stone-900 border rounded-xl px-4 py-3 text-stone-200 placeholder-stone-600',
    'text-sm focus:outline-none transition-colors resize-none font-mono',
    'focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20',
    err ? 'border-red-500/50' : 'border-stone-800',
  ].join(' ')
}

function Field({ label, hint, error, count, maxCount, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label className="text-stone-200 text-sm font-semibold">{label}</label>
        {count !== undefined && (
          <span className={`font-mono text-[10px] ${count > (maxCount || 9999) * 0.85 ? 'text-orange-400' : 'text-stone-700'}`}>
            {count}{maxCount ? `/${maxCount}` : ''}
          </span>
        )}
      </div>
      {hint && <p className="text-stone-700 text-xs font-mono mb-2">{hint}</p>}
      {children}
      {error && <p className="text-red-400 text-xs mt-1 font-mono">// {error}</p>}
    </div>
  )
}

const STEPS = [
  { field: 'title', label: 'Başlık *', hint: '// bu kararı tanımlayan kısa bir cümle', type: 'input', max: 120 },
  { field: 'problem', label: 'Sorun', hint: '// hangi teknik problemle karşılaştın?', rows: 3 },
  { field: 'decision', label: 'Karar *', hint: '// hangi çözümü seçtin ve neden?', rows: 4 },
  { field: 'alternatives', label: 'Alternatifler', hint: '// hangi diğer seçenekleri değerlendirdin?', rows: 2 },
  { field: 'resources', label: 'Kaynaklar', hint: '// döküman, blog, SO, GitHub linkleri...', rows: 2 },
]

export default function AddEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addEntry, updateEntry, getEntry, entries } = useMindPrint()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const allTags = useMemo(() => {
    const set = new Set()
    entries.forEach(e => e.tags.forEach(t => set.add(t)))
    return [...set]
  }, [entries])

  const currentTags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
  const suggestedTags = allTags.filter(t => !currentTags.includes(t))

  useEffect(() => {
    if (!isEdit) return
    const entry = getEntry(id)
    if (!entry) { navigate('/'); return }
    setForm({
      title: entry.title,
      problem: entry.problem,
      decision: entry.decision,
      alternatives: entry.alternatives,
      resources: entry.resources,
      tags: entry.tags.join(', '),
    })
  }, [id, isEdit])

  const setField = field => e => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const addTag = (tag) => {
    const existing = form.tags.trim()
    setForm(prev => ({ ...prev, tags: existing ? `${existing}, ${tag}` : tag }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.title.trim()) errs.title = 'başlık zorunlu'
    if (!form.decision.trim()) errs.decision = 'karar alanı zorunlu'
    if (Object.keys(errs).length) { setErrors(errs); return }

    const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    if (isEdit) {
      updateEntry(id, data)
      navigate(`/detail/${id}`)
    } else {
      const newId = addEntry(data)
      navigate(`/detail/${newId}`)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950">
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 border border-orange-500/40 rounded-md flex items-center justify-center">
              <span className="text-orange-400 font-mono text-xs">{isEdit ? '✎' : '+'}</span>
            </div>
            <h2 className="text-stone-100 font-bold text-xl">
              {isEdit ? 'Kaydı Düzenle' : 'Yeni Karar Kaydı'}
            </h2>
          </div>
          <p className="text-stone-600 text-xs font-mono">
            // teknik kararının arkasındaki düşünce sürecini belgele
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {STEPS.map(({ field, label, hint, type, rows, max }) => (
            <Field
              key={field}
              label={label}
              hint={hint}
              error={errors[field]}
              count={form[field].length}
              maxCount={max}
            >
              {type === 'input' ? (
                <input
                  type="text"
                  value={form[field]}
                  onChange={setField(field)}
                  placeholder={label.replace(' *', '').toLowerCase()}
                  className={inputCls(errors[field])}
                  maxLength={max}
                />
              ) : (
                <textarea
                  value={form[field]}
                  onChange={setField(field)}
                  placeholder={label.toLowerCase() + '...'}
                  rows={rows}
                  className={inputCls(errors[field])}
                />
              )}
            </Field>
          ))}

          <Field
            label="Etiketler"
            hint="// virgülle ayır: react, state-management, backend"
            count={currentTags.length}
          >
            <input
              type="text"
              value={form.tags}
              onChange={setField('tags')}
              placeholder="tag1, tag2, tag3"
              className={inputCls()}
            />
            {suggestedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 items-center">
                <span className="text-stone-700 text-[10px] font-mono">öneri:</span>
                {suggestedTags.slice(0, 8).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => addTag(t)}
                    className="font-mono text-[11px] text-stone-600 hover:text-orange-400 border border-stone-800 hover:border-orange-500/40 px-2 py-0.5 rounded transition-colors"
                  >
                    +#{t}
                  </button>
                ))}
              </div>
            )}
          </Field>

          <div className="flex gap-3 pt-4 border-t border-stone-800">
            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-400 text-stone-950 font-bold py-3 rounded-xl text-sm transition-colors"
            >
              {isEdit ? 'Güncelle' : 'Kaydet'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 bg-stone-800 hover:bg-stone-700 text-stone-400 py-3 rounded-xl text-sm font-medium transition-colors"
            >
              İptal
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
