# Murat Akıllıca – Kişisel Portfolio Web Sitesi

## Proje Açıklaması
Bu proje, Murat Akıllıca'nın kişisel portföy web sitesidir. Swift ve Kotlin öğrenerek mobil uygulama geliştirme yolculuğunu, projelerini, blog yazılarını ve iletişim bilgilerini sunan dinamik bir web sitesidir. Modern karanlık/aydınlık tema desteğine sahip, kullanıcı kaydı ve girişi içeren tam kapsamlı bir portfolio projesidir.

## Hedef Kullanıcı
- Murat'ın çalışmalarını incelemek isteyen işverenler ve geliştiriciler
- İşbirliği yapmak isteyen bireyler
- Mobil geliştirme dünyasına adım atmak isteyen öğrenciler

## Temel Özellikler
- **Çoklu Sayfa:** Ana Sayfa, Hakkımda, Projeler, Blog, Hizmetler, İletişim
- **Kullanıcı Sistemi:** Kayıt ol ve giriş yap ekranları (PHP + MySQL + bcrypt)
- **Admin Paneli:** Blog yazıları, projeler, mesajlar ve kullanıcı yönetimi
- **Dark / Light Mode:** Toggle ile anlık tema değiştirme (localStorage ile hatırlama)
- **Proje Filtresi:** iOS, Android, Firebase, SQLite kategorilerine göre filtreleme
- **Blog Filtresi:** Kategori bazlı filtreleme + "Devamını Oku" modal sistemi
- **Yorum Sistemi:** Giriş yapan kullanıcılar yorum bırakabilir
- **İletişim Formu:** Veritabanına kaydeder ve mail gönderir
- **Scroll Reveal:** Sayfa kaydırıldıkça animasyonlu içerik açılımı
- **Responsive Tasarım:** Mobil, tablet ve masaüstü için tamamen uyumlu
- **Proje Detay Modali:** Her proje için açılır detay penceresi
- **Xcode Animasyonu:** Hakkımda sayfasında canlı SwiftUI kod animasyonu

## Kullanılan Teknolojiler
- HTML5, CSS3 (Custom Properties), Vanilla JavaScript (ES6+)
- PHP 8+ (PDO ile MySQL bağlantısı)
- MySQL (XAMPP üzerinden)
- Google Fonts: Syne, DM Sans, JetBrains Mono

## Klasör Yapısı
```
├── index.html              ← Ana Sayfa
├── README.md               ← Bu dosya
│
├── pages/
│   ├── about.html          ← Hakkımda
│   ├── proje.html          ← Projeler
│   ├── blog.html           ← Blog
│   ├── vesaire.html        ← Hizmetler
│   ├── contact.html        ← İletişim
│   ├── login.html          ← Giriş Yap
│   └── register.html       ← Kayıt Ol
│
├── assets/
│   ├── css/
│   │   ├── style.css       ← Ana stiller
│   │   └── responsive.css  ← Responsive stiller
│   ├── js/
│   │   └── main.js         ← Tüm JavaScript
│   └── img/                ← Görseller (manuel eklenecek)
│
├── backend/
│   └── php/
│       ├── auth.php        ← Kayıt / Giriş / Çıkış
│       └── contact.php     ← İletişim formu + mail
│
└── admin/
    └── index.html          ← Admin Paneli
```

## Kurulum

### Gereksinimler
- XAMPP (Apache + MySQL + PHP 8+)
- Modern bir tarayıcı (Chrome, Firefox, Safari)

### Adım Adım Kurulum
1. XAMPP'ı indirip kurun: https://www.apachefriends.org
2. XAMPP Kontrol Paneli'ni açın → Apache ve MySQL'i başlatın
3. Bu klasörü şuraya kopyalayın:
   - **Windows:** `C:\xampp\htdocs\webportfolio-murat-akillica\`
   - **macOS:** `/Applications/XAMPP/htdocs/webportfolio-murat-akillica/`
   - **Linux:** `/opt/lampp/htdocs/webportfolio-murat-akillica/`
4. Tarayıcıda açın: `http://localhost/webportfolio-murat-akillica/`

### Veritabanı Kurulumu
1. Tarayıcıda `http://localhost/phpmyadmin/` adresine gidin
2. Sol üstten **"Yeni"** tıklayın
3. Veritabanı adı: `portfolio_db` — Karşılaştırma: `utf8mb4_unicode_ci`
4. **Oluştur** butonuna tıklayın
5. `users` ve `messages` tabloları ilk kullanımda **otomatik oluşturulur**

### Veritabanı Bağlantı Ayarları
`backend/php/auth.php` ve `backend/php/contact.php` dosyalarını açın:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // MySQL kullanıcı adınız
define('DB_PASS', '');            // XAMPP varsayılan: boş
define('DB_NAME', 'portfolio_db');
```

### Mail Ayarları
`backend/php/contact.php` dosyasında:
```php
define('MAIL_TO',   'muratakillica@gmail.com');
define('MAIL_FROM', 'muratakillica@gmail.com');
```
> Not: Yerel geliştirmede mail gönderimi çalışmayabilir. Gerçek sunucuda test edin.

## GitHub
🐙 https://github.com/muratttcan

## Canlı Link
🌐 Henüz deploy edilmedi — Localhost üzerinde çalışır.
> Canlıya almak için Hostinger, InfinityFree veya cPanel destekli herhangi bir PHP + MySQL hosting'e yükleyebilirsiniz.

---
*©2026 Murat Akıllıca – Tüm Hakları Saklıdır*
