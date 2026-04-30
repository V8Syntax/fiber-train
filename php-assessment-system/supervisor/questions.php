<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_role('supervisor');

$questions = $pdo->query(
    'SELECT q.*, c.name AS category_name
     FROM questions q
     JOIN question_categories c ON c.id = q.category_id
     ORDER BY q.created_at DESC'
)->fetchAll();

require_once __DIR__ . '/../includes/header.php';
?>
<div class="d-flex justify-content-between align-items-center mb-3">
    <h1 class="fw-bold">Manage Questions</h1>
    <a class="btn btn-primary" href="add_question.php">Add Question</a>
</div>
<div class="content-card p-4">
    <div class="table-responsive">
        <table class="table align-middle">
            <thead><tr><th>Question</th><th>Type</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
            <?php foreach ($questions as $q): ?>
                <tr>
                    <td><?= h(short_text($q['question_text'])) ?></td>
                    <td><span class="badge badge-soft"><?= h(strtoupper($q['question_type'])) ?></span></td>
                    <td><?= h($q['category_name']) ?></td>
                    <td><?= h($q['status']) ?></td>
                    <td>
                        <a class="btn btn-sm btn-outline-primary" href="edit_question.php?id=<?= h($q['id']) ?>">Edit</a>
                        <a class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete this question?')" href="delete_question.php?id=<?= h($q['id']) ?>">Delete</a>
                    </td>
                </tr>
            <?php endforeach; ?>
            <?php if (!$questions): ?>
                <tr><td colspan="5" class="text-muted">No questions added yet.</td></tr>
            <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>
