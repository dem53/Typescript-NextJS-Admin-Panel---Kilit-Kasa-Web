## Proje Hakkında

Bu proje, **Next.js (frontend)** ve **Node.js/Express + TypeScript (backend)** kullanan tam yığın bir web uygulamasıdır.  
Kullanıcılar ürünleri listeleyip sepete ekleyebilir, misafir olarak sepet tutabilir, admin iş görevi ekleyebilir, personeller iş takibi yapabilir,
kullanıcı rollerine göre yetkilendirmeler değişebilir. (iş takibi, sipariş takibi, ürün yönetimi, genel arayüz ve raporlama, iletişim istekleri, tüm kullanıcı ayarları)

- **Frontend**: `frontend/` (Next.js 16, React 19, Tailwind CSS)
- **Backend**: `backend/` (Express 5, TypeScript, MongoDB/Mongoose)

---

## Klasör Yapısı

- **`backend/`**: REST API, auth, sepet ve sipariş işlemleri
  - `src/server.ts` – Express sunucu başlangıç dosyası
  - `src/config/dataBase.ts` – MongoDB bağlantı ayarları
  - `src/models/` – Mongoose modelleri (`User`, `Product`, `Cart`, `Order`, `Job` vb.)
  - `src/controllers/` – İş mantığı (`cartControllers`, `orderControllers`, `jobControllers` vb.)
  - `src/routes/` – Express route tanımları
  - `src/middleware/` – Auth ve diğer middleware'ler

- **`frontend/`**: Next.js uygulaması
  - `app/` – Route ve sayfa yapısı (örn: `app/sepetim`, `app/urunlerimiz`)
  - `app/components/` – UI bileşenleri (`Header`, `OrderCreateForm`, `InfoBox` vb.)
  - `app/services/` – API servisleri (`cartServices`, `apiCartFetch` vb.)
  - `app/context/` – Global context’ler (`AuthContext` vb.)

---

## Kurulum

Projeyi klonladıktan sonra kök klasörde hem **backend** hem **frontend** için bağımlılıkları kurmanız gerekir.

```bash
# Klasöre gir
cd web - www

# Backend bağımlılıkları
cd backend
npm install

# Frontend bağımlılıkları
cd ../frontend
npm install
```

---

## Gerekli Ortam Değişkenleri

Backend için `backend/.env` dosyasında en az şu değişkenler tanımlanmalıdır:

```env
MONGO_LOCAL_URI=mongodb://localhost:27017/webgelistirme
JWT_SECRET=super-secret-key
PORT=8000
NODE_ENV= production veya development `Geliştirme ve Sunucuda çalışım ayrım yapmak için`
```

Frontend için isteğe bağlı olarak `.env.local` içinde backend URL’si vb. tanımlanabilir:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

(Port ve path, senin backend konfigürasyona göre değişebilir.)

---

## Backend Çalıştırma

```bash
cd backend

# Geliştirme
npm run dev

# TypeScript derleme (isteğe bağlı)
npm run buld

# Prod ortamında (dist üzerinden) çalıştırma
npm start
```

**Özel scriptler**

- `npm run fix-cart-index`  
  Cart koleksiyonundaki `sessionId` index’ini düzeltmek ve `null`/hatalı kayıtları temizlemek için kullanılır.

---

## Frontend Çalıştırma

```bash
cd frontend

# Geliştirme
npm run dev

# Prod build
npm run build

# Prod server
npm start
```

Backend sunucusu port `8000` üzerinde çalışmaktadır. .env'de PORT tanımlayabilirsiniz.

Varsayılan olarak Next.js uygulaması `http://localhost:3000` üzerinde çalışır.

---

## Öne Çıkan Özellikler

- **Misafir sepet + kullanıcı sepeti birleştirme**
  - `x-session-id` header’ı üzerinden misafir sepeti tutulur.
  - Kullanıcı giriş yaptığında, misafir sepeti ile kullanıcı sepeti backend’de birleştirilir.

- **Sepet yönetimi**
  - Ürün ekleme / miktar güncelleme / kaldırma / sepeti temizleme
  - Stok ve satış durumu (isSelling) kontrolü
  - Stok/satış durumu değiştiğinde sepet, backend’de otomatik güncellenir.
  - Frontend’de `CartContent` bileşeninde, sepet güncellendiğinde uyarı InfoBox/Modal gösterilir.

- **Sipariş oluşturma**
  - `OrderCreateForm` ile sepet üzerinden sipariş akışı

---

## Geliştirme Notları

- **Backend**
  - TypeScript ile yazılmıştır; tip güvenliği için model ve controller katmanında arayüzler kullanılır.
  - Mongoose ile MongoDB üzerinde şema ve index’ler yönetilir.
  - Auth için JWT, şifreleme için `bcryptjs` kullanılır.

- **Frontend**
  - Next.js `app/` router yapısı kullanılır.
  - API istekleri `app/services` altından yönetilir (`cartServices`, `apiCartFetch`).
  - Global sepet uzunluğu vb. bilgiler `AuthContext` üzerinden güncellenir.

---

## Çalışma Sırası (Öneri)

1. **MongoDB’yi başlat** (lokalde `webgelistirme` veritabanı)
2. `backend/.env` ve gerekliyse `frontend/.env.local` dosyalarını doldur
3. `backend` içinde:
   - `npm install`
   - `npm run dev`
4. `frontend` içinde:
   - `npm install`
   - `npm run dev`
5. Tarayıcıdan `http://localhost:3000` adresine git ve uygulamayı kullan

---


