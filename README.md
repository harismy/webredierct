# 🔁 1forcrvpn.store → 1forcrkuota.com

Halaman redirect **statis (tanpa backend)** yang menampilkan animasi singkat lalu
mengalihkan pengunjung dari domain lama **1forcrvpn.store** ke domain baru
**1forcrkuota.com**. Siap deploy ke Vercel tanpa build step.

## ✨ Fitur

- 🎨 Animasi modern: blob gradient bergerak, partikel canvas, glassmorphism, teks shimmer.
- ⏱️ Countdown ring 5 detik (SVG) + redirect otomatis ke domain baru.
- 🚀 Tombol **"Kunjungi Website Baru"** untuk langsung pindah tanpa menunggu.
- 📱 Responsif (HP, tablet, desktop) dan menghormati `prefers-reduced-motion`.
- 🧯 Fallback `<noscript>` (meta refresh) jika JavaScript dimatikan.
- 🔍 SEO aman: `canonical` ke domain baru + `noindex` untuk halaman lama.
- ⚡ 2 file asset ringan, tanpa framework, tanpa dependency.

## 📁 Struktur

```
.
├── index.html        # Halaman redirect + animasi
├── assets/
│   ├── style.css     # Styling & animasi
│   └── script.js     # Countdown, redirect, partikel
├── vercel.json       # Konfigurasi Vercel (header & cache)
└── README.md
```

## 🚀 Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → **Add New… → Project** → import repo GitHub `harismy/webredierct`.
2. **Framework Preset:** `Other` (Build Command & Output Directory dikosongkan — site statis murni).
3. Klik **Deploy**.
4. Setelah selesai: **Project → Settings → Domains**, tambahkan:
   - `1forcrvpn.store`
   - `www.1forcrvpn.store`
5. Arahkan DNS domain lama sesuai instruksi Vercel (biasanya `A` → `76.76.21.21` dan `CNAME www` → `cname.vercel-dns.com`).

Setiap kali repo di-push, Vercel otomatis redeploy.

## ⚙️ Kustomisasi

| Yang ingin diubah          | Lokasi                          |
| -------------------------- | ------------------------------- |
| URL tujuan redirect        | `TARGET_URL` di `assets/script.js` |
| Durasi countdown (detik)   | `REDIRECT_SECONDS` di `assets/script.js` |
| Teks & judul halaman       | `index.html`                    |
| Warna, font, animasi       | variabel di `assets/style.css`  |
| Mode pratinjau (tanpa redirect otomatis) | buka halaman dengan `?preview`, mis. `index.html?preview` |

## 🔧 Preview lokal

Cukup buka `index.html` di browser, atau jalankan:

```bash
npx serve .
```

## 💡 Opsi: redirect instan (tanpa halaman animasi)

Jika suatu saat ingin redirect 301 permanen langsung dari Vercel (tanpa menampilkan
halaman ini), tambahkan blok berikut ke `vercel.json`:

```json
{
  "redirects": [
    { "source": "/(.*)", "destination": "https://1forcrkuota.com/$1", "permanent": true }
  ]
}
```

> Catatan: menghapus `redirects` ini akan mengembalikan halaman animasi.

---

© 1forcrkuota.com — Semua hak dilindungi.
