import { db } from "@/db";
import { attempts, assessments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { 
  History, 
  Calendar, 
  TrendingUp, 
  ChevronRight,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default async function HistoryPage() {
  const session = await getSession();
  const trainerId = session.user.id;

  const allAttempts = await db.query.attempts.findMany({
    where: eq(attempts.trainerId, trainerId),
    with: {
      assessment: true,
    },
    orderBy: [desc(attempts.submittedAt)],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-industrial-dark">Attempt History</h1>
        <p className="text-industrial-muted">Review your previous performance and process assessments.</p>
      </div>

      <div className="bg-industrial-surface rounded-3xl border border-industrial-border shadow-sm overflow-hidden">
        {allAttempts.length === 0 ? (
          <div className="p-20 text-center">
            <History size={64} className="mx-auto text-industrial-border mb-4" />
            <p className="text-industrial-muted">You haven&apos;t taken any assessments yet.</p>
            <Link href="/trainer/assessments" className="mt-4 inline-block text-industrial-secondary font-bold hover:underline">
              Take your first assessment →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-industrial-bg border-b border-industrial-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-industrial-muted uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-industrial-muted uppercase tracking-wider">Assessment</th>
                  <th className="px-6 py-4 text-xs font-bold text-industrial-muted uppercase tracking-wider text-center">Score</th>
                  <th className="px-6 py-4 text-xs font-bold text-industrial-muted uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-industrial-muted uppercase tracking-wider text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-border">
                {allAttempts.map((att) => (
                  <tr key={att.id} className="hover:bg-industrial-bg/50 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-industrial-dark font-medium">
                        <Calendar size={14} className="text-industrial-muted" />
                        {att.submittedAt?.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-industrial-dark">{att.assessment?.title}</p>
                      <p className="text-xs text-industrial-muted">Production Standards v1</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1 font-black text-industrial-primary">
                        {Math.round(Number(att.percentage))}%
                        <TrendingUp size={12} className="text-industrial-success" />
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        att.result === 'pass' ? 'bg-industrial-success/10 text-industrial-success' : 'bg-industrial-error/10 text-industrial-error'
                      }`}>
                        {att.result}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link 
                        href={`/trainer/results/${att.id}`}
                        className="inline-flex items-center gap-1 text-sm font-bold text-industrial-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View Details
                        <ExternalLink size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
