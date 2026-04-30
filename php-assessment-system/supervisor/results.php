<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_role('supervisor');

$results = $pdo->query(
    'SELECT r.*, t.name AS trainer_name, a.title
     FROM results r
     JOIN trainers t ON t.id = r.trainer_id
     JOIN assessments a ON a.id = r.assessment_id
     ORDER BY r.submitted_at DESC'
)->fetchAll();

require_once __DIR__ . '/../includes/header.php';
?>
<h1 class="fw-bold mb-3">View Results</h1>
<div class="content-card p-4">
    <div class="table-responsive">
        <table class="table align-middle">
            <thead><tr><th>Trainer</th><th>Assessment</th><th>Score</th><th>Correct</th><th>Wrong</th><th>Status</th><th>Review</th></tr></thead>
            <tbody>
            <?php foreach ($results as $r): ?>
                <tr>
                    <td><?= h($r['trainer_name']) ?></td>
                    <td><?= h($r['title']) ?></td>
                    <td><?= h($r['percentage']) ?>%</td>
                    <td><?= h($r['correct_count']) ?></td>
                    <td><?= h($r['wrong_count']) ?></td>
                    <td><?= h($r['status']) ?> / <?= h($r['evaluation_status']) ?></td>
                    <td><a class="btn btn-sm btn-outline-primary" href="review_result.php?id=<?= h($r['id']) ?>">Open</a></td>
                </tr>
            <?php endforeach; ?>
            <?php if (!$results): ?><tr><td colspan="7" class="text-muted">No trainer results yet.</td></tr><?php endif; ?>
            </tbody>
        </table>
    </div>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
