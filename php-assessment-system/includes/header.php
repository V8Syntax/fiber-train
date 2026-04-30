<?php
require_once __DIR__ . '/functions.php';
$user = current_user();
$scriptName = $_SERVER['SCRIPT_NAME'];
$base = (strpos($scriptName, '/supervisor/') !== false || strpos($scriptName, '/trainer/') !== false) ? '../' : '';
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Trainer Assessment System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="<?= $base ?>assets/css/style.css" rel="stylesheet">
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
    <div class="container">
        <a class="navbar-brand fw-bold" href="<?= $base ?>index.php">Trainer Assessment</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav ms-auto">
                <?php if (!$user): ?>
                    <li class="nav-item"><a class="nav-link" href="<?= $base ?>supervisor_signup.php">Supervisor Sign Up</a></li>
                    <li class="nav-item"><a class="nav-link" href="<?= $base ?>supervisor_login.php">Supervisor Login</a></li>
                    <li class="nav-item"><a class="nav-link" href="<?= $base ?>trainer_login.php">Trainer Login</a></li>
                <?php elseif ($user['role'] === 'supervisor'): ?>
                    <li class="nav-item"><a class="nav-link" href="<?= $base ?>supervisor/dashboard.php">Dashboard</a></li>
                    <li class="nav-item"><a class="nav-link" href="<?= $base ?>supervisor/questions.php">Questions</a></li>
                    <li class="nav-item"><a class="nav-link" href="<?= $base ?>supervisor/create_assessment.php">Assessments</a></li>
                    <li class="nav-item"><a class="nav-link" href="<?= $base ?>supervisor/results.php">Results</a></li>
                    <li class="nav-item"><a class="nav-link" href="<?= $base ?>logout.php">Logout</a></li>
                <?php else: ?>
                    <li class="nav-item"><a class="nav-link" href="<?= $base ?>trainer/dashboard.php">Dashboard</a></li>
                    <li class="nav-item"><a class="nav-link" href="<?= $base ?>trainer/feedback.php">Feedback</a></li>
                    <li class="nav-item"><a class="nav-link" href="<?= $base ?>logout.php">Logout</a></li>
                <?php endif; ?>
            </ul>
        </div>
    </div>
</nav>
<main class="py-4">
    <div class="container">
        <?php show_flash(); ?>
