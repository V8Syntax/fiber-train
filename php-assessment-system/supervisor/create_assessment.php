<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_role('supervisor');

$questions = $pdo->query(
    "SELECT q.*, c.name AS category_name
     FROM questions q
     JOIN question_categories c ON c.id = q.category_id
     WHERE q.status = 'active'
     ORDER BY c.name, q.question_type"
)->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $selected = $_POST['questions'] ?? [];
    if (!$selected) {
        flash('danger', 'Select at least one question.');
    } else {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare('INSERT INTO assessments (supervisor_id, title, description, pass_percentage, status) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([
            current_user()['id'],
            trim($_POST['title']),
            trim($_POST['description']),
            $_POST['pass_percentage'],
            $_POST['status'],
        ]);
        $assessmentId = $pdo->lastInsertId();
        $link = $pdo->prepare('INSERT INTO assessment_questions (assessment_id, question_id, marks) VALUES (?, ?, ?)');
        foreach ($selected as $questionId) {
            $mark = $_POST['marks'][$questionId] ?? 1;
            $link->execute([$assessmentId, $questionId, $mark]);
        }
        $pdo->commit();
        flash('success', 'Assessment created successfully.');
        redirect('create_assessment.php');
    }
}

$assessments = $pdo->query('SELECT * FROM assessments ORDER BY created_at DESC')->fetchAll();

require_once __DIR__ . '/../includes/header.php';
?>
<div class="row g-4">
    <div class="col-lg-7">
        <div class="content-card p-4">
            <h1 class="h3 fw-bold mb-3">Create Assessment</h1>
            <form method="post">
                <label class="form-label">Title</label>
                <input class="form-control mb-3" name="title" required>
                <label class="form-label">Description</label>
                <textarea class="form-control mb-3" name="description" rows="2"></textarea>
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Pass Percentage</label>
                        <input class="form-control" type="number" min="0" max="100" step="0.01" name="pass_percentage" value="50" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Status</label>
                        <select class="form-select" name="status">
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>
                <h2 class="h5 fw-bold">Select Questions</h2>
                <?php foreach ($questions as $q): ?>
                    <div class="question-box mb-2">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="questions[]" value="<?= h($q['id']) ?>" id="q<?= h($q['id']) ?>">
                            <label class="form-check-label" for="q<?= h($q['id']) ?>">
                                <strong><?= h(strtoupper($q['question_type'])) ?></strong> - <?= h($q['category_name']) ?> - <?= h($q['question_text']) ?>
                            </label>
                        </div>
                        <label class="form-label small mt-2">Marks</label>
                        <input class="form-control form-control-sm" type="number" step="0.01" min="0" name="marks[<?= h($q['id']) ?>]" value="1">
                    </div>
                <?php endforeach; ?>
                <button class="btn btn-primary mt-2">Create Assessment</button>
            </form>
        </div>
    </div>
    <div class="col-lg-5">
        <div class="content-card p-4">
            <h2 class="h5 fw-bold mb-3">Existing Assessments</h2>
            <?php foreach ($assessments as $a): ?>
                <div class="border-bottom py-2">
                    <div class="fw-semibold"><?= h($a['title']) ?></div>
                    <span class="badge bg-secondary"><?= h($a['status']) ?></span>
                    <span class="text-muted small">Pass: <?= h($a['pass_percentage']) ?>%</span>
                </div>
            <?php endforeach; ?>
            <?php if (!$assessments): ?><p class="text-muted mb-0">No assessments yet.</p><?php endif; ?>
        </div>
    </div>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
