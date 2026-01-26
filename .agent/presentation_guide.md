# Panduan Pembentangan Sistem QR OPS
**Untuk**: Pengurusan Atasan PERKESO Keningau
**Tarikh**: 26 Januari 2026

## 1. Ringkasan Eksekutif
Sistem **QR OPS** adalah inisiatif digital untuk mendigitalkan proses pemantauan dan rekod lawatan OPS Kesan. Sistem ini menggantikan kaedah manual dengan penggunaan Kod QR yang dilekatkan di premis majikan, membolehkan perekodan data yang pantas, tepat, dan boleh dipantau secara masa nyata (real-time).

---

## 2. Bagaimana Sistem Berfungsi (Aliran Kerja)

Sistem ini beroperasi dalam 4 fasa mudah:

### Fasa 1: Persediaan (Pejabat)
1. Staff admin menjana pelekat QR Code melalui sistem.
2. Setiap pelekat mempunyai ID unik (UUID) dan logo PERKESO rasmi.
3. Pelekat dicetak (6 keping per A4) dan diedarkan kepada skuad pemeriksa.

### Fasa 2: Pemasangan (Di Premis)
1. Pemeriksa melawat premis majikan.
2. Pelekat QR OPS dilekatkan di lokasi yang mudah dilihat di premis.
3. Pemeriksa mengimbas QR tersebut buat kali pertama untuk **Pendaftaran Premis**.
   - Lokasi GPS direkodkan secara automatik.
   - Maklumat asas (Nama Kedai, No Lot, Status) dimasukkan.

### Fasa 3: Operasi Harian (Lawatan Susulan)
1. Bagi lawatan seterusnya, pemeriksa hanya perlu **Imbas (Scan)** QR Code tersebut.
2. Sistem akan memaparkan **Sejarah Lawatan** premis tersebut.
3. Pemeriksa merekodkan status lawatan terkini:
   - ✅ **Patuh** (Tiada isu)
   - ⚠️ **Lawat Semula** (Perlu follow-up)
   - 🔴 **Kompoun** (Kesalahan dikesan + No Notis)

### Fasa 4: Pelaporan & Analisis
1. Pengurusan boleh melihat **Laporan Masa Nyata** di Dashboard.
2. Statistik menunjukkan jumlah lawatan, kepatuhan, dan kompaun.
3. Laporan boleh ditapis mengikut tarikh atau tahun.

---

## 3. Demo Langsung (Langkah Demo)

Sila ikuti langkah ini semasa membentangkan sistem:

**Langkah 1: Tunjukkan Pelekat**
> *"Tuan, ini adalah contoh pelekat yang akan kita gunakan. Ia kalis air, ada logo rasmi kita, dan jangka hayat lama."*

**Langkah 2: Simulasi Lawatan**
> *"Saya akan tunjukkan bagaimana pemeriksa membuat kerja. Katalah saya sampai di Kedai Runcit Ali..."*
1. Buka aplikasi QR Scanner di telefon.
2. Imbas QR Code.
3. Tunjukkan skrin telefon: *"Sistem terus paparkan nama kedai dan rekod lepas."*

**Langkah 3: Rekod Lawatan**
> *"Sekarang saya rekodkan lawatan hari ini. Kedai ini tiada masalah, jadi saya tekan 'Patuh'."*
1. Tekan butang **Patuh**.
2. Masukkan catatan ringkas "Semua pekerja dicarum".
3. Tekan **Hantar**.
> *"Selesai. Dalam masa 5 saat, data ini sudah ada dalam sistem pusat kita."*

**Langkah 4: Tunjukkan Dashboard Laporan**
> *"Di pejabat, Tuan boleh terus lihat data yang baru saya masukkan tadi."*
1. Buka halaman Laporan Admin.
2. Tunjukkan statistik yang dikemaskini secara automatik.

---

## 4. Ciri Keselamatan Utama

Untuk menjawab persoalan mengenai keselamatan data:

1.  **Akses Terkawal**: Hanya pemeriksa berdaftar yang boleh log masuk dan akses data.
2.  **Imbasan Awam Dilindungi**: Jika orang awam mengimbas QR tersebut, mereka **tidak** boleh melihat data majikan (sistem akan minta login).
3.  **Lokasi GPS**: Setiap kali premis didaftarkan, koordinat GPS direkodkan untuk mengelakkan penipuan lokasi lawatan.
4.  **Integriti Data**: Data disimpan di pelayan selamat (Cloud Database) dan dilindungi undang-undang perlindungan data.

---

## 5. Faedah Kepada Organisasi

1.  **Penjimatan Masa**: Tiada lagi penulisan log manual yang memakan masa.
2.  **Pemantauan Efektif**: Pengurusan tahu lokasi dan masa sebenar lawatan dibuat.
3.  **Data Tepat**: Mengurangkan kesilapan manusia (human error) dalam merekod butiran premis.
4.  **Profesionalisme**: Meningkatkan imej PERKESO dengan penggunaan teknologi digital di lapangan.

---

**Kesimpulan:**
Sistem QR OPS bukan sekadar alat merekod, tetapi satu transformasi cara kerja Skuad OPS Kesan ke arah yang lebih efisien, telus, dan digital.
