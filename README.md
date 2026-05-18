# MindPrint — Yazılımcının Kara Kutusu

> Kod değil, düşünce sürecini belgele.

Yazılım projelerinde en büyük kayıp, geliştiricinin o kodu yazarken ne düşündüğünün, neden o yolu seçtiğinin ve hangi alternatifleri değerlendirdiğinin bilinmemesidir. MindPrint bu bilgiyi kayıt altına alır.

---

## Proje Hakkında

MindPrint, yazılımcıların teknik karar süreçlerini belgeleyen bir **karar günlüğü** uygulamasıdır. Git sadece kodun ne olduğunu gösterir; MindPrint **neden öyle yazıldığını** anlatır.

### Temel Özellikler

- **Karar Kaydı** — Karşılaşılan sorunu, alınan kararı, değerlendirilen alternatifleri ve başvurulan kaynakları yapılandırılmış şekilde kaydet
- **Arama & Filtreleme** — Başlık, sorun veya karar metninde anlık arama; etiket bazlı filtreleme
- **Grid / Liste Görünümü** — Kayıtları kart tabanlı grid ya da kompakt liste olarak görüntüle
- **Favoriler** — Önemli kararları işaretle, hızlıca ulaş
- **Sayfa Geçişleri** — Ana Sayfa → Karar Detayı → Düzenleme akışı
- **JSON Veri Kaynağı** — İlk açılışta `/data/decisions.json` dosyasından örnek veriler yüklenir
- **LocalStorage Kalıcılığı** — Tüm veriler tarayıcıda saklanır, backend gerektirmez
- **Markdown Dışa Aktarma** — Her kaydı tek tıkla markdown formatında kopyala

---

## Kullanılan Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| UI Framework | React 18 |
| Routing | React Router DOM v6 |
| Stil | Tailwind CSS v3 |
| Build Aracı | Vite |
| Dil | JavaScript (JSX) |
| Veri Kaynağı | JSON dosyası + LocalStorage |

---

## Proje Yapısı

```
SoftwarePersonaJS/
├── public/
│   ├── assets/
│   │   └── banner.svg          # Uygulama banner görseli
│   └── data/
│       └── decisions.json      # Örnek veri kaynağı (API simülasyonu)
├── src/
│   ├── components/
│   │   ├── DecisionCard.jsx    # Karar kartı (grid & liste görünümü)
│   │   ├── Header.jsx          # Üst navigasyon çubuğu
│   │   ├── SearchBar.jsx       # Arama bileşeni
│   │   └── TagBadge.jsx        # Etiket rozeti
│   ├── interfaces/
│   │   ├── DecisionEntry.js    # Veri modeli (fromJson/toJson/CRUD)
│   │   └── index.js            # Dışa aktarımlar
│   ├── pages/
│   │   ├── HomePage.jsx        # Ana sayfa — kayıt listesi
│   │   ├── DetailPage.jsx      # Karar detay sayfası
│   │   ├── AddEditPage.jsx     # Yeni kayıt / düzenleme formu
│   │   └── FavoritesPage.jsx   # Favoriler sayfası
│   ├── App.jsx                 # Uygulama kökü & Router
│   ├── context.jsx             # React Context (global state)
│   └── main.jsx                # Giriş noktası
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Veri Modeli

Her karar kaydı (`DecisionEntry`) şu alanlardan oluşur:

```js
{
  id: string,           // Benzersiz kimlik (UUID)
  title: string,        // Karar başlığı
  problem: string,      // Karşılaşılan teknik sorun
  decision: string,     // Alınan karar ve gerekçesi
  alternatives: string, // Değerlendirilen alternatifler
  resources: string,    // Başvurulan kaynaklar / linkler
  tags: string[],       // Etiketler
  isFavorite: boolean,  // Favori durumu
  createdAt: string,    // ISO tarih
  updatedAt: string,    // ISO tarih
}
```

Model, `fromJson(json)` ve `toJson(entry)` fonksiyonlarıyla JSON dönüşümünü destekler.

---

## Çalıştırma Adımları

### Gereksinimler

- Node.js >= 18
- npm >= 9

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini aç.

### Production Build

```bash
npm run build
npm run preview
```

---

## Sayfa Akışı (Route Yapısı)

```
/               → Ana Sayfa (kayıt listesi + arama + filtre)
/add            → Yeni karar ekle
/edit/:id       → Mevcut kararı düzenle
/detail/:id     → Karar detayı (ilgili kayıtlar + markdown export)
/favorites      → Favori kayıtlar
```

---

## Ekran Görüntüleri

> Uygulamayı `npm run dev` ile başlatıp tarayıcıda görüntüleyebilirsiniz.

**Ana Sayfa** — Banner, istatistik kartları, arama çubuğu, etiket filtresi ve grid/liste görünümü.

**Karar Detayı** — Sorun, karar, alternatifler ve kaynaklar ayrı bölümler halinde; markdown kopyalama butonu.

**Favoriler** — İşaretlenen kararların listesi; header'daki ★ rozet aktif sayıyı gösterir.

---

## Lisans

MIT — Eğitim ve öğrenme amaçlı serbestçe kullanılabilir.
