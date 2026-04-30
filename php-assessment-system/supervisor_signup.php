<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($name === '' || $email === '' || strlen($password) < 6) {
        flash('danger', 'Enter name, email, and a password with at least 6 characters.');
    } else {
        try {
            $stmt = $pdo->prepare('INSERT INTO supervisors (name, email, password) VALUES (?, ?, ?)');
            $stmt->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT)]);
            flash('success', 'Supervisor account created. Please log in.');
            redirect('supervisor_login.php');
        } catch (PDOException $e) {
            flash('danger', 'This supervisor email is already registered.');
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>
<div class="row justify-content-center">
    <div class="col-lg-5">
        <div class="content-card p-4">
            <h1 class="h3 fw-bold mb-3">Supervisor Sign Up</h1>
            <form method="post">
                <label class="form-label">Full Name</label>
                <input class="form-control mb-3" name="name" required>
                <label class="form-label">Email</label>
                <input class="form-control mb-3" type="email" name="email" required>
                <label class="form-label">Password</label>
                <input class="form-control mb-3" type="password" name="password" minlength="6" required>
                <button class="btn btn-primary w-100">Create Supervisor Account</button>
            </form>
        </div>
    </div>
</div>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
