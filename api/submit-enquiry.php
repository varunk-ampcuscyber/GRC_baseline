<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.',
    ]);
    exit;
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw ?: '', true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON payload.',
    ]);
    exit;
}

$fields = [
    'fname' => trim((string)($payload['fname'] ?? '')),
    'lname' => trim((string)($payload['lname'] ?? '')),
    'email' => trim((string)($payload['email'] ?? '')),
    'phone' => trim((string)($payload['phone'] ?? '')),
    'company' => trim((string)($payload['company'] ?? '')),
    'designation' => trim((string)($payload['designation'] ?? '')),
    'interest' => trim((string)($payload['interest'] ?? '')),
    'message' => trim((string)($payload['message'] ?? '')),
];

$patterns = [
    'fname' => "/^[A-Za-z][A-Za-z\\s'-]{1,49}$/",
    'lname' => "/^[A-Za-z][A-Za-z\\s'-]{1,49}$/",
    'email' => '/^(?=.{6,100}$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/',
    'phone' => '/^(?:\+?\d{1,3})?[6-9]\d{9}$/',
    'company' => "/^[A-Za-z0-9][A-Za-z0-9\\s&.,'()-]{1,99}$/",
    'designation' => "/^[A-Za-z][A-Za-z\\s&.,'()\/-]{1,79}$/",
    'interest' => '/^(delegate|vip|speaking|sponsorship|media|other)$/',
    'message' => '/^[\s\S]{20,1000}$/',
];

$messages = [
    'fname' => 'First name must be 2-50 characters (letters only).',
    'lname' => 'Last name must be 2-50 characters (letters only).',
    'email' => 'Enter a valid work email address.',
    'phone' => 'Enter a valid phone number (10 digits, optional country code).',
    'company' => 'Company name must be 2-100 characters.',
    'designation' => 'Designation must be 2-80 characters.',
    'interest' => 'Please select a valid interest option.',
    'message' => 'Message must be between 20 and 1000 characters.',
];

$errors = [];

foreach ($fields as $key => $value) {
    if ($value === '') {
        $errors[$key] = 'This field is required.';
        continue;
    }

    if (!preg_match($patterns[$key], $value)) {
        $errors[$key] = $messages[$key];
    }
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed.',
        'errors' => $errors,
    ]);
    exit;
}

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Enquiry submitted successfully.',
]);
