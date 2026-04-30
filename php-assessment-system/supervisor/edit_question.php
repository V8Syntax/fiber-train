<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_role('supervisor');

$id = (int) ($_GET['id'] ?? 0);
$stmt = $pdo->prepare('SELECT * FROM questions WHERE id = ?');
$stmt->execute([$id]);
$question = $stmt->fetch();
if (!$question) {
    flash('danger', 'Question not found.');
    redirect('questions.php');
}

$categories = $pdo->query('SELECT * FROM question_categories ORDER BY name')->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $type = $_POST['question_type'] ?? 'mcq';
    $stmt = $pdo->prepare(
        'UPDATE questions SET category_id=?, question_type=?, question_text=?, option_a=?, option_b=?, option_c=?, option_d=?, correct_option=?, expected_answer=?, explanation=?, status=? WHERE id=?'
    );
    $stmt->execute([
        $_POST['category_id'],
        $type,
        trim($_POST['question_text']),
        $type === 'mcq' ? trim($_POST['option_a']) : null,
        $type === 'mcq' ? trim($_POST['option_b']) : null,
        $type === 'mcq' ? trim($_POST['option_c']) : null,
        $type === 'mcq' ? trim($_POST['option_d']) : null,
        $type === 'mcq' ? $_POST['correct_option'] : null,
        $type === 'descriptive' ? trim($_POST['expected_answer']) : null,
        trim($_POST['explanation']),
        $_POST['status'],
        $id,
    ]);
    flash('success', 'Question updated successfully.');
    redirect('questions.php');
}

require_once __DIR__ . '/../includes/header.php';
?>
<div class="content-card p-4">
    <h1 class="h3 fw-bold mb-3">Edit Question</h1>
    <form method="post">
        <div class="row g-3">
            <div class="col-md-4">
                <label class="form-label">Category</label>
                <select class="form-select" name="category_id" required>
                    <?php foreach ($categories as $cat): ?>
                        <option value="<?= h($cat['id']) ?>" <?= $cat['id'] == $question['category_id'] ? 'selected' : '' ?>><?= h($cat['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Question Type</label>
                <select class="form-select" name="question_type" required>
                    <option value="mcq" <?= $question['question_type'] === 'mcq' ? 'selected' : '' ?>>MCQ</option>
                    <option value="descriptive" <?= $question['question_type'] === 'descriptive' ? 'selected' : '' ?>>Descriptive</option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Status</label>
                <select class="form-select" name="status">
                    <option value="active" <?= $question['status'] === 'active' ? 'selected' : '' ?>>Active</option>
                    <option value="inactive" <?= $question['status'] === 'inactive' ? 'selected' : '' ?>>Inactive</option>
                </select>
            </div>
            <div class="col-12">
                <label class="form-label">Question Text</label>
                <textarea class="form-control" name="question_text" rows="3" required><?= h($question['question_text']) ?></textarea>
            </div>
        </div>
        <div id="mcqFields" class="row g-3 mt-1">
            <?php foreach (['a', 'b', 'c', 'd'] as $opt): ?>
                <div class="col-md-6">
                    <label class="form-label">Option <?= strtoupper($opt) ?></label>
                    <input class="form-control" name="option_<?= $opt ?>" value="<?= h($question['option_' . $opt]) ?>">
                </div>
            <?php endforeach; ?>
            <div class="col-md-6">
                <label class="form-label">Correct Option</label>
                <select class="form-select" name="correct_option">
                    <?php foreach (['A', 'B', 'C', 'D'] as $opt): ?>
                        <option <?= $question['correct_option'] === $opt ? 'selected' : '' ?>><?= $opt ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>
        <div id="descriptiveFields" class="mt-3">
            <label class="form-label">Expected Answer / Evaluation Guideline</label>
            <textarea class="form-control" name="expected_answer" rows="4"><?= h($question['expected_answer']) ?></textarea>
        </div>
        <label class="form-label mt-3">Explanation / Feedback Note</label>
        <textarea class="form-control mb-3" name="explanation" rows="3" required><?= h($question['explanation']) ?></textarea>
        <button class="btn btn-primary">Update Question</button>
    </form>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
