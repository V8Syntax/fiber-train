<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_role('supervisor');

$summary = $pdo->query(
    'SELECT t.name, t.email, COUNT(r.id) AS attempts, AVG(r.percentage) AS average_score, MAX(r.percentage) AS best_score
     FROM trainers t
     LEFT JOIN results r ON r.trainer_id = t.id
     GROUP BY t.id
     ORDER BY average_score DESC'
)->fetchAll();

$topics = $pdo->query(
    'SELECT c.name AS category_name,
            COUNT(ta.id) AS answered,
            SUM(CASE WHEN ta.is_correct = 1 THEN 1 ELSE 0 END) AS correct_answers
     FROM trainer_answers ta
     JOIN questions q ON q.id = ta.question_id
     JOIN question_categories c ON c.id = q.category_id
     GROUP BY c.id
     ORDER BY c.name'
)->fetchAll();

require_once __DIR__ . '/../includes/header.php';
?>
<h1 class="fw-bold mb-3">Trainer Performance Report</h1>
<div class="row g-4">
    <div class="col-lg-7">
        <div class="content-card p-4">
            <h2 class="h5 fw-bold">Trainer Summary</h2>
            <table class="table">
                <thead><tr><th>Trainer</th><th>Attempts</th><th>Average</th><th>Best</th></tr></thead>
                <tbody>
                <?php foreach ($summary as $row): ?>
                    <tr>
                        <td><?= h($row['name']) ?><br><span class="text-muted small"><?= h($row['email']) ?></span></td>
                        <td><?= h($row['attempts']) ?></td>
                        <td><?= $row['average_score'] ? h(round($row['average_score'], 2)) . '%' : 'No data' ?></td>
                        <td><?= $row['best_score'] ? h($row['best_score']) . '%' : 'No data' ?></td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
    <div class="col-lg-5">
        <div class="content-card p-4">
            <h2 class="h5 fw-bold">Topic-wise Performance</h2>
            <?php foreach ($topics as $topic): ?>
                <?php $rate = $topic['answered'] ? round(($topic['correct_answers'] / $topic['answered']) * 100, 2) : 0; ?>
                <div class="mb-3">
                    <div class="d-flex justify-content-between"><span><?= h($topic['category_name']) ?></span><strong><?= h($rate) ?>%</strong></div>
                    <div class="progress"><div class="progress-bar" style="width: <?= h($rate) ?>%"></div></div>
                </div>
            <?php endforeach; ?>
            <?php if (!$topics): ?><p class="text-muted mb-0">No answer data yet.</p><?php endif; ?>
        </div>
    </div>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
