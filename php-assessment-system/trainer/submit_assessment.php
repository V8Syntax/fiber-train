<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_role('trainer');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('dashboard.php');
}

$trainerId = current_user()['id'];
$assessmentId = (int) $_POST['assessment_id'];
$answers = $_POST['answer'] ?? [];

$assessmentStmt = $pdo->prepare('SELECT * FROM assessments WHERE id = ?');
$assessmentStmt->execute([$assessmentId]);
$assessment = $assessmentStmt->fetch();
if (!$assessment) {
    flash('danger', 'Assessment not found.');
    redirect('dashboard.php');
}

$questionsStmt = $pdo->prepare(
    'SELECT q.*, aq.marks
     FROM assessment_questions aq
     JOIN questions q ON q.id = aq.question_id
     WHERE aq.assessment_id = ?'
);
$questionsStmt->execute([$assessmentId]);
$questions = $questionsStmt->fetchAll();

$totalMarks = 0;
$obtainedMarks = 0;
$correctCount = 0;
$wrongCount = 0;
$needsReview = false;

$pdo->beginTransaction();
$resultStmt = $pdo->prepare(
    "INSERT INTO results (assessment_id, trainer_id, total_marks, obtained_marks, percentage, status, evaluation_status)
     VALUES (?, ?, 0, 0, 0, 'Pending Review', 'auto_evaluated')"
);
$resultStmt->execute([$assessmentId, $trainerId]);
$resultId = $pdo->lastInsertId();

$answerStmt = $pdo->prepare(
    'INSERT INTO trainer_answers
    (result_id, trainer_id, assessment_id, question_id, selected_option, descriptive_answer, is_correct, marks_awarded, feedback_comments, evaluation_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

foreach ($questions as $q) {
    $totalMarks += (float) $q['marks'];
    $answer = $answers[$q['id']] ?? '';

    if ($q['question_type'] === 'mcq') {
        $isCorrect = $answer === $q['correct_option'] ? 1 : 0;
        $marks = $isCorrect ? (float) $q['marks'] : 0;
        $obtainedMarks += $marks;
        $correctCount += $isCorrect ? 1 : 0;
        $wrongCount += $isCorrect ? 0 : 1;
        $answerStmt->execute([$resultId, $trainerId, $assessmentId, $q['id'], $answer, null, $isCorrect, $marks, $q['explanation'], 'auto_evaluated']);
    } else {
        $needsReview = true;
        $answerStmt->execute([$resultId, $trainerId, $assessmentId, $q['id'], null, trim($answer), null, 0, $q['explanation'], 'needs_review']);
    }
}

$percentage = $totalMarks > 0 ? round(($obtainedMarks / $totalMarks) * 100, 2) : 0;
$status = $needsReview ? 'Pending Review' : result_status($percentage, (float) $assessment['pass_percentage']);
$evaluationStatus = $needsReview ? 'needs_review' : 'auto_evaluated';

$update = $pdo->prepare(
    'UPDATE results SET total_marks=?, obtained_marks=?, percentage=?, correct_count=?, wrong_count=?, status=?, evaluation_status=? WHERE id=?'
);
$update->execute([$totalMarks, $obtainedMarks, $percentage, $correctCount, $wrongCount, $status, $evaluationStatus, $resultId]);
$pdo->commit();

redirect('result.php?id=' . $resultId);
