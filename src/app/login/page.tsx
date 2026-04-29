"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Factory, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "trainer";
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(role === "supervisor" ? "/supervisor" : "/trainer");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-industrial-surface p-8 rounded-2xl border border-industrial-border shadow-lg w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-industrial-dark text-industrial-surface rounded-xl mb-4">
          <Factory size={32} />
        </div>
        <h1 className="text-2xl font-bold text-industrial-dark capitalize">{role} Login</h1>
        <p className="text-industrial-muted">Access the assessment portal</p>
      </div>

      {error && (
        <div className="bg-industrial-error/10 border border-industrial-error/20 text-industrial-error p-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-industrial-dark mb-1">
            Username
          </label>
          <input
            type="text"
            required
            className="w-full p-3 bg-industrial-bg border border-industrial-border rounded-lg focus:ring-2 focus:ring-industrial-primary outline-none transition-all"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-industrial-dark text-industrial-surface rounded-lg font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={20} />}
          Sign In
        </button>
      </form>

      {role === "supervisor" && (
        <p className="mt-6 text-center text-sm text-industrial-muted">
          New supervisor? <Link href="/signup" className="text-industrial-primary font-bold hover:underline">Register here</Link>
        </p>
      )}
      
      <p className="mt-4 text-center text-sm text-industrial-muted">
        <Link href="/" className="hover:text-industrial-dark transition-colors underline">Back to Home</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-industrial-bg flex items-center justify-center p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
