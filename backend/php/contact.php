<?php
/**
 * contact.php – İletişim Formu İşlemleri
 */
ob_start(); // Önceki whitespace/BOM çıktısını engelle

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

// ===== AYARLAR =====
define('DB_HOST',    'localhost');
define('DB_USER',    'root');
define('DB_PASS',    '');
define('DB_NAME',    'portfolio_db');
define('DB_CHARSET', 'utf8mb4');

// Mail ayarları (SMTP kullanmak için PHPMailer kurmanız önerilir)
define('MAIL_TO',      'muratakillica@gmail.com');   // Kendi e-postanız
define('MAIL_FROM',    'muratakillica@gmail.com'); // Gönderen adresi
define('MAIL_SUBJECT', 'Portfolio – Yeni İletişim Mesajı');

// ===== VERİTABANI =====
function getDB(): ?PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } catch (PDOException $e) {
            return null;
        }
    }
    return $pdo;
}

function respond(bool $success, string $message): void {
    ob_clean(); // önceki çıktıları temizle
    echo json_encode(['success' => $success, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function sanitize(string $value): string {
    return trim(htmlspecialchars($value, ENT_QUOTES, 'UTF-8'));
}

// ===== MESAJ TABLOSUNU OLUŞTUR =====
function createMessagesTable(?PDO $pdo): void {
    if (!$pdo) return;
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS messages (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            name        VARCHAR(100)  NOT NULL,
            email       VARCHAR(150)  NOT NULL,
            subject     VARCHAR(200)  DEFAULT NULL,
            message     TEXT          NOT NULL,
            ip_address  VARCHAR(45)   DEFAULT NULL,
            is_read     TINYINT(1)    NOT NULL DEFAULT 0,
            created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
}

// ===== VERİTABANINA KAYDET =====
function saveToDatabase(PDO $pdo, string $name, string $email, string $subject, string $message): bool {
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? null;
        $stmt = $pdo->prepare("
            INSERT INTO messages (name, email, subject, message, ip_address)
            VALUES (?, ?, ?, ?, ?)
        ");
        return $stmt->execute([$name, $email, $subject, $message, $ip]);
    } catch (PDOException $e) {
        return false;
    }
}

// ===== MAİL GÖNDER =====
function sendEmail(string $name, string $email, string $subject, string $message): bool {
    $mailSubject = MAIL_SUBJECT . ($subject ? " – $subject" : '');
    $safeEmail   = filter_var($email, FILTER_SANITIZE_EMAIL);

    $body = "=== Portfolio İletişim Formu ===\n\n";
    $body .= "Ad Soyad : $name\n";
    $body .= "E-posta  : $safeEmail\n";
    $body .= "Konu     : $subject\n";
    $body .= "Tarih    : " . date('d.m.Y H:i') . "\n";
    $body .= "\n--- Mesaj ---\n$message\n";

    $headers  = "From: $name <" . MAIL_FROM . ">\r\n";
    $headers .= "Reply-To: $safeEmail\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    return mail(MAIL_TO, '=?UTF-8?B?' . base64_encode($mailSubject) . '?=', $body, $headers);
}

// ===== ANA İŞLEM =====
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Sadece POST istekleri kabul edilir.');
}

$name    = sanitize($_POST['name']    ?? '');
$email   = sanitize($_POST['email']   ?? '');
$subject = sanitize($_POST['subject'] ?? '');
$message = sanitize($_POST['message'] ?? '');

// Doğrulama
if (empty($name) || empty($email) || empty($message)) {
    respond(false, 'Ad, e-posta ve mesaj alanları zorunludur.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Geçerli bir e-posta adresi giriniz.');
}
if (strlen($name) > 100) {
    respond(false, 'İsim çok uzun (maks. 100 karakter).');
}
if (strlen($message) < 10) {
    respond(false, 'Mesaj en az 10 karakter olmalıdır.');
}
if (strlen($message) > 5000) {
    respond(false, 'Mesaj çok uzun (maks. 5000 karakter).');
}

// Spam basit kontrolü
if (preg_match('/<[^>]*>/', $message)) {
    respond(false, 'Mesajınızda HTML etiketleri kullanılamaz.');
}

$dbSaved  = false;
$mailSent = false;

// Veritabanına kaydet
$pdo = getDB();
if ($pdo) {
    createMessagesTable($pdo);
    $dbSaved = saveToDatabase($pdo, $name, $email, $subject, $message);
}

// Mail gönder (başarısız olsa da sorun değil)
$mailSent = sendEmail($name, $email, $subject, $message);

// DB'ye kaydedildiyse başarılı say, mail ikincil
if ($dbSaved) {
    respond(true, 'Mesajınız başarıyla alındı! En kısa sürede yanıt vereceğim.');
} elseif ($mailSent) {
    respond(true, 'Mesajınız mail olarak iletildi!');
} else {
    respond(false, 'Mesaj gönderilemedi. Veritabanı bağlantısını kontrol edin.');
}
