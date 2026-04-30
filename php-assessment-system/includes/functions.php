<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function h($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function redirect($path)
{
    header("Location: {$path}");
    exit;
}

function flash($type, $message)
{
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

function show_flash()
{
    if (!isset($_SESSION['flash'])) {
        return;
    }

    $flash = $_SESSION['flash'];
    unset($_SESSION['flash']);
    echo '<div class="alert alert-' . h($flash['type']) . ' alert-dismissible fade show" role="alert">';
    echo h($flash['message']);
    echo '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
    echo '</div>';
}

function current_user()
{
    return $_SESSION['user'] ?? null;
}

function require_role($role)
{
    $user = current_user();
    if (!$user || $user['role'] !== $role) {
        redirect('../index.php');
    }
}

function login_user($id, $name, $role)
{
    session_regenerate_id(true);
    $_SESSION['user'] = [
        'id' => $id,
        'name' => $name,
        'role' => $role,
    ];
}

function logout_user()
{
    $_SESSION = [];
    session_destroy();
}

function result_status($percentage, $passPercentage)
{
    return $percentage >= $passPercentage ? 'Pass' : 'Fail';
}

function short_text($value, $length = 90)
{
    $value = (string) $value;
    return strlen($value) > $length ? substr($value, 0, $length) . '...' : $value;
}
