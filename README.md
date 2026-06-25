# Cafe Soft POS

Web aplikasi cafe bergaya ERIC.CO memakai Next.js App Router, Tailwind CSS, Animate.css, JavaScript, REST API, bcrypt, dan MariaDB.

## Fitur

- Landing page ERIC.CO seperti contoh referensi.
- Customer tanpa login di `/customer` untuk pesan Dine In atau Take Away.
- QR meja dan katalog menu yang bisa dicetak.
- Kasir login untuk transaksi tunai dan non tunai, termasuk hitung kembalian otomatis.
- Admin login untuk input, edit, dan hapus menu beserta thumbnail.
- Developer login untuk melihat status sistem dan daftar endpoint REST.
- Dashboard dengan grafik order harian, grafik pendapatan, dan filter tanggal Flatpickr.
- MariaDB lewat file import `database/cafe_app.sql`.
- Data sensitif lewat `.env`.

## Jalankan

```bash
npm install
cp .env.example .env
npm run dev
```

Buka `http://localhost:3000` untuk landing page, atau `http://localhost:3000/customer` untuk menu digital.

Jika MariaDB belum disiapkan, aplikasi otomatis memakai mode demo dalam memori agar UI dan alur transaksi tetap bisa dicoba.

## Import Database

```bash
mysql -u root -p < database/cafe_app.sql
```

Sesuaikan `.env`:

```bash
APP_SECRET=ganti-dengan-secret-panjang
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=cafe_soft_pos
```

## Akun Demo

| Role | Username | Password |
| --- | --- | --- |
| Kasir | `kasir` | `kasir123` |
| Admin | `admin` | `admin123` |
| Developer | `developer` | `dev123` |

## Endpoint REST

- `GET /api/menu`
- `POST /api/menu`
- `PUT /api/menu/[id]`
- `DELETE /api/menu/[id]`
- `GET /api/orders`
- `POST /api/orders`
- `PUT /api/orders/[id]`
- `DELETE /api/orders/[id]`
- `GET /api/payments`
- `POST /api/payments`
- `GET /api/dashboard`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
