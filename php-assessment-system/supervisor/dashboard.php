<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_role('supervisor');

$supervisorId = current_user()['id'];
$totals = [
    'trainers' => $pdo->query('SELECT COUNT(*) FROM trainers')->fetchColumn(),
    'questions' => $pdo->query('SELECT COUNT(*) FROM questions')->fetchColumn(),
    'assessments' => $pdo->query('SELECT COUNT(*) FROM assessments')->fetchColumn(),
    'results' => $pdo->query('SELECT COUNT(*) FROM results')->fetchColumn(),
];

$recent = $pdo->query(
    'SELECT r.*, t.name AS trainer_name, a.title
     FROM results r
     JOIN trainers t ON t.id = r.trainer_id
     JOIN assessments a ON a.id = r.assessment_id
     ORDER BY r.submitted_at DESC LIMIT 6'
)->fetchAll();

require_once __DIR__ . '/../includes/header.php';
?>
<div class="d-flex flex-wrap justify-content-between align-items-center mb-4">
    <div>
        <h1 class="fw-bold">Supervisor Dashboard</h1>
        <p class="text-muted mb-0">Welcome, <?= h(current_user()['name']) ?>. Manage trainers, questions, assessments, and results.</p>
    </div>
    <a class="btn btn-primary" href="add_trainer.php">Add Trainer</a>
</div>

<div class="row g-3 mb-4">
    <?php foreach ($totals as $label => $count): ?>
        <div class="col-md-3">
            <div class="stat-card">
                <div class="text-muted text-capitalize"><?= h($label) ?></div>
                <div class="stat-number"><?= h($count) ?></div>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<div class="row g-3">
    <div class="col-lg-8">
        <div class="content-card p-4">
            <h2 class="h5 fw-bold mb-3">Recent Assessment Activity</h2>
            <div class="table-responsive">
                <table class="table align-middle">
                    <thead><tr><th>Trainer</th><th>Assessment</th><th>Score</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                    <?php foreach ($recent as $row): ?>
                        <tr>
                            <td><?= h($row['trainer_name']) ?></td>
                            <td><?= h($row['title']) ?></td>
                            <td><?= h($row['percentage']) ?>%</td>
                            <td><span class="badge bg-<?= $row['status'] === 'Pass' ? 'success' : ($row['status'] === 'Fail' ? 'danger' : 'warning') ?>"><?= h($row['status']) ?></span></td>
                            <td><?= h($row['submitted_at']) ?></td>
                        </tr>
                    <?php endforeach; ?>
                    <?php if (!$recent): ?>
                        <tr><td colspan="5" class="text-muted">No results submitted yet.</td></tr>
                    <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="col-lg-4">
        <div class="content-card p-4">
            <h2 class="h5 fw-bold mb-3">Quick Actions</h2>
            <div class="d-grid gap-2">
                <a class="btn btn-outline-primary" href="questions.php">Manage Questions</a>
                <a class="btn btn-outline-primary" href="add_question.php">Add Question</a>
                <a class="btn btn-outline-primary" href="create_assessment.php">Create Assessment</a>
                <a class="btn btn-outline-primary" href="results.php">View Results</a>
                <a class="btn btn-outline-primary" href="report.php">Performance Report</a>
            </div>
        </div>
    </div>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
