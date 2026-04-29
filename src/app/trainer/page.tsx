import { db } from "@/db";
import { assessments, attempts, users } from "@/db/schema";
import { eq, desc, avg, count } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { 
  Trophy, 
  Target, 
  AlertCircle, 
  ArrowRight,
  ClipboardCheck
} from "lucide-react";
import Link from "next/link";

export default async function TrainerDashboard() {
  const session = await getSession();
  const trainerId = session.user.id;

  const [attemptCount] = await db.select({ value: count() }).from(attempts).where(eq(attempts.trainerId, trainerId));
  const [avgScore] = await db.select({ value: avg(attempts.percentage) }).from(attempts).where(eq(attempts.trainerId, trainerId));
  const [passCount] = await db.select({ value: count() }).from(attempts).where(eq(attempts.result, 'pass'));
  
  const recentAttempts = await db.query.attempts.findMany({
    where: eq(attempts.trainerId, trainerId),
    with: {
      assessment: true,
    },
    orderBy: [desc(attempts.submittedAt)],
    limit: 5,
  });

  const availableAssessments = await db.query.assessments.findMany({
    where: eq(assessments.status, true),
    limit: 3,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-industrial-dark">Welcome, {session.user.name}</h1>
        <p className="text-industrial-muted">Monitor your performance and continue your training assessments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-industrial-surface p-6 rounded-2xl border border-industrial-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-industrial-secondary/10 text-industrial-secondary rounded-xl">
              <ClipboardCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-industrial-muted">Assessments Taken</p>
              <h3 className="text-2xl font-bold text-industrial-dark">{attemptCount?.value || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-industrial-surface p-6 rounded-2xl border border-industrial-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-industrial-primary/10 text-industrial-primary rounded-xl">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-industrial-muted">Average Percentage</p>
              <h3 className="text-2xl font-bold text-industrial-dark">{avgScore?.value ? Math.round(Number(avgScore.value)) : 0}%</h3>
            </div>
          </div>
        </div>
        <div className="bg-industrial-surface p-6 rounded-2xl border border-industrial-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-industrial-success/10 text-industrial-success rounded-xl">
              <Target size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-industrial-muted">Clearance Status</p>
              <h3 className="text-2xl font-bold text-industrial-dark">
                {Number(avgScore?.value) >= 70 ? 'Certified' : 'In Review'}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Assessments */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-industrial-dark">Available Assessments</h3>
            <Link href="/trainer/assessments" className="text-sm font-bold text-industrial-secondary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {availableAssessments.length === 0 ? (
              <p className="text-center py-8 text-industrial-muted bg-industrial-surface rounded-xl border border-dotted border-industrial-border">No assessments currently assigned.</p>
            ) : (
              availableAssessments.map(a => (
                <div key={a.id} className="bg-industrial-surface p-4 rounded-xl border border-industrial-border flex items-center justify-between group hover:border-industrial-secondary transition-colors">
                  <div>
                    <p className="font-bold text-industrial-dark">{a.title}</p>
                    <p className="text-xs text-industrial-muted">{a.totalMarks} Total Marks • Required: {a.passMarks}</p>
                  </div>
                  <Link 
                    href={`/trainer/take/${a.id}`}
                    className="p-2 bg-industrial-bg text-industrial-dark rounded-lg group-hover:bg-industrial-secondary group-hover:text-white transition-all"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Results */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-industrial-dark">Recent Results</h3>
          <div className="bg-industrial-surface rounded-2xl border border-industrial-border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-industrial-bg border-b border-industrial-border text-[10px] uppercase font-bold text-industrial-muted tracking-wider">
                <tr>
                  <th className="px-4 py-3">Assessment</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-border">
                {recentAttempts.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-industrial-muted italic">No results yet.</td>
                  </tr>
                ) : (
                  recentAttempts.map(att => (
                    <tr key={att.id}>
                      <td className="px-4 py-3 text-sm font-medium text-industrial-dark">{att.assessment?.title}</td>
                      <td className="px-4 py-3 text-sm font-bold text-industrial-primary">{Math.round(Number(att.percentage))}%</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          att.result === 'pass' ? 'bg-industrial-success/10 text-industrial-success' : 'bg-industrial-error/10 text-industrial-error'
                        }`}>
                          {att.result}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
