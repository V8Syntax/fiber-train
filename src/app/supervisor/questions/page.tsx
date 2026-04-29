import { db } from "@/db";
import { questions, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, Edit, Trash2, HelpCircle } from "lucide-react";

export default async function QuestionsPage() {
  const allQuestions = await db.query.questions.findMany({
    with: {
      category: true,
    },
    orderBy: [desc(questions.createdAt)],
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-industrial-dark">Question Bank</h1>
          <p className="text-industrial-muted">Manage the repository of assessment questions.</p>
        </div>
        <Link
          href="/supervisor/questions/add"
          className="bg-industrial-primary text-industrial-surface px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm"
        >
          <Plus size={20} />
          Add New Question
        </Link>
      </div>

      <div className="bg-industrial-surface rounded-2xl border border-industrial-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-industrial-bg border-b border-industrial-border">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-industrial-dark uppercase tracking-wider">Question</th>
                <th className="px-6 py-4 text-sm font-bold text-industrial-dark uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-sm font-bold text-industrial-dark uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-sm font-bold text-industrial-dark uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-4 text-sm font-bold text-industrial-dark uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-border">
              {allQuestions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-industrial-muted">
                    <div className="flex flex-col items-center gap-2">
                      <HelpCircle size={48} className="text-industrial-border" />
                      <p>No questions found. Start by adding one!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                allQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-industrial-bg/50 transition-colors">
                    <td className="px-6 py-4 max-w-md">
                      <p className="font-medium text-industrial-dark line-clamp-1">{q.questionText}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-industrial-muted">
                      {q.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${
                        q.questionType === 'mcq' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {q.questionType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold uppercase ${
                        q.difficulty === 'easy' ? 'text-industrial-success' : 
                        q.difficulty === 'medium' ? 'text-amber-600' : 'text-industrial-error'
                      }`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 text-industrial-muted hover:text-industrial-primary transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-industrial-muted hover:text-industrial-error transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
