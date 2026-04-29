"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AddTrainerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/supervisor/trainers");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create trainer");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/supervisor/trainers" className="p-2 hover:bg-industrial-surface-secondary rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-industrial-dark">Add New Trainer</h1>
          <p className="text-industrial-muted">Create an account for a manufacturing process trainer.</p>
        </div>
      </div>

      <div className="bg-industrial-surface p-8 rounded-2xl border border-industrial-border shadow-sm">
        {error && (
          <div className="bg-industrial-error/10 border border-industrial-error/20 text-industrial-error p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-industrial-dark">Full Name</label>
            <input
              type="text"
              required
              className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg outline-none focus:ring-2 focus:ring-industrial-primary"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-industrial-dark">Username</label>
            <input
              type="text"
              required
              className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg outline-none focus:ring-2 focus:ring-industrial-primary"
              placeholder="e.g. john.doe"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-industrial-dark">Temporary Password</label>
            <input
              type="text"
              required
              className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg outline-none focus:ring-2 focus:ring-industrial-primary"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="pt-6 border-t border-industrial-border flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-industrial-primary text-industrial-surface px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-md"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
              Create Trainer Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
