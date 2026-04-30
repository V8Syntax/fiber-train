<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_role('trainer');

$trainerId = current_user()['id'];
$feedbackStmt = $pdo->prepare(
    'SELECT ta.*, q.question_text, q.correct_option, q.explanation, a.title
     FROM trainer_answers ta
     JOIN questions q ON q.id = ta.question_id
     JOIN assessments a ON a.id = ta.assessment_id
     WHERE ta.trainer_id = ? AND (ta.is_correct = 0 OR ta.evaluation_status IN (\'needs_review\', \'reviewed\'))
     ORDER BY ta.answered_at DESC'
);
$feedbackStmt->execute([$trainerId]);
$items = $feedbackStmt->fetchAll();

require_once __DIR__ . '/../includes/header.php';
?>
<h1 class="fw-bold mb-3">Feedback and Explanation History</h1>
<div class="content-card p-4">
    <?php foreach ($items as $item): ?>
        <div class="question-box mb-3">
            <div class="fw-semibold"><?= h($item['title']) ?></div>
            <p class="mb-1"><?= h($item['question_text']) ?></p>
            <?php if ($item['selected_option']): ?>
                <p class="mb-1"><strong>Your Answer:</strong> <?= h($item['selected_option']) ?> - <strong>Correct:</strong> <?= h($item['correct_option']) ?></p>
            <?php else: ?>
                <p class="mb-1"><strong>Your Answer:</strong> <?= nl2br(h($item['descriptive_answer'])) ?></p>
            <?php endif; ?>
            <p class="mb-1"><strong>Explanation:</strong> <?= h($item['explanation']) ?></p>
            <p class="mb-0"><strong>Supervisor Feedback:</strong> <?= h($item['feedback_comments'] ?: 'Pending') ?></p>
        </div>
    <?php endforeach; ?>
    <?php if (!$items): ?><p class="text-muted mb-0">No feedback yet.</p><?php endif; ?>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
