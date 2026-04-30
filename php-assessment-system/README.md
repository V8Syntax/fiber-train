# Trainer Assessment System

## Project overview

Trainer Assessment System is a complete PHP, MySQL, Bootstrap, and JavaScript web application for evaluating trainers through online assessments. The system has two separate roles: Supervisor and Trainer. Supervisors create questions and assessments, while Trainers take assessments and review detailed feedback.

The app is intentionally simple and modular so it is easy to explain in a viva or academic project presentation.

## Features

- Supervisor sign up, login, session handling, and logout
- Trainer login, session handling, and logout
- Separate Supervisor and Trainer dashboards
- Role-based redirects and protected pages
- Supervisor-created trainer accounts
- MCQ and descriptive question support
- Category-based question organization
- Assessment creation from the question bank
- Automatic MCQ evaluation
- Descriptive answer storage for manual supervisor review
- Result page with score, pass/fail status, correct count, wrong count, answers, correct answer, and explanation
- Supervisor result review with descriptive marks, remarks, and feedback comments
- Trainer feedback history
- Responsive Bootstrap interface

## User roles

### Supervisor

The Supervisor manages the training assessment process. A Supervisor can:

- Sign up and log in
- Add trainer accounts
- Create MCQ and descriptive questions
- Edit and delete questions
- Create assessments
- View all trainer results
- Review descriptive answers
- Add remarks and feedback
- View trainer performance reports

### Trainer

The Trainer completes assessments and reviews learning feedback. A Trainer can:

- Log in through a separate trainer login page
- View available assessments
- Answer MCQ and descriptive questions
- Submit assessments
- View result score and pass/fail status
- Review correct and wrong answers
- View explanations, correct answers, supervisor remarks, and feedback

## Page structure

### Common/Auth pages

- `index.php`
- `supervisor_signup.php`
- `supervisor_login.php`
- `trainer_login.php`
- `logout.php`

### Supervisor pages

- `supervisor/dashboard.php`
- `supervisor/add_trainer.php`
- `supervisor/questions.php`
- `supervisor/add_question.php`
- `supervisor/edit_question.php`
- `supervisor/delete_question.php`
- `supervisor/create_assessment.php`
- `supervisor/results.php`
- `supervisor/review_result.php`
- `supervisor/report.php`

### Trainer pages

- `trainer/dashboard.php`
- `trainer/take_assessment.php`
- `trainer/submit_assessment.php`
- `trainer/result.php`
- `trainer/feedback.php`

## Database schema

The schema is available in:

`database/schema.sql`

Tables:

- `supervisors`
- `trainers`
- `question_categories`
- `questions`
- `assessments`
- `assessment_questions`
- `results`
- `trainer_answers`

MCQ questions store:

- question text
- options A, B, C, D
- correct option
- explanation
- category

Descriptive questions store:

- question text
- expected answer or guideline
- explanation
- supervisor remarks through `trainer_answers`
- feedback comments through `trainer_answers`
- review status

## Folder structure

```text
php-assessment-system/
  assets/
    css/style.css
    js/app.js
  config/
    database.php
  database/
    schema.sql
  includes/
    footer.php
    functions.php
    header.php
  supervisor/
    add_question.php
    add_trainer.php
    create_assessment.php
    dashboard.php
    delete_question.php
    edit_question.php
    questions.php
    report.php
    results.php
    review_result.php
  trainer/
    dashboard.php
    feedback.php
    result.php
    submit_assessment.php
    take_assessment.php
  index.php
  logout.php
  supervisor_login.php
  supervisor_signup.php
  trainer_login.php
```

## Backend logic

- `config/database.php` creates the PDO database connection.
- `includes/functions.php` contains escaping, redirect, flash message, login, logout, and role-check helpers.
- Supervisor and Trainer pages call `require_role()` to enforce permissions.
- Passwords are stored with `password_hash()` and checked with `password_verify()`.
- MCQ marks are calculated immediately in `trainer/submit_assessment.php`.
- Descriptive answers are saved with `needs_review` status.
- Supervisor review updates descriptive marks and recalculates final score.

## Frontend pages

The UI uses Bootstrap 5 with a small custom stylesheet:

- Clean navigation
- Role-specific menus
- Dashboard cards
- Responsive tables
- Clear result cards
- Correct and wrong answer highlighting
- Simple forms for beginner-friendly project explanation

## Result and feedback logic

When a Trainer submits an assessment:

1. The app creates one row in `results`.
2. The app stores each answer in `trainer_answers`.
3. MCQ answers are evaluated automatically.
4. Descriptive answers are marked as `needs_review`.
5. If there are descriptive answers, the result status is `Pending Review`.
6. The Trainer can still see MCQ feedback immediately.
7. The Supervisor opens `review_result.php`, assigns marks, writes remarks, and saves feedback.
8. The result score and pass/fail status are recalculated after review.

## Sample code

Role protection example:

```php
require_once __DIR__ . '/../includes/functions.php';
require_role('supervisor');
```

MCQ scoring example:

```php
$isCorrect = $answer === $q['correct_option'] ? 1 : 0;
$marks = $isCorrect ? (float) $q['marks'] : 0;
```

Password hashing example:

```php
password_hash($password, PASSWORD_DEFAULT);
```

## Setup instructions

1. Install XAMPP, WAMP, Laragon, or another PHP and MySQL stack.

2. Copy or keep this folder in your web server root:

```text
htdocs/php-assessment-system
```

3. Start Apache and MySQL.

4. Open phpMyAdmin or MySQL command line and import:

```text
database/schema.sql
```

Command-line example:

```bash
mysql -u root -p < database/schema.sql
```

If your MySQL root user has no password, use:

```bash
mysql -u root < database/schema.sql
```

5. If your MySQL credentials are different, update:

```text
config/database.php
```

6. Open the app in the browser:

```text
http://localhost/php-assessment-system/
```

7. Demo login accounts:

```text
Supervisor: supervisor@example.com
Trainer: trainer@example.com
Password: password
```

## Working minimum version

The implemented workflow covers:

1. Supervisor login
2. Question creation and management
3. Assessment creation
4. Trainer login
5. Assessment submission
6. Automatic MCQ evaluation
7. Trainer result review
8. Supervisor descriptive answer review
9. Feedback display

