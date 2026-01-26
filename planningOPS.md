BAHAGIAN 1: DOKUMEN PLANNING (Untuk Bacaan & Analisis)
Nama Projek: Sistem Pengurusan Ops Kesan Digital (Kod Projek: QR-KENINGAU) Objektif: Menggantikan sistem pelekat fizikal manual dengan sistem QR unik (UUID) yang menyokong sejarah lawatan berpusat dan pelaporan masa nyata.

1. Konsep Operasi (The Logic Flow)
Sistem ini beroperasi menggunakan logik "Reverse-Binding":

Cetak Dahulu: QR Code dicetak kosong. Ia hanya mengandungi UUID (contoh: uuid-12345) yang belum wujud dalam database.

Lekat & Imbas: Semasa Ops, pemeriksa lekat dan imbas.

Semakan Pintar (Smart Routing):

Senario A (QR Baru): Database tiada rekod uuid-12345 -> Redirect ke Borang Pendaftaran Baru.

Senario B (QR Lama): Database ada rekod -> Redirect ke Dashboard Premis (papar sejarah lama & butang lawatan baru).

2. Struktur Data (Schema Architecture)
Sistem memerlukan pangkalan data perhubungan (Relational DB):

Table premis: Menyimpan data statik (ID QR, Nama Kedai, No Lot, Status Daftar Perkeso, Koordinat GPS).

Table lawatan: Menyimpan data dinamik (ID Premis, ID Pemeriksa, Tarikh, Status Ops [Patuh/Kompoun/Lawat Semula], Catatan).

Table users: Profil pemeriksa (untuk audit trail siapa yang scan).

3. Keperluan Laporan & Pemantauan
Admin perlu melihat:

Peta taburan Ops Kesan (berdasarkan koordinat scan).

Senarai premis yang perlu "Dilawat Semula" (highlight kuning/merah).

Statistik harian (Jumlah Patuh vs Kompoun).