# Provenance — data hukum & klasifikasi di repo ini

Dokumen ini mencatat **dari mana setiap data hukum berasal**, supaya klaim
"setiap angka punya dasar" bisa diperiksa, bukan hanya dipercaya. Aturan repo
ini (lihat `AGENTS.md`): grounding **di dalam repo**, tanpa Vertex AI Search /
managed RAG.

---

## 1. PP 55/2022 — PPh Final UMKM 0,5% ✅ terverifikasi

- **Berkas:** `nata_agent/statutes/pp-55-2022-pph-final-umkm.md`
- **Sumber:** salinan resmi di `https://peraturan.go.id/files/Salinan+PP+Nomor+55+Tahun+2022.pdf`
  (118 halaman), ditranskrip dan dicocokkan dengan struktur pasalnya
  (BAB X, Pasal 56–62).
- **Dipakai untuk:** tarif 0,5% (Pasal 56 ayat (2)), batas peredaran bruto
  Rp4,8 M (Pasal 57 ayat (1) huruf b), pembebasan Rp500 juta untuk orang
  pribadi (Pasal 60 ayat (2)–(3)).
- **Penjamin:** setiap kutipan ditulis apa adanya, dan ada tes
  (`test_compute_pph_final.py::test_every_citation_is_verbatim_in_statute`)
  yang memastikan kutipannya benar-benar ada di berkas.

---

## 2. KBLI 2020 (5 digit) ⚠️ terverifikasi isinya, **lisensi belum jelas**

- **Berkas:** `nata_agent/statutes/kbli/kbli-2020-5digit.json` — 1.790 kode
  tingkat *subclass* (5 digit), berisi `code`, `title`, `desc`.
- **Sumber yang dipakai:** dump publik
  `https://github.com/UserGhost411/KBLI-2020-Dataset` (`kbli_kelompok.json`).
- **Asal data sebenarnya:** KBLI 2020 adalah klasifikasi resmi
  **Badan Pusat Statistik (BPS)** Republik Indonesia
  (Peraturan BPS No. 2 Tahun 2020). Kode dan judulnya adalah data faktual
  pemerintah — bukan karya kreatif.
- **⚠️ Risiko yang dicatat:** repo GitHub sumbernya **tidak punya berkas
  lisensi** (`LICENSE` → 404, tidak ada `license` di metadata). Jadi meskipun
  isinya data pemerintah, jalur pengambilannya belum punya lisensi eksplisit.

**Tindakan sebelum rilis publik (belum dilakukan):**

1. Ambil ulang dataset dari sumber resmi BPS / OSS-RBA, bukan dari mirror
   GitHub tanpa lisensi.
2. Simpan bukti versi (Peraturan BPS No. 2 Tahun 2020 + tanggal unduh).
3. Setelah itu baru tandai berkas ini "clean" untuk distribusi.

Untuk keperluan pengembangan hari ini, data ini dipakai **internal** dan
statusnya dicatat apa adanya — bukan diklaim bersih.

- **Dipakai untuk:** mengusulkan + **memverifikasi** kode KBLI. Judul dikutip
  apa adanya dari katalog (`title_verbatim: true`).
- **Penjamin:** `catalog_size()` mengembalikan jumlah kode; kode yang tidak ada
  di katalog **ditolak** (`status: "error"`), dan ada tes untuk itu.

### Yang **tidak** ada di KBLI

Katalog KBLI **tidak memuat** tingkat risiko (Rendah/Menengah/Tinggi) maupun
daftar persyaratan perizinan per kode. Keduanya berasal dari OSS-RBA /
PP 5/2021. Karena teks itu belum ada di repo, Agent Regulasi:

- **tidak menebak** tingkat risiko; ia mengembalikan `risk_level: null` beserta
  catatan bahwa ini perlu dicek di OSS-RBA.
- **tidak menebak** langkah perizinan.

Menandai sesuatu yang belum diketahui lebih baik daripada menebaknya —
terutama untuk hal yang berimplikasi hukum.

---

## 3. PP 20/2026 ❌ **belum diverifikasi — tidak dipakai**

Ada sumber riset (Gemini Deep Research, di dalam vault) yang menyebut
**PP 20/2026** mengubah PP 55/2022:

- tarif 0,5% menjadi permanen,
- PT/CV dikeluarkan dari skema 0,5%,
- pembebasan Rp500 juta hanya untuk orang pribadi (bukan PT Perorangan),
- jasa profesional dilarang memakai 0,5% (Pasal 56 ayat (4)).

**Status verifikasi: GAGAL.** Upaya verifikasi 2026-10-17:

| Upaya | Hasil |
| --- | --- |
| `web_search` | dinonaktifkan (tidak ada provider) |
| `peraturan.bpk.go.id/Details/317615/pp-no-20-tahun-2026` | dialihkan ke Perwali Kota Tegal yang tidak berkaitan |
| DuckDuckGo Lite | gagal TLS (self-signed certificate) |
| `bps.go.id` | HTTP 403 |

Karena tidak bisa diverifikasi, aturan-aturan itu **tidak dienkode**. Modul
`entities.py` dan `tax.py` mengikuti PP 55/2022 yang ada di repo.

**Tindakan:** verifikasi ke sumber resmi (peraturan.go.id / JDIH) sebelum
mengubah perlakuan pajak. Bila PP 20/2026 memang berlaku, yang berubah adalah
`entities.py` (profil per bentuk usaha) dan `tax.py` (tarif per bentuk), bukan
arsitektur.

---

## Ringkasan status

| Data | Berkas | Verifikasi | Lisensi |
| --- | --- | --- | --- |
| PP 55/2022 | `statutes/pp-55-2022-*.md` | ✅ salinan resmi | dokumen publik |
| KBLI 2020 5 digit | `statutes/kbli/*.json` | ⚠️ isi cocok, asal mirror | ❌ belum jelas |
| PP 20/2026 | — | ❌ gagal diverifikasi | — |
