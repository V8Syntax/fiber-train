<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_role('supervisor');

$id = (int) ($_GET['id'] ?? 0);
$stmt = $pdo->prepare('DELETE FROM questions WHERE id = ?');
$stmt->execute([$id]);
flash('success', 'Question deleted.');
redirect('questions.php');
