"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AddQuestionPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    categoryId: "",
    questionText: "",
    questionType: "mcq",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    explanation: "",
    difficulty: "medium",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setFetching(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/supervisor/questions");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8">Loading categories...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/supervisor/questions" className="p-2 hover:bg-industrial-surface-secondary rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-industrial-dark">Add New Question</h1>
          <p className="text-industrial-muted">Create a new assessment item for the question bank.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-industrial-surface p-8 rounded-2xl border border-industrial-border shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-industrial-dark">Process Category</label>
            <select
              required
              className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg outline-none focus:ring-2 focus:ring-industrial-primary"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-industrial-dark">Difficulty Level</label>
            <select
              className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg outline-none focus:ring-2 focus:ring-industrial-primary"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-industrial-dark">Question Text</label>
          <textarea
            required
            rows={3}
            className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg outline-none focus:ring-2 focus:ring-industrial-primary"
            placeholder="Enter the question here..."
            value={formData.questionText}
            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Option A", key: "optionA", code: "A" },
            { label: "Option B", key: "optionB", code: "B" },
            { label: "Option C", key: "optionC", code: "C" },
            { label: "Option D", key: "optionD", code: "D" },
          ].map((opt) => (
            <div key={opt.code} className="space-y-2">
              <label className="text-sm font-bold text-industrial-dark">{opt.label}</label>
              <input
                type="text"
                required
                className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg outline-none focus:ring-2 focus:ring-industrial-primary"
                value={(formData as any)[opt.key]}
                onChange={(e) => setFormData({ ...formData, [opt.key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-industrial-dark">Correct Answer</label>
            <select
              className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg outline-none focus:ring-2 focus:ring-industrial-primary font-bold text-industrial-primary"
              value={formData.correctAnswer}
              onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
            >
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-industrial-dark">Question Type</label>
            <select
              className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg outline-none focus:ring-2 focus:ring-industrial-primary"
              value={formData.questionType}
              onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
            >
              <option value="mcq">Multiple Choice (MCQ)</option>
              <option value="scenario">Scenario-Based</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-industrial-dark">Explanation (Optional)</label>
          <textarea
            rows={2}
            className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg outline-none focus:ring-2 focus:ring-industrial-primary"
            placeholder="Explain why the answer is correct..."
            value={formData.explanation}
            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          />
        </div>

        <div className="pt-6 border-t border-industrial-border flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-industrial-dark text-industrial-surface px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-md"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Question
          </button>
        </div>
      </form>
    </div>
  );
}
