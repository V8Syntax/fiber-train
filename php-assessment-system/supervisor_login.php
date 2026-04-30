<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    $stmt = $pdo->prepare('SELECT * FROM supervisors WHERE email = ?');
    $stmt->execute([$email]);
    $supervisor = $stmt->fetch();

    if ($supervisor && password_verify($password, $supervisor['password'])) {
        login_user($supervisor['id'], $supervisor['name'], 'supervisor');
        redirect('supervisor/dashboard.php');
    }

    flash('danger', 'Invalid supervisor email or password.');
}

require_once __DIR__ . '/includes/header.php';
?>
<div class="row justify-content-center">
    <div class="col-lg-5">
        <div class="content-card p-4">
            <h1 class="h3 fw-bold mb-3">Supervisor Login</h1>
            <form method="post">
                <label class="form-label">Email</label>
                <input class="form-control mb-3" type="email" name="email" required>
                <label class="form-label">Password</label>
                <input class="form-control mb-3" type="password" name="password" required>
                <button class="btn btn-primary w-100">Login as Supervisor</button>
            </form>
        </div>
    </div>
</div>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
