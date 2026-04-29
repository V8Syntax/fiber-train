"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login?role=supervisor");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-industrial-bg flex items-center justify-center p-6">
      <div className="bg-industrial-surface p-8 rounded-2xl border border-industrial-border shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-industrial-primary text-industrial-surface rounded-xl mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-industrial-dark">Supervisor Setup</h1>
          <p className="text-industrial-muted">Create your administrator account</p>
        </div>

        {error && (
          <div className="bg-industrial-error/10 border border-industrial-error/20 text-industrial-error p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-industrial-dark mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg focus:ring-2 focus:ring-industrial-primary outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-dark mb-1">
              Username
            </label>
            <input
              type="text"
              required
              className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg focus:ring-2 focus:ring-industrial-primary outline-none transition-all"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-dark mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg focus:ring-2 focus:ring-industrial-primary outline-none transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-industrial-primary text-industrial-surface rounded-lg font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-industrial-muted">
          Already have an account? <Link href="/login?role=supervisor" className="text-industrial-primary font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
