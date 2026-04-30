<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_role('trainer');

$trainerId = current_user()['id'];
$available = $pdo->query("SELECT * FROM assessments WHERE status = 'active' ORDER BY created_at DESC")->fetchAll();

$completedStmt = $pdo->prepare(
    'SELECT r.*, a.title
     FROM results r
     JOIN assessments a ON a.id = r.assessment_id
     WHERE r.trainer_id = ?
     ORDER BY r.submitted_at DESC'
);
$completedStmt->execute([$trainerId]);
$completed = $completedStmt->fetchAll();
$latest = $completed[0] ?? null;

require_once __DIR__ . '/../includes/header.php';
?>
<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h1 class="fw-bold">Trainer Dashboard</h1>
        <p class="text-muted mb-0">Welcome, <?= h(current_user()['name']) ?>. Take assessments and review your feedback.</p>
    </div>
    <a class="btn btn-outline-primary" href="feedback.php">View Feedback</a>
</div>

<div class="row g-3 mb-4">
    <div class="col-md-4"><div class="stat-card"><div class="text-muted">Available Assessments</div><div class="stat-number"><?= count($available) ?></div></div></div>
    <div class="col-md-4"><div class="stat-card"><div class="text-muted">Completed</div><div class="stat-number"><?= count($completed) ?></div></div></div>
    <div class="col-md-4"><div class="stat-card"><div class="text-muted">Latest Score</div><div class="stat-number"><?= $latest ? h($latest['percentage']) . '%' : 'N/A' ?></div></div></div>
</div>

<div class="row g-4">
    <div class="col-lg-7">
        <div class="content-card p-4">
            <h2 class="h5 fw-bold mb-3">Available Assessments</h2>
            <?php foreach ($available as $a): ?>
                <div class="border-bottom py-3 d-flex justify-content-between gap-3 align-items-center">
                    <div>
                        <div class="fw-semibold"><?= h($a['title']) ?></div>
                        <div class="text-muted small"><?= h($a['description']) ?></div>
                        <span class="badge bg-primary">Pass <?= h($a['pass_percentage']) ?>%</span>
                    </div>
                    <a class="btn btn-sm btn-primary" href="take_assessment.php?id=<?= h($a['id']) ?>">Take</a>
                </div>
            <?php endforeach; ?>
            <?php if (!$available): ?><p class="text-muted mb-0">No active assessments are available.</p><?php endif; ?>
        </div>
    </div>
    <div class="col-lg-5">
        <div class="content-card p-4">
            <h2 class="h5 fw-bold mb-3">Completed Assessments</h2>
            <?php foreach (array_slice($completed, 0, 6) as $r): ?>
                <div class="border-bottom py-2 d-flex justify-content-between">
                    <div>
                        <div class="fw-semibold"><?= h($r['title']) ?></div>
                        <span class="text-muted small"><?= h($r['submitted_at']) ?></span>
                    </div>
                    <a href="result.php?id=<?= h($r['id']) ?>" class="btn btn-sm btn-outline-primary"><?= h($r['percentage']) ?>%</a>
                </div>
            <?php endforeach; ?>
            <?php if (!$completed): ?><p class="text-muted mb-0">No completed assessments yet.</p><?php endif; ?>
        </div>
    </div>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
