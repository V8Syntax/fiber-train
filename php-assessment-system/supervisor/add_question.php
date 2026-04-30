<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_role('supervisor');

$categories = $pdo->query('SELECT * FROM question_categories ORDER BY name')->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $type = $_POST['question_type'] ?? 'mcq';
    $stmt = $pdo->prepare(
        'INSERT INTO questions
        (supervisor_id, category_id, question_type, question_text, option_a, option_b, option_c, option_d, correct_option, expected_answer, explanation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        current_user()['id'],
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
    ]);
    flash('success', 'Question added successfully.');
    redirect('questions.php');
}

require_once __DIR__ . '/../includes/header.php';
?>
<div class="content-card p-4">
    <h1 class="h3 fw-bold mb-3">Add Question</h1>
    <form method="post">
        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Category</label>
                <select class="form-select" name="category_id" required>
                    <?php foreach ($categories as $cat): ?>
                        <option value="<?= h($cat['id']) ?>"><?= h($cat['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="col-md-6">
                <label class="form-label">Question Type</label>
                <select class="form-select" name="question_type" required>
                    <option value="mcq">MCQ</option>
                    <option value="descriptive">Descriptive</option>
                </select>
            </div>
            <div class="col-12">
                <label class="form-label">Question Text</label>
                <textarea class="form-control" name="question_text" rows="3" required></textarea>
            </div>
        </div>

        <div id="mcqFields" class="row g-3 mt-1">
            <?php foreach (['a', 'b', 'c', 'd'] as $opt): ?>
                <div class="col-md-6">
                    <label class="form-label">Option <?= strtoupper($opt) ?></label>
                    <input class="form-control" name="option_<?= $opt ?>">
                </div>
            <?php endforeach; ?>
            <div class="col-md-6">
                <label class="form-label">Correct Option</label>
                <select class="form-select" name="correct_option">
                    <option>A</option><option>B</option><option>C</option><option>D</option>
                </select>
            </div>
        </div>

        <div id="descriptiveFields" class="mt-3">
            <label class="form-label">Expected Answer / Evaluation Guideline</label>
            <textarea class="form-control" name="expected_answer" rows="4"></textarea>
        </div>

        <label class="form-label mt-3">Explanation / Feedback Note</label>
        <textarea class="form-control mb-3" name="explanation" rows="3" required></textarea>
        <button class="btn btn-primary">Save Question</button>
    </form>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
