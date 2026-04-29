"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Loader2
} from "lucide-react";

export default function TakeAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [assessment, setAssessment] = useState<any>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/assessments/${id}`)
      .then(res => res.json())
      .then(data => {
        setAssessment(data);
        setLoading(false);
      });
  }, [id]);

  const selectAnswer = (questionId: number, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const submitAssessment = async () => {
    if (!confirm("Are you sure you want to submit your assessment?")) return;
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/assessments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: assessment.id,
          answers: answers
        }),
      });

      if (res.ok) {
        const result = await res.json();
        router.push(`/trainer/results/${result.attemptId}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-industrial-bg flex items-center justify-center">
      <Loader2 className="animate-spin text-industrial-primary" size={48} />
    </div>
  );

  const currentQuestion = assessment.questions[currentIdx]?.question;
  const totalQuestions = assessment.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-industrial-bg flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-industrial-border p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-industrial-dark">{assessment.title}</h1>
            <p className="text-xs text-industrial-muted uppercase tracking-wider font-bold">Trainer Certification Assessment</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-industrial-muted">Progress</span>
              <span className="text-sm font-black text-industrial-primary">{answeredCount} / {totalQuestions} Answered</span>
            </div>
            <button 
              onClick={submitAssessment}
              disabled={submitting}
              className="bg-industrial-dark text-industrial-surface px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-4">
          <div className="w-full h-1 bg-industrial-bg rounded-full overflow-hidden">
            <div 
              className="h-full bg-industrial-primary transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Question Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
        <div className="bg-industrial-surface p-6 md:p-10 rounded-2xl border border-industrial-border shadow-sm mb-8">
          <div className="flex justify-between items-start mb-6">
            <span className="bg-industrial-bg px-3 py-1 rounded text-xs font-bold text-industrial-muted uppercase">
              Question {currentIdx + 1}
            </span>
            <div className="flex gap-2">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-industrial-dark/10 text-industrial-dark">
                {currentQuestion.category?.name}
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-industrial-muted/10 text-industrial-muted">
                {currentQuestion.difficulty}
              </span>
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-industrial-dark mb-10 leading-relaxed">
            {currentQuestion.questionText}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {[
              { code: 'A', text: currentQuestion.optionA },
              { code: 'B', text: currentQuestion.optionB },
              { code: 'C', text: currentQuestion.optionC },
              { code: 'D', text: currentQuestion.optionD },
            ].map((opt) => (
              <button
                key={opt.code}
                onClick={() => selectAnswer(currentQuestion.id, opt.code)}
                className={`flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                  answers[currentQuestion.id] === opt.code
                    ? 'border-industrial-primary bg-industrial-primary/5 shadow-inner'
                    : 'border-industrial-border bg-white hover:border-industrial-muted'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-colors ${
                  answers[currentQuestion.id] === opt.code
                    ? 'bg-industrial-primary text-white'
                    : 'bg-industrial-bg text-industrial-muted'
                }`}>
                  {opt.code}
                </div>
                <span className={`font-medium ${
                  answers[currentQuestion.id] === opt.code ? 'text-industrial-dark' : 'text-industrial-muted'
                }`}>
                  {opt.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 px-6 py-3 font-bold text-industrial-dark hover:bg-industrial-surface rounded-xl transition-all disabled:opacity-0"
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <div className="flex gap-2">
            {assessment.questions.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIdx === idx ? 'bg-industrial-primary w-8' : 
                  answers[assessment.questions[idx].questionId] ? 'bg-industrial-dark' : 'bg-industrial-border'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (currentIdx < totalQuestions - 1) {
                setCurrentIdx(prev => prev + 1);
              } else {
                submitAssessment();
              }
            }}
            className="flex items-center gap-2 px-6 py-3 font-bold bg-industrial-dark text-industrial-surface rounded-xl hover:bg-opacity-90 transition-all"
          >
            {currentIdx === totalQuestions - 1 ? "Finish" : "Next"}
            <ChevronRight size={20} />
          </button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-6 text-center text-industrial-muted text-xs bg-industrial-bg">
        <div className="flex justify-center items-center gap-6 mb-2">
          <div className="flex items-center gap-1"><Clock size={12} /> Auto-saving response...</div>
          <div className="flex items-center gap-1"><AlertTriangle size={12} /> Do not refresh this page.</div>
        </div>
        Fiber Train Assessment System • Industrial Compliance Protocol
      </footer>
    </div>
  );
}
