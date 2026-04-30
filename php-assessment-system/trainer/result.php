<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_role('trainer');

$resultId = (int) ($_GET['id'] ?? 0);
$trainerId = current_user()['id'];

$stmt = $pdo->prepare(
    'SELECT r.*, a.title, a.pass_percentage
     FROM results r
     JOIN assessments a ON a.id = r.assessment_id
     WHERE r.id = ? AND r.trainer_id = ?'
);
$stmt->execute([$resultId, $trainerId]);
$result = $stmt->fetch();
if (!$result) {
    flash('danger', 'Result not found.');
    redirect('dashboard.php');
}

$answersStmt = $pdo->prepare(
    'SELECT ta.*, q.question_type, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option, q.expected_answer, q.explanation, aq.marks
     FROM trainer_answers ta
     JOIN questions q ON q.id = ta.question_id
     JOIN assessment_questions aq ON aq.assessment_id = ta.assessment_id AND aq.question_id = ta.question_id
     WHERE ta.result_id = ?
     ORDER BY ta.id'
);
$answersStmt->execute([$resultId]);
$answers = $answersStmt->fetchAll();

require_once __DIR__ . '/../includes/header.php';
?>
<h1 class="fw-bold mb-3">Assessment Result</h1>
<div class="content-card p-4 mb-4">
    <h2 class="h4"><?= h($result['title']) ?></h2>
    <div class="row text-center mt-3">
        <div class="col-md-3"><strong><?= h($result['percentage']) ?>%</strong><br><span class="text-muted">Total Score</span></div>
        <div class="col-md-3"><strong><?= h($result['status']) ?></strong><br><span class="text-muted">Pass/Fail</span></div>
        <div class="col-md-3"><strong><?= h($result['correct_count']) ?></strong><br><span class="text-muted">Correct</span></div>
        <div class="col-md-3"><strong><?= h($result['wrong_count']) ?></strong><br><span class="text-muted">Wrong</span></div>
    </div>
</div>

<h2 class="h4 fw-bold">Correct and Wrong Answer Review</h2>
<?php foreach ($answers as $answer): ?>
    <div class="question-box mb-3 <?= $answer['is_correct'] ? 'answer-correct' : 'answer-wrong' ?>">
        <div class="d-flex justify-content-between">
            <h3 class="h6 fw-bold"><?= h($answer['question_text']) ?></h3>
            <span class="badge bg-secondary"><?= h($answer['evaluation_status']) ?></span>
        </div>
        <?php if ($answer['question_type'] === 'mcq'): ?>
            <p class="mb-1"><strong>Your Answer:</strong> <?= h($answer['selected_option']) ?></p>
            <p class="mb-1"><strong>Correct Answer:</strong> <?= h($answer['correct_option']) ?></p>
            <p class="mb-1"><strong>Result:</strong> <?= $answer['is_correct'] ? 'Correct' : 'Wrong' ?></p>
            <p class="mb-0"><strong>Explanation:</strong> <?= h($answer['explanation']) ?></p>
        <?php else: ?>
            <p><strong>Your Descriptive Answer:</strong><br><?= nl2br(h($answer['descriptive_answer'])) ?></p>
            <p><strong>Expected Answer / Guideline:</strong><br><?= nl2br(h($answer['expected_answer'])) ?></p>
            <p><strong>Supervisor Remarks:</strong> <?= h($answer['supervisor_remarks'] ?: 'Pending review') ?></p>
            <p class="mb-0"><strong>Feedback:</strong> <?= h($answer['feedback_comments']) ?></p>
        <?php endif; ?>
    </div>
<?php endforeach; ?>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
