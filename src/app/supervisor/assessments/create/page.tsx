"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Search, CheckSquare, Square } from "lucide-react";
import Link from "next/link";

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    passMarks: 70,
    status: true,
  });

  useEffect(() => {
    fetch("/api/questions/list")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setFetching(false);
      });
  }, []);

  const toggleQuestion = (id: number) => {
    setSelectedQuestions(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          questionIds: selectedQuestions,
          totalMarks: selectedQuestions.length * 10, // Assuming 10 marks per question
        }),
      });

      if (res.ok) {
        router.push("/supervisor/assessments");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (fetching) return <div className="p-8">Loading question bank...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/supervisor/assessments" className="p-2 hover:bg-industrial-surface-secondary rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-industrial-dark">Create Assessment</h1>
          <p className="text-industrial-muted">Assemble questions into a new evaluation set.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Config */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-industrial-surface p-6 rounded-2xl border border-industrial-border shadow-sm space-y-4">
            <h3 className="font-bold text-industrial-dark border-b border-industrial-border pb-2">Configuration</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-industrial-muted uppercase">Assessment Title</label>
              <input
                type="text"
                required
                className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg outline-none focus:ring-2 focus:ring-industrial-primary"
                placeholder="e.g. Q3 Fiber Prep Certification"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-industrial-muted uppercase">Pass Percentage (%)</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg outline-none focus:ring-2 focus:ring-industrial-primary"
                value={formData.passMarks}
                onChange={(e) => setFormData({ ...formData, passMarks: parseInt(e.target.value) })}
              />
            </div>

            <div className="pt-4 border-t border-industrial-border">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-industrial-muted">Selected Questions:</span>
                <span className="font-bold text-industrial-dark">{selectedQuestions.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-industrial-muted">Total Possible Marks:</span>
                <span className="font-bold text-industrial-dark">{selectedQuestions.length * 10}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || selectedQuestions.length === 0}
              className="w-full bg-industrial-dark text-industrial-surface py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Publish Assessment
            </button>
          </div>
        </div>

        {/* Right Column: Question Selector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-industrial-surface p-6 rounded-2xl border border-industrial-border shadow-sm flex flex-col h-[600px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-industrial-dark">Select Questions</h3>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-industrial-muted" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="pl-10 pr-4 py-2 bg-industrial-bg border border-industrial-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-industrial-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-12 text-industrial-muted">
                  No questions match your search.
                </div>
              ) : (
                filteredQuestions.map((q) => (
                  <div 
                    key={q.id}
                    onClick={() => toggleQuestion(q.id)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-4 ${
                      selectedQuestions.includes(q.id) 
                        ? 'bg-industrial-primary/5 border-industrial-primary' 
                        : 'bg-industrial-bg border-industrial-border hover:border-industrial-muted'
                    }`}
                  >
                    <div className="mt-1">
                      {selectedQuestions.includes(q.id) ? (
                        <CheckSquare className="text-industrial-primary" size={20} />
                      ) : (
                        <Square className="text-industrial-border" size={20} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-industrial-dark/10 text-industrial-dark">
                          {q.category?.name}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-industrial-muted/10 text-industrial-muted">
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-industrial-dark leading-snug">{q.questionText}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
