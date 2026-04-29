import { db } from "@/db";
import { assessments } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, ClipboardList, Calendar, Users, Target } from "lucide-react";

export default async function AssessmentsPage() {
  const allAssessments = await db.query.assessments.findMany({
    orderBy: [desc(assessments.createdAt)],
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-industrial-dark">Assessments</h1>
          <p className="text-industrial-muted">Create and manage process evaluation assessments.</p>
        </div>
        <Link
          href="/supervisor/assessments/create"
          className="bg-industrial-primary text-industrial-surface px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm"
        >
          <Plus size={20} />
          Create New Assessment
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAssessments.length === 0 ? (
          <div className="col-span-full bg-industrial-surface p-12 rounded-2xl border border-industrial-border text-center">
            <ClipboardList size={48} className="mx-auto text-industrial-border mb-4" />
            <p className="text-industrial-muted">No assessments created yet.</p>
          </div>
        ) : (
          allAssessments.map((assessment) => (
            <div key={assessment.id} className="bg-industrial-surface p-6 rounded-2xl border border-industrial-border shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${
                  assessment.status ? 'bg-industrial-success/10 text-industrial-success' : 'bg-industrial-muted/10 text-industrial-muted'
                }`}>
                  {assessment.status ? 'Published' : 'Draft'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-industrial-dark mb-4 pr-16">{assessment.title}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-industrial-muted">
                  <Target size={16} className="text-industrial-primary" />
                  <span>Pass Marks: <b className="text-industrial-dark">{assessment.passMarks}/{assessment.totalMarks}</b></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-industrial-muted">
                  <Calendar size={16} />
                  <span>Created: {assessment.createdAt?.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2 border-t border-industrial-border pt-4">
                <Link 
                  href={`/supervisor/assessments/view/${assessment.id}`}
                  className="flex-1 py-2 text-sm font-bold bg-industrial-bg text-industrial-dark rounded-lg hover:bg-industrial-surface-secondary transition-colors text-center"
                >
                  View Details
                </Link>
                <button className="px-3 py-2 text-sm font-bold bg-industrial-bg text-industrial-dark rounded-lg hover:bg-industrial-surface-secondary transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
