<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_role('supervisor');

$resultId = (int) ($_GET['id'] ?? 0);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $answerId = (int) $_POST['answer_id'];
    $marks = (float) $_POST['marks_awarded'];
    $remarks = trim($_POST['supervisor_remarks']);
    $feedback = trim($_POST['feedback_comments']);
    $isCorrect = $marks > 0 ? 1 : 0;

    $stmt = $pdo->prepare(
        "UPDATE trainer_answers
         SET marks_awarded=?, supervisor_remarks=?, feedback_comments=?, is_correct=?, evaluation_status='reviewed'
         WHERE id=?"
    );
    $stmt->execute([$marks, $remarks, $feedback, $isCorrect, $answerId]);

    $totals = $pdo->prepare(
        'SELECT SUM(marks_awarded) AS obtained,
                SUM(aq.marks) AS total,
                SUM(CASE WHEN ta.is_correct = 1 THEN 1 ELSE 0 END) AS correct_count,
                SUM(CASE WHEN ta.is_correct = 0 THEN 1 ELSE 0 END) AS wrong_count,
                SUM(CASE WHEN ta.evaluation_status = \'needs_review\' THEN 1 ELSE 0 END) AS pending_count
         FROM trainer_answers ta
         JOIN assessment_questions aq ON aq.assessment_id = ta.assessment_id AND aq.question_id = ta.question_id
         WHERE ta.result_id = ?'
    );
    $totals->execute([$resultId]);
    $row = $totals->fetch();
    $percentage = $row['total'] > 0 ? round(($row['obtained'] / $row['total']) * 100, 2) : 0;

    $pass = $pdo->prepare('SELECT a.pass_percentage FROM results r JOIN assessments a ON a.id = r.assessment_id WHERE r.id = ?');
    $pass->execute([$resultId]);
    $passPercentage = (float) $pass->fetchColumn();
    $evaluationStatus = $row['pending_count'] > 0 ? 'needs_review' : 'reviewed';
    $status = $evaluationStatus === 'needs_review' ? 'Pending Review' : result_status($percentage, $passPercentage);

    $update = $pdo->prepare(
        'UPDATE results SET obtained_marks=?, percentage=?, correct_count=?, wrong_count=?, status=?, evaluation_status=?, reviewed_at=NOW() WHERE id=?'
    );
    $update->execute([$row['obtained'], $percentage, $row['correct_count'], $row['wrong_count'], $status, $evaluationStatus, $resultId]);

    flash('success', 'Descriptive answer reviewed.');
    redirect('review_result.php?id=' . $resultId);
}

$stmt = $pdo->prepare(
    'SELECT r.*, t.name AS trainer_name, a.title
     FROM results r
     JOIN trainers t ON t.id = r.trainer_id
     JOIN assessments a ON a.id = r.assessment_id
     WHERE r.id = ?'
);
$stmt->execute([$resultId]);
$result = $stmt->fetch();
if (!$result) {
    flash('danger', 'Result not found.');
    redirect('results.php');
}

$answers = $pdo->prepare(
    'SELECT ta.*, q.question_type, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option, q.expected_answer, q.explanation, aq.marks
     FROM trainer_answers ta
     JOIN questions q ON q.id = ta.question_id
     JOIN assessment_questions aq ON aq.assessment_id = ta.assessment_id AND aq.question_id = ta.question_id
     WHERE ta.result_id = ?
     ORDER BY ta.id'
);
$answers->execute([$resultId]);
$answers = $answers->fetchAll();

require_once __DIR__ . '/../includes/header.php';
?>
<div class="d-flex justify-content-between align-items-center mb-3">
    <div>
        <h1 class="fw-bold">Review Result</h1>
        <p class="text-muted mb-0"><?= h($result['trainer_name']) ?> - <?= h($result['title']) ?></p>
    </div>
    <a class="btn btn-outline-primary" href="results.php">Back</a>
</div>
<div class="content-card p-4 mb-4">
    <div class="row text-center">
        <div class="col-md-3"><strong><?= h($result['percentage']) ?>%</strong><br><span class="text-muted">Score</span></div>
        <div class="col-md-3"><strong><?= h($result['status']) ?></strong><br><span class="text-muted">Status</span></div>
        <div class="col-md-3"><strong><?= h($result['correct_count']) ?></strong><br><span class="text-muted">Correct</span></div>
        <div class="col-md-3"><strong><?= h($result['wrong_count']) ?></strong><br><span class="text-muted">Wrong</span></div>
    </div>
</div>

<?php foreach ($answers as $answer): ?>
    <div class="question-box mb-3 <?= $answer['is_correct'] ? 'answer-correct' : 'answer-wrong' ?>">
        <div class="d-flex justify-content-between">
            <h2 class="h6 fw-bold"><?= h($answer['question_text']) ?></h2>
            <span class="badge bg-secondary"><?= h(strtoupper($answer['question_type'])) ?></span>
        </div>
        <?php if ($answer['question_type'] === 'mcq'): ?>
            <p class="mb-1"><strong>Trainer Answer:</strong> <?= h($answer['selected_option']) ?></p>
            <p class="mb-1"><strong>Correct Answer:</strong> <?= h($answer['correct_option']) ?></p>
            <p class="mb-0"><strong>Explanation:</strong> <?= h($answer['explanation']) ?></p>
        <?php else: ?>
            <p><strong>Trainer Answer:</strong><br><?= nl2br(h($answer['descriptive_answer'])) ?></p>
            <p><strong>Expected Answer:</strong><br><?= nl2br(h($answer['expected_answer'])) ?></p>
            <form method="post" class="row g-2">
                <input type="hidden" name="answer_id" value="<?= h($answer['id']) ?>">
                <div class="col-md-3">
                    <label class="form-label">Marks out of <?= h($answer['marks']) ?></label>
                    <input class="form-control" type="number" step="0.01" min="0" max="<?= h($answer['marks']) ?>" name="marks_awarded" value="<?= h($answer['marks_awarded']) ?>">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Supervisor Remarks</label>
                    <input class="form-control" name="supervisor_remarks" value="<?= h($answer['supervisor_remarks']) ?>">
                </div>
                <div class="col-md-5">
                    <label class="form-label">Feedback Comments</label>
                    <input class="form-control" name="feedback_comments" value="<?= h($answer['feedback_comments'] ?: $answer['explanation']) ?>">
                </div>
                <div class="col-12">
                    <button class="btn btn-sm btn-primary">Save Review</button>
                </div>
            </form>
        <?php endif; ?>
    </div>
<?php endforeach; ?>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
