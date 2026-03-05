<?php
/* Allow requests from your frontend */
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

/* Only handle POST requests */
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

/* Get the data sent from fetch() in script.js */
$data    = json_decode(file_get_contents("php://input"), true);
$name    = htmlspecialchars(trim($data["fullName"] ?? ""));
$email   = htmlspecialchars(trim($data["email"] ?? ""));
$message = htmlspecialchars(trim($data["message"] ?? ""));

/* Basic validation */
if (!$name || !$email || !$message) {
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

/* ── Save to MySQL database ── */
$host   = "localhost";
$dbUser = "root";
$dbPass = "";           /* blank for XAMPP */
$dbName = "portfolio_db";

$conn = new mysqli($host, $dbUser, $dbPass, $dbName);

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO messages (full_name, email, message) VALUES (?, ?, ?)"
);
$stmt->bind_param("sss", $name, $email, $message);

if (!$stmt->execute()) {
    echo json_encode(["error" => "Failed to save message"]);
    $stmt->close();
    $conn->close();
    exit;
}

$stmt->close();
$conn->close();

/* ── Send email notification (optional) ── */
$to      = "anubhatta63@gmail.com";
$subject = "New Portfolio Message from $name";
$body    = "Name: $name\nEmail: $email\n\nMessage:\n$message";
$headers = "From: $email\r\nReply-To: $email";

mail($to, $subject, $body, $headers);
/* Note: mail() works on live hosting. On XAMPP locally it may not send
   but the message will still be saved to your database. */

echo json_encode(["success" => true, "message" => "Message received!"]);
?>