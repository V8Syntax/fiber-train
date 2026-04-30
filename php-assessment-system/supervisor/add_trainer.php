<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_role('supervisor');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($name === '' || $email === '' || strlen($password) < 6) {
        flash('danger', 'Enter name, email, and a password with at least 6 characters.');
    } else {
        try {
            $stmt = $pdo->prepare('INSERT INTO trainers (supervisor_id, name, email, password) VALUES (?, ?, ?, ?)');
            $stmt->execute([current_user()['id'], $name, $email, password_hash($password, PASSWORD_DEFAULT)]);
            flash('success', 'Trainer account created.');
            redirect('dashboard.php');
        } catch (PDOException $e) {
            flash('danger', 'This trainer email is already registered.');
        }
    }
}

require_once __DIR__ . '/../includes/header.php';
?>
<div class="content-card p-4 col-lg-6 mx-auto">
    <h1 class="h3 fw-bold mb-3">Add Trainer</h1>
    <form method="post">
        <label class="form-label">Trainer Name</label>
        <input class="form-control mb-3" name="name" required>
        <label class="form-label">Trainer Email</label>
        <input class="form-control mb-3" type="email" name="email" required>
        <label class="form-label">Temporary Password</label>
        <input class="form-control mb-3" type="password" name="password" minlength="6" required>
        <button class="btn btn-primary">Create Trainer</button>
    </form>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
