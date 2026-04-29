import { db } from "@/db";
import { users, questions, assessments, attempts } from "@/db/schema";
import { count, eq, avg } from "drizzle-orm";
import { 
  Users, 
  HelpCircle, 
  ClipboardList, 
  CheckCircle2, 
  TrendingUp,
  AlertTriangle
} from "lucide-react";

export default async function SupervisorDashboard() {
  const [trainerCount] = await db.select({ value: count() }).from(users).where(eq(users.role, "trainer"));
  const [questionCount] = await db.select({ value: count() }).from(questions);
  const [assessmentCount] = await db.select({ value: count() }).from(assessments);
  const [attemptsResult] = await db.select({ value: count() }).from(attempts);
  const [avgScore] = await db.select({ value: avg(attempts.percentage) }).from(attempts);

  const stats = [
    { name: "Total Trainers", value: trainerCount?.value || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { name: "Question Bank", value: questionCount?.value || 0, icon: HelpCircle, color: "text-amber-600", bg: "bg-amber-100" },
    { name: "Assessments", value: assessmentCount?.value || 0, icon: ClipboardList, color: "text-purple-600", bg: "bg-purple-100" },
    { name: "Attempts Taken", value: attemptsResult?.value || 0, icon: CheckCircle2, color: "text-industrial-secondary", bg: "bg-industrial-secondary/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-industrial-dark">Supervisor Dashboard</h1>
        <p className="text-industrial-muted">Overview of trainer performance and system activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-industrial-surface p-6 rounded-2xl border border-industrial-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <TrendingUp size={20} className="text-industrial-success" />
            </div>
            <p className="text-industrial-muted text-sm font-medium">{stat.name}</p>
            <h3 className="text-2xl font-bold text-industrial-dark">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pass Rate Card */}
        <div className="lg:col-span-2 bg-industrial-surface p-8 rounded-2xl border border-industrial-border shadow-sm">
          <h3 className="text-xl font-bold text-industrial-dark mb-6">Global Performance</h3>
          <div className="flex items-end gap-4 mb-8">
            <span className="text-5xl font-black text-industrial-primary">
              {avgScore?.value ? Math.round(Number(avgScore.value)) : 0}%
            </span>
            <span className="text-industrial-muted mb-2 font-medium">Average Pass Rate</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Recent Pass Rate Trend</span>
              <span className="text-industrial-success">+2.4% vs last month</span>
            </div>
            <div className="w-full h-3 bg-industrial-bg rounded-full overflow-hidden">
              <div 
                className="h-full bg-industrial-primary rounded-full" 
                style={{ width: `${avgScore?.value || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Weak Areas Card */}
        <div className="bg-industrial-surface p-8 rounded-2xl border border-industrial-border shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-industrial-error">
            <AlertTriangle size={20} />
            <h3 className="text-xl font-bold text-industrial-dark">Weak Process Areas</h3>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-industrial-bg rounded-xl border border-industrial-border">
              <p className="text-sm font-bold text-industrial-dark mb-1">Rework Decisions</p>
              <p className="text-xs text-industrial-muted">38% average score in latest assessments</p>
            </div>
            <div className="p-4 bg-industrial-bg rounded-xl border border-industrial-border">
              <p className="text-sm font-bold text-industrial-dark mb-1">Defect Identification</p>
              <p className="text-xs text-industrial-muted">52% average score in latest assessments</p>
            </div>
            <div className="mt-6">
              <button className="w-full py-2 text-sm font-bold text-industrial-primary hover:underline">
                View Full Analysis Report →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
