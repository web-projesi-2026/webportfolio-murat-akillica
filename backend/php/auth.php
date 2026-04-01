<?php
/**
 * auth.php – Kullanıcı Kayıt ve Giriş İşlemleri
 * MySQL veritabanı bağlantısı gerektirir.
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// ===== VERİTABANI AYARLARI =====
// Bu bilgileri kendi XAMPP ayarlarınıza göre düzenleyin!
define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // XAMPP varsayılan
define('DB_PASS', '');            // XAMPP varsayılan (boş)
define('DB_NAME', 'portfolio_db');
define('DB_CHARSET', 'utf8mb4');

// ===== VERİTABANI BAĞLANTISI =====
function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Veritabanı bağlantı hatası: ' . $e->getMessage()]);
            exit;
        }
    }
    return $pdo;
}

// ===== YARDIMCI FONKSİYONLAR =====
function respond(bool $success, string $message, array $extra = []): void {
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $extra));
    exit;
}

function sanitize(string $value): string {
    return trim(htmlspecialchars($value, ENT_QUOTES, 'UTF-8'));
}

function isValidEmail(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// ===== TABLOYU OLUŞTUR (İlk çalıştırmada otomatik) =====
function createTableIfNotExists(): void {
    $pdo = getDB();
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            name        VARCHAR(100)  NOT NULL,
            email       VARCHAR(150)  NOT NULL UNIQUE,
            password    VARCHAR(255)  NOT NULL,
            role        ENUM('user','admin') NOT NULL DEFAULT 'user',
            created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
}

// ===== KAYIT =====
function registerUser(): void {
    $name     = sanitize($_POST['name']     ?? '');
    $email    = sanitize($_POST['email']    ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($name) || empty($email) || empty($password)) {
        respond(false, 'Tüm alanlar zorunludur.');
    }
    if (!isValidEmail($email)) {
        respond(false, 'Geçersiz e-posta adresi.');
    }
    if (strlen($password) < 6) {
        respond(false, 'Şifre en az 6 karakter olmalıdır.');
    }
    if (strlen($name) > 100) {
        respond(false, 'İsim çok uzun.');
    }

    createTableIfNotExists();
    $pdo = getDB();

    // E-posta var mı?
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        respond(false, 'Bu e-posta adresi zaten kayıtlı.');
    }

    // Şifreyi hashle
    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $hash]);

    respond(true, 'Kayıt başarılı! Giriş yapabilirsiniz.', ['userId' => $pdo->lastInsertId()]);
}

// ===== GİRİŞ =====
function loginUser(): void {
    $email    = sanitize($_POST['email']    ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        respond(false, 'E-posta ve şifre zorunludur.');
    }
    if (!isValidEmail($email)) {
        respond(false, 'Geçersiz e-posta adresi.');
    }

    createTableIfNotExists();
    $pdo = getDB();

    $stmt = $pdo->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        respond(false, 'E-posta veya şifre hatalı.');
    }

    // Şifre yenileme gerekiyor mu?
    if (password_needs_rehash($user['password'], PASSWORD_BCRYPT, ['cost' => 12])) {
        $newHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
        $pdo->prepare("UPDATE users SET password = ? WHERE id = ?")
            ->execute([$newHash, $user['id']]);
    }

    // Session başlat
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION['user_id']   = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_role'] = $user['role'];

    respond(true, 'Giriş başarılı.', [
        'user' => [
            'id'    => (int)$user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'role'  => $user['role'],
        ]
    ]);
}

// ===== ÇIKIŞ =====
function logoutUser(): void {
    if (session_status() === PHP_SESSION_NONE) session_start();
    session_destroy();
    respond(true, 'Çıkış yapıldı.');
}

// ===== OTURUM KONTROL =====
function checkSession(): void {
    if (session_status() === PHP_SESSION_NONE) session_start();
    if (!empty($_SESSION['user_id'])) {
        respond(true, 'Oturum aktif.', ['userId' => $_SESSION['user_id'], 'userName' => $_SESSION['user_name']]);
    }
    respond(false, 'Oturum yok.');
}

// ===== İSTEK YÖNLENDİRME =====
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Sadece POST istekleri kabul edilir.');
}

$action = sanitize($_POST['action'] ?? '');

match ($action) {
    'register'      => registerUser(),
    'login'         => loginUser(),
    'logout'        => logoutUser(),
    'check_session' => checkSession(),
    default         => respond(false, 'Geçersiz işlem: ' . $action),
};
