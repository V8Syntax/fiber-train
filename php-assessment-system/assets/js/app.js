function toggleQuestionFields() {
    const type = document.querySelector('[name="question_type"]');
    if (!type) return;

    const mcq = document.querySelector('#mcqFields');
    const descriptive = document.querySelector('#descriptiveFields');
    const isMcq = type.value === 'mcq';

    if (mcq) mcq.style.display = isMcq ? 'block' : 'none';
    if (descriptive) descriptive.style.display = isMcq ? 'none' : 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    toggleQuestionFields();
    const type = document.querySelector('[name="question_type"]');
    if (type) type.addEventListener('change', toggleQuestionFields);
});
