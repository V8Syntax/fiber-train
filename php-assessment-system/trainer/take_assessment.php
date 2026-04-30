<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_role('trainer');

$assessmentId = (int) ($_GET['id'] ?? 0);
$stmt = $pdo->prepare("SELECT * FROM assessments WHERE id = ? AND status = 'active'");
$stmt->execute([$assessmentId]);
$assessment = $stmt->fetch();
if (!$assessment) {
    flash('danger', 'Assessment not found or not active.');
    redirect('dashboard.php');
}

$questionsStmt = $pdo->prepare(
    'SELECT q.*, aq.marks, c.name AS category_name
     FROM assessment_questions aq
     JOIN questions q ON q.id = aq.question_id
     JOIN question_categories c ON c.id = q.category_id
     WHERE aq.assessment_id = ?
     ORDER BY aq.id'
);
$questionsStmt->execute([$assessmentId]);
$questions = $questionsStmt->fetchAll();

require_once __DIR__ . '/../includes/header.php';
?>
<div class="content-card p-4">
    <h1 class="fw-bold"><?= h($assessment['title']) ?></h1>
    <p class="text-muted"><?= h($assessment['description']) ?></p>
    <form method="post" action="submit_assessment.php">
        <input type="hidden" name="assessment_id" value="<?= h($assessment['id']) ?>">
        <?php foreach ($questions as $index => $q): ?>
            <div class="question-box mb-3">
                <div class="d-flex justify-content-between">
                    <h2 class="h6 fw-bold">Q<?= $index + 1 ?>. <?= h($q['question_text']) ?></h2>
                    <span class="badge bg-secondary"><?= h($q['category_name']) ?> - <?= h($q['marks']) ?> mark(s)</span>
                </div>
                <?php if ($q['question_type'] === 'mcq'): ?>
                    <?php foreach (['A' => 'option_a', 'B' => 'option_b', 'C' => 'option_c', 'D' => 'option_d'] as $letter => $field): ?>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="answer[<?= h($q['id']) ?>]" value="<?= $letter ?>" id="q<?= h($q['id']) ?><?= $letter ?>" required>
                            <label class="form-check-label" for="q<?= h($q['id']) ?><?= $letter ?>"><?= $letter ?>. <?= h($q[$field]) ?></label>
                        </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <textarea class="form-control" name="answer[<?= h($q['id']) ?>]" rows="5" required></textarea>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
        <?php if ($questions): ?>
            <button class="btn btn-primary btn-lg" onclick="return confirm('Submit this assessment?')">Submit Assessment</button>
        <?php else: ?>
            <p class="text-muted">This assessment has no questions.</p>
        <?php endif; ?>
    </form>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
