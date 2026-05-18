// fromJson: JSON verisinden bir DecisionEntry nesnesi oluşturur (API simülasyonu)
export const fromJson = (json) => ({
  id: json.id || crypto.randomUUID(),
  title: json.title || '',
  problem: json.problem || '',
  decision: json.decision || '',
  alternatives: json.alternatives || '',
  resources: json.resources || '',
  tags: Array.isArray(json.tags)
    ? json.tags
    : typeof json.tags === 'string'
      ? json.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [],
  isFavorite: Boolean(json.isFavorite),
  createdAt: json.createdAt || new Date().toISOString(),
  updatedAt: json.updatedAt || new Date().toISOString(),
})

// toJson: Bir DecisionEntry nesnesini sade JSON objesine dönüştürür
export const toJson = (entry) => ({
  id: entry.id,
  title: entry.title,
  problem: entry.problem,
  decision: entry.decision,
  alternatives: entry.alternatives,
  resources: entry.resources,
  tags: entry.tags,
  isFavorite: entry.isFavorite,
  createdAt: entry.createdAt,
  updatedAt: entry.updatedAt,
})

export const createDecisionEntry = ({
  title = '',
  problem = '',
  decision = '',
  alternatives = '',
  resources = '',
  tags = [],
} = {}) => ({
  id: crypto.randomUUID(),
  title,
  problem,
  decision,
  alternatives,
  resources,
  tags: Array.isArray(tags)
    ? tags
    : tags.split(',').map(t => t.trim()).filter(Boolean),
  isFavorite: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

export const updateDecisionEntry = (entry, updates) => ({
  ...entry,
  ...updates,
  tags: Array.isArray(updates.tags)
    ? updates.tags
    : updates.tags.split(',').map(t => t.trim()).filter(Boolean),
  isFavorite: entry.isFavorite,
  updatedAt: new Date().toISOString(),
})

export const SAMPLE_ENTRIES = [
  {
    id: 'sample-1',
    title: 'Neden Redux yerine Context API seçtim?',
    problem:
      'Uygulama state yönetimi için bir çözüm gerekiyordu. Redux kurulum maliyeti ve boilerplate miktarı bu proje ölçeği için fazla geldi.',
    decision:
      'React Context API + useReducer kombinasyonunu seçtim. Ekstra bağımlılık gerektirmiyor, küçük-orta projeler için yeterli güçte.',
    alternatives: 'Redux Toolkit, Zustand, Jotai, Recoil',
    resources:
      'https://react.dev/reference/react/useContext\nDan Abramov — "You Might Not Need Redux" (medium.com)',
    tags: ['state-management', 'react', 'architecture'],
    isFavorite: false,
    createdAt: '2024-03-10T09:00:00.000Z',
    updatedAt: '2024-03-10T09:00:00.000Z',
  },
  {
    id: 'sample-2',
    title: 'API katmanında Axios değil Fetch tercih ettim',
    problem:
      'HTTP istekleri için kütüphane seçimi gerekiyordu. Projeye ekstra bağımlılık eklememek istedim.',
    decision:
      'Native Fetch API kullandım. Modern tarayıcılarda tam destek var, interceptor ihtiyacı yoktu, async/await ile okunabilirliği yeterli.',
    alternatives: 'Axios, SWR, TanStack Query',
    resources: 'MDN Web Docs — Fetch API\nhttps://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
    tags: ['api', 'networking', 'dependency'],
    isFavorite: false,
    createdAt: '2024-03-12T14:30:00.000Z',
    updatedAt: '2024-03-12T14:30:00.000Z',
  },
  {
    id: 'sample-3',
    title: 'Veritabanı olarak PostgreSQL seçimi',
    problem:
      'Proje için ilişkisel veri modeli gerekiyordu. NoSQL ve ilişkisel seçenekler karşılaştırıldı.',
    decision:
      'PostgreSQL seçildi: ACID uyumlu, açık kaynak, JSON desteği güçlü, büyük topluluk. Üretim ortamı için olgunluk seviyesi yeterli.',
    alternatives: 'MySQL, SQLite, MongoDB',
    resources: 'PostgreSQL official docs\nhttps://www.postgresql.org/docs/',
    tags: ['database', 'backend', 'architecture'],
    isFavorite: false,
    createdAt: '2024-03-15T11:00:00.000Z',
    updatedAt: '2024-03-15T11:00:00.000Z',
  },
]
