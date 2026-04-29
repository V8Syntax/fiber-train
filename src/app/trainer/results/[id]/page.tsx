import { db } from "@/db";
import { attempts, attemptAnswers, assessments, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { 
  Trophy, 
  XCircle, 
  CheckCircle2, 
  ArrowLeft,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const attemptId = parseInt(id);

  const attempt = await db.query.attempts.findFirst({
    where: eq(attempts.id, attemptId),
    with: {
      assessment: true,
      answers: {
        with: {
          question: {
            with: {
              category: true
            }
          }
        }
      }
    }
  });

  if (!attempt) return <div>Result not found</div>;

  // Calculate weak areas
  const categoryStats: { [key: string]: { total: number, correct: number } } = {};
  attempt.answers.forEach(ans => {
    const catName = ans.question?.category?.name || 'General';
    if (!categoryStats[catName]) categoryStats[catName] = { total: 0, correct: 0 };
    categoryStats[catName].total++;
    if (ans.isCorrect) categoryStats[catName].correct++;
  });

  const weakAreas = Object.entries(categoryStats)
    .filter(([_, stats]) => (stats.correct / stats.total) < 0.7)
    .map(([name, stats]) => ({ name, score: Math.round((stats.correct / stats.total) * 100) }));

  const isPass = attempt.result === 'pass';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/trainer" className="p-2 hover:bg-industrial-surface-secondary rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-industrial-dark">Assessment Result</h1>
      </div>

      <div className={`p-10 rounded-3xl border-2 text-center shadow-lg ${
        isPass 
          ? 'bg-industrial-success/5 border-industrial-success/20' 
          : 'bg-industrial-error/5 border-industrial-error/20'
      }`}>
        <div className="flex justify-center mb-6">
          {isPass ? (
            <div className="p-6 bg-industrial-success text-white rounded-full shadow-xl shadow-industrial-success/20">
              <Trophy size={64} />
            </div>
          ) : (
            <div className="p-6 bg-industrial-error text-white rounded-full shadow-xl shadow-industrial-error/20">
              <XCircle size={64} />
            </div>
          )}
        </div>
        
        <h2 className={`text-4xl font-black mb-2 ${isPass ? 'text-industrial-success' : 'text-industrial-error'}`}>
          {isPass ? 'CONGRATULATIONS!' : 'KEEP TRYING'}
        </h2>
        <p className="text-industrial-muted text-lg mb-8 uppercase tracking-widest font-bold">
          You have {isPass ? 'passed' : 'failed'} the {attempt.assessment?.title}
        </p>

        <div className="flex justify-center gap-12 border-t border-industrial-border pt-8 mt-8">
          <div>
            <p className="text-xs font-bold text-industrial-muted uppercase mb-1">Your Score</p>
            <p className="text-4xl font-black text-industrial-dark">{Math.round(Number(attempt.percentage))}%</p>
          </div>
          <div className="w-px bg-industrial-border"></div>
          <div>
            <p className="text-xs font-bold text-industrial-muted uppercase mb-1">Required Score</p>
            <p className="text-4xl font-black text-industrial-muted">
              {Math.round((Number(attempt.assessment?.passMarks) / Number(attempt.assessment?.totalMarks)) * 100)}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Weak Areas */}
        <div className="bg-industrial-surface p-8 rounded-2xl border border-industrial-border shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-industrial-error">
            <AlertTriangle size={24} />
            <h3 className="text-xl font-bold text-industrial-dark">Process Weak Areas</h3>
          </div>
          
          <div className="space-y-4">
            {weakAreas.length === 0 ? (
              <div className="flex items-center gap-3 p-4 bg-industrial-success/10 text-industrial-success rounded-xl border border-industrial-success/20">
                <CheckCircle2 size={20} />
                <p className="font-bold text-sm">No critical weak areas identified!</p>
              </div>
            ) : (
              weakAreas.map(area => (
                <div key={area.name} className="p-4 bg-industrial-bg rounded-xl border border-industrial-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-industrial-dark">{area.name}</span>
                    <span className="text-xs font-black text-industrial-error">{area.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-industrial-border rounded-full overflow-hidden">
                    <div className="h-full bg-industrial-error" style={{ width: `${area.score}%` }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <p className="mt-6 text-xs text-industrial-muted leading-relaxed">
            *Weak areas are identified for process categories where your accuracy fell below 70%.
          </p>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-industrial-surface p-8 rounded-2xl border border-industrial-border shadow-sm">
          <h3 className="text-xl font-bold text-industrial-dark mb-6">Quick Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border-b border-industrial-border">
              <span className="text-industrial-muted">Total Questions</span>
              <span className="font-bold text-industrial-dark">{attempt.answers.length}</span>
            </div>
            <div className="flex justify-between items-center p-4 border-b border-industrial-border text-industrial-success font-bold">
              <span>Correct Answers</span>
              <span>{attempt.answers.filter(a => a.isCorrect).length}</span>
            </div>
            <div className="flex justify-between items-center p-4 text-industrial-error font-bold">
              <span>Incorrect Answers</span>
              <span>{attempt.answers.filter(a => !a.isCorrect).length}</span>
            </div>
          </div>
          
          <Link 
            href="/trainer/history"
            className="w-full mt-6 py-3 bg-industrial-dark text-industrial-surface rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
          >
            View Attempt History
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
