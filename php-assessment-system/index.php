<?php require_once __DIR__ . '/includes/header.php'; ?>

<section class="hero mb-4">
    <div class="row align-items-center g-4">
        <div class="col-lg-7">
            <p class="text-uppercase small fw-semibold mb-2">Supervisor and Trainer Assessment Platform</p>
            <h1 class="display-5 fw-bold">Evaluate trainers, review answers, and turn mistakes into learning.</h1>
            <p class="lead mb-4">A complete PHP and MySQL web app for creating MCQ and descriptive assessments, automatic scoring, manual review, and detailed trainer feedback.</p>
            <div class="d-flex flex-wrap gap-2">
                <a href="supervisor_login.php" class="btn btn-light btn-lg">Supervisor Login</a>
                <a href="trainer_login.php" class="btn btn-outline-light btn-lg">Trainer Login</a>
            </div>
        </div>
        <div class="col-lg-5">
            <div class="content-card text-dark p-4">
                <h2 class="h5 fw-bold">Demo Accounts</h2>
                <p class="mb-1"><strong>Supervisor:</strong> supervisor@example.com</p>
                <p class="mb-1"><strong>Trainer:</strong> trainer@example.com</p>
                <p class="mb-0"><strong>Password:</strong> password</p>
            </div>
        </div>
    </div>
</section>

<div class="row g-3">
    <div class="col-md-4">
        <div class="stat-card h-100">
            <h2 class="h5">Question Bank</h2>
            <p class="mb-0 text-muted">Create MCQ and descriptive questions with categories, explanations, answer keys, and guidelines.</p>
        </div>
    </div>
    <div class="col-md-4">
        <div class="stat-card h-100">
            <h2 class="h5">Assessment Flow</h2>
            <p class="mb-0 text-muted">Trainers answer assigned assessments and receive automatic MCQ scoring immediately.</p>
        </div>
    </div>
    <div class="col-md-4">
        <div class="stat-card h-100">
            <h2 class="h5">Feedback Review</h2>
            <p class="mb-0 text-muted">Supervisors review descriptive answers and trainers see corrections, explanations, and remarks.</p>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
