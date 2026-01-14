# Task Performance System

Bitirme projesi kapsamında geliştirilen, görev atama, ilerleme takibi, performans puanlama ve raporlama özellikleri sunan web tabanlı bir görev yönetimi ve çalışan performans ölçüm sistemidir. Sistem, modüler ve genişletilebilir bir mimariyle tasarlanmıştır.

## 📋 İçindekiler

- [Özellikler](#özellikler)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Kurulum](#kurulum)
- [Yapılandırma](#yapılandırma)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [Kullanım](#kullanım)
- [Proje Yapısı](#proje-yapısı)
- [Önemli Notlar](#önemli-notlar)

## ✨ Özellikler

### 🔐 Kimlik Doğrulama ve Yetkilendirme

- JWT tabanlı güvenli authentication sistemi
- Kullanıcı kayıt ve giriş işlemleri
- Token bazlı oturum yönetimi
- Otomatik token yenileme ve güvenli çıkış

### 📊 Proje Yönetimi

- Çoklu proje desteği
- Proje oluşturma ve yönetimi
- Proje liderliği sistemi (sadece proje sahibi üye davet edebilir)
- Kullanıcılar sadece üyesi oldukları projeleri görebilir
- Proje bazlı görev ve takım organizasyonu

### 👥 Takım ve Davet Sistemi

- Email bazlı takım üyesi davet etme
- Gerçek zamanlı davet bildirimleri
- Davet kabul/reddetme mekanizması
- Kabul edilen davetler otomatik olarak kullanıcıyı projeye ekler
- Proje bazlı takım üyesi listeleme
- Her üyenin görev istatistikleri

### 📈 Dashboard ve Raporlama

- Proje bazlı dashboard
- Gerçek zamanlı görev istatistikleri
  - Toplam görev sayısı
  - Devam eden görevler
  - Tamamlanan görevler
  - Takım üyesi sayısı
- Performans metrikleri
- Filtrelenebilir raporlar

### 🎯 Görev Yönetimi

- Görev oluşturma, düzenleme ve silme
- Görev durumu takibi (pending, in-progress, completed)
- Görev öncelik seviyeleri
- Görev atama ve takibi
- Proje bazlı görev filtreleme

## 🛠 Teknoloji Yığını

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL veritabanı
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment variable management

### Frontend

- **React 19.2.0** - UI kütüphanesi
- **Vite 7.2.4** - Build tool ve dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **CSS Modules** - Component-scoped styling
- **Context API** - State management

## 🚀 Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- MongoDB (v6 veya üzeri)
- npm veya yarn

### 1. Repository'yi Klonlayın

```bash
git clone <repository-url>
cd task-performance-system
```

### 2. Backend Kurulumu

```bash
cd backend
npm install
```

#### Backend .env Dosyası

`backend` klasöründe `.env` dosyası oluşturun:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-performance-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

#### MongoDB'yi Başlatın

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongodb
```

#### Backend'i Çalıştırın

```bash
npm run dev
# veya
node index.js
```

Backend `http://localhost:5000` adresinde çalışacaktır.

### 3. Frontend Kurulumu

```bash
cd frontend
npm install
```

#### Frontend'i Çalıştırın

```bash
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacaktır.

## ⚙️ Yapılandırma

### Backend Environment Variables

| Variable    | Açıklama                     | Varsayılan                                        |
| ----------- | ---------------------------- | ------------------------------------------------- |
| PORT        | Backend port numarası        | 5000                                              |
| MONGODB_URI | MongoDB bağlantı string'i    | mongodb://localhost:27017/task-performance-system |
| JWT_SECRET  | JWT token şifreleme anahtarı | - (zorunlu)                                       |
| NODE_ENV    | Çalışma ortamı               | development                                       |

### Frontend Yapılandırması

API base URL: `frontend/src/services/api.js` dosyasında tanımlıdır:

```javascript
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});
```

## 📡 API Dokümantasyonu

### Authentication Endpoints

#### POST /api/auth/register

Yeni kullanıcı kaydı

```json
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "success": true,
  "token": "jwt-token",
  "user": { "_id": "...", "name": "...", "email": "..." }
}
```

#### POST /api/auth/login

Kullanıcı girişi

```json
Request Body:
{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "success": true,
  "token": "jwt-token",
  "user": { "_id": "...", "name": "...", "email": "..." }
}
```

#### GET /api/auth/me

Mevcut kullanıcı bilgileri (Requires Auth)

```json
Headers: { "Authorization": "Bearer <token>" }

Response:
{
  "success": true,
  "data": { "_id": "...", "name": "...", "email": "..." }
}
```

### Project Endpoints

#### GET /api/projects

Kullanıcının üyesi olduğu projeleri listele (Requires Auth)

```json
Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Project Name",
      "description": "Project Description",
      "createdBy": { "_id": "...", "name": "...", "email": "..." },
      "members": ["userId1", "userId2"],
      "createdAt": "2026-01-14T10:00:00.000Z"
    }
  ]
}
```

#### POST /api/projects

Yeni proje oluştur (Requires Auth)

```json
Request Body:
{
  "name": "New Project",
  "description": "Project description"
}

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "New Project",
    "description": "Project description",
    "createdBy": "userId",
    "members": ["userId"]
  }
}
```

### Invitation Endpoints

#### POST /api/invitations

Kullanıcıyı projeye davet et (Requires Auth, Only Project Leader)

```json
Request Body:
{
  "email": "user@example.com",
  "projectId": "projectId"
}

Response:
{
  "_id": "...",
  "email": "user@example.com",
  "projectId": { "_id": "...", "name": "..." },
  "invitedBy": { "_id": "...", "name": "...", "email": "..." },
  "status": "pending",
  "createdAt": "2026-01-14T10:00:00.000Z"
}
```

#### GET /api/invitations/my

Kullanıcının bekleyen davetlerini listele (Requires Auth)

```json
Response:
[
  {
    "_id": "...",
    "email": "user@example.com",
    "projectId": { "_id": "...", "name": "..." },
    "invitedBy": { "_id": "...", "name": "..." },
    "status": "pending",
    "createdAt": "2026-01-14T10:00:00.000Z"
  }
]
```

#### POST /api/invitations/:id/accept

Daveti kabul et (Requires Auth)

```json
Response:
{
  "invitation": { ... },
  "project": {
    "_id": "...",
    "name": "...",
    "description": "...",
    "members": [...]
  }
}
```

#### POST /api/invitations/:id/reject

Daveti reddet (Requires Auth)

```json
Response:
{
  "_id": "...",
  "status": "rejected",
  ...
}
```

### Task Endpoints

#### GET /api/tasks?projectId=xxx

Projeye ait görevleri listele (Requires Auth)

#### POST /api/tasks

Yeni görev oluştur (Requires Auth)

### User Endpoints

#### GET /api/users

Kullanıcıları listele (Requires Auth)

#### GET /api/users/:id

Kullanıcı detaylarını getir (Requires Auth)

## 💻 Kullanım

### 1. Kayıt ve Giriş

1. Uygulamayı açın: `http://localhost:5173`
2. "Register" sayfasından yeni hesap oluşturun
3. Email ve şifre ile giriş yapın

### 2. Proje Oluşturma

1. Dashboard'da "+ Proje Oluştur" butonuna tıklayın
2. Proje adı ve açıklama girin
3. Proje otomatik olarak oluşturulur ve sizin aktif projeniz olur

### 3. Takım Üyesi Davet Etme

1. "Team" sayfasına gidin
2. "+ Üye Ekle" butonuna tıklayın (sadece proje lideri görür)
3. Davet edilecek kişinin email adresini girin
4. Davet gönderilir

### 4. Davet Kabul Etme

1. Sağ üstteki bildirim ikonuna tıklayın
2. Bekleyen davetleri görün
3. ✓ ile kabul edin veya ✕ ile reddedin
4. Kabul edilen proje otomatik olarak proje listenize eklenir

### 5. Dashboard Kullanımı

1. Üst bardaki proje sekmelerinden projeyi seçin
2. Dashboard otomatik olarak seçili projeye göre güncellenir
3. Görev istatistiklerini görüntüleyin

## 📁 Proje Yapısı

```
task-performance-system/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB bağlantı yapılandırması
│   ├── controllers/
│   │   ├── authController.js    # Auth işlemleri
│   │   ├── projectController.js # Proje CRUD
│   │   ├── taskController.js    # Görev CRUD
│   │   ├── userController.js    # Kullanıcı işlemleri
│   │   └── invitationController.js # Davet sistemi
│   ├── middleware/
│   │   └── auth.js              # JWT doğrulama middleware
│   ├── models/
│   │   ├── User.js              # Kullanıcı şeması
│   │   ├── Project.js           # Proje şeması
│   │   ├── Task.js              # Görev şeması
│   │   └── Invitation.js        # Davet şeması
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoint'leri
│   │   ├── projectRoutes.js     # Proje endpoint'leri
│   │   ├── taskRoutes.js        # Görev endpoint'leri
│   │   ├── userRoutes.js        # Kullanıcı endpoint'leri
│   │   └── invitationRoutes.js  # Davet endpoint'leri
│   ├── .env                     # Environment variables
│   ├── index.js                 # Ana server dosyası
│   └── package.json
│
├── frontend/
│   ├── public/                  # Static dosyalar
│   ├── src/
│   │   ├── assets/              # Görseller ve static kaynaklar
│   │   ├── components/
│   │   │   ├── Dashboard.jsx    # Dashboard sayfası
│   │   │   ├── TaskBoard.jsx    # Görev tahtası
│   │   │   ├── Team.jsx         # Takım sayfası
│   │   │   ├── Reports.jsx      # Raporlar sayfası
│   │   │   ├── Login.jsx        # Giriş sayfası
│   │   │   ├── Register.jsx     # Kayıt sayfası
│   │   │   ├── Sidebar.jsx      # Yan menü
│   │   │   ├── TopBar.jsx       # Üst bar (proje seçici)
│   │   │   ├── MainLayout.jsx   # Ana layout
│   │   │   ├── ProtectedRoute.jsx # Route guard
│   │   │   ├── ProjectCreateModal.jsx # Proje oluşturma modal
│   │   │   ├── InvitationModal.jsx # Davet gönderme modal
│   │   │   └── NotificationPanel.jsx # Bildirim paneli
│   │   ├── context/
│   │   │   ├── AuthProvider.jsx # Auth context
│   │   │   └── useAuth.js       # Auth hook
│   │   ├── services/
│   │   │   ├── api.js           # Axios instance
│   │   │   ├── authService.js   # Auth API çağrıları
│   │   │   ├── projectService.js # Proje API çağrıları
│   │   │   ├── dashboardService.js # Dashboard API
│   │   │   ├── teamService.js   # Takım API
│   │   │   └── invitationService.js # Davet API
│   │   ├── styles/              # CSS dosyaları
│   │   ├── App.jsx              # Ana uygulama component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global stiller
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🔒 Güvenlik Özellikleri

- JWT token ile güvenli authentication
- Password hashing (bcrypt)
- Protected routes (frontend ve backend)
- HTTP-only token yönetimi
- Request interceptor ile otomatik token ekleme
- 401 hatalarında otomatik logout
- Proje bazlı yetkilendirme (sadece üyeler erişebilir)
- Proje liderliği kontrolü (sadece leader davet edebilir)

## 📝 Önemli Notlar

### Proje Bazlı Mimari

- Tüm işlemler proje bazlıdır
- Kullanıcılar sadece üyesi oldukları projeleri görebilir
- Dashboard, Team, Tasks sayfaları aktif projeye göre filtrelenir
- Her kullanıcı birden fazla projeye üye olabilir

### Rol ve Yetkilendirme

- **Proje Lideri (createdBy)**: Projeyi oluşturan kişi
  - Takım üyesi davet edebilir
  - Projeyi yönetebilir
- **Proje Üyesi (members)**: Projeye dahil edilen kullanıcılar
  - Görevleri görüntüleyebilir
  - Görev oluşturabilir
  - Davet gönderemez

### Davet Sistemi

- Email bazlı davet gönderimi
- Gerçek zamanlı bildirimler
- Aynı email'e birden fazla pending davet gönderilemez
- Zaten üye olan kullanıcılara davet gönderilemez
- Kabul edilen davetler otomatik olarak kullanıcıyı projeye ekler

### Token Yönetimi

- Token localStorage'da saklanır
- Her request'te otomatik olarak header'a eklenir
- Token süresi dolarsa veya geçersizse otomatik logout
- Login/Register sonrası otomatik yönlendirme

## 🐛 Bilinen Sorunlar ve Çözümler

### MongoDB Bağlantı Hatası

```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Çözüm**: MongoDB servisinin çalıştığından emin olun:

```bash
mongod
```

### CORS Hatası

Backend `cors` middleware'i aktif. Farklı bir port kullanıyorsanız `backend/index.js` dosyasındaki CORS yapılandırmasını güncelleyin.

### Port Çakışması

Backend veya frontend portları kullanımdaysa `.env` dosyasında veya vite config'de port değiştirin.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje bitirme projesi kapsamında geliştirilmiştir.

## 📧 İletişim

Sorularınız için issue açabilirsiniz.
