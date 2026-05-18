import React, { useState, useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { MindPrintContext } from './context'
import { fromJson, createDecisionEntry, updateDecisionEntry, SAMPLE_ENTRIES } from './interfaces'
import HomePage from './pages/HomePage'
import AddEditPage from './pages/AddEditPage'
import DetailPage from './pages/DetailPage'
import FavoritesPage from './pages/FavoritesPage'

const STORAGE_KEY = 'mindprint_entries'

// JSON veri kaynağından örnek verileri yükler (API simülasyonu)
async function loadFromJsonSource() {
  try {
    const res = await fetch('/data/decisions.json')
    if (!res.ok) throw new Error('fetch failed')
    const raw = await res.json()
    return raw.map(fromJson)
  } catch {
    return SAMPLE_ENTRIES.map(fromJson)
  }
}

function App() {
  const [entries, setEntries] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch {
      // ignore
    }
    return null
  })

  // İlk açılışta localStorage boşsa JSON dosyasından yükle
  useEffect(() => {
    if (entries !== null) return
    loadFromJsonSource().then(data => {
      setEntries(data)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    })
  }, [])

  useEffect(() => {
    if (entries === null) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const addEntry = (data) => {
    const entry = createDecisionEntry(data)
    setEntries(prev => [entry, ...prev])
    return entry.id
  }

  const updateEntry = (id, data) => {
    setEntries(prev =>
      prev.map(e => (e.id === id ? updateDecisionEntry(e, data) : e))
    )
  }

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const getEntry = (id) => entries?.find(e => e.id === id)

  const toggleFavorite = (id) => {
    setEntries(prev =>
      prev.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e)
    )
  }

  if (entries === null) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <span className="font-mono text-stone-600 text-sm">// veriler yükleniyor...</span>
      </div>
    )
  }

  return (
    <MindPrintContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry, getEntry, toggleFavorite }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddEditPage />} />
          <Route path="/edit/:id" element={<AddEditPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </HashRouter>
    </MindPrintContext.Provider>
  )
}

export default App
