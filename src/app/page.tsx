import Link from "next/link";
import { Factory, GraduationCap, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-industrial-bg flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-industrial-dark rounded-xl text-industrial-surface">
              <Factory size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-industrial-dark tracking-tight">
            Fiber Train Assessment System
          </h1>
          <p className="text-industrial-muted max-w-2xl mx-auto text-lg">
            Standardizing optical fiber cable production expertise. Ensure trainer consistency, 
            identify process gaps, and drive manufacturing excellence through rigorous assessment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Supervisor Card */}
          <div className="bg-industrial-surface p-8 rounded-2xl border border-industrial-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-industrial-primary/10 text-industrial-primary rounded-lg flex items-center justify-center mb-6 mx-auto">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-2xl font-bold text-industrial-dark mb-4">Supervisor</h2>
            <p className="text-industrial-muted mb-8">
              Manage question banks, create assessments, oversee trainers, and analyze performance metrics.
            </p>
            <Link 
              href="/login?role=supervisor"
              className="inline-block w-full py-3 px-6 bg-industrial-dark text-industrial-surface rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Supervisor Portal
            </Link>
          </div>

          {/* Trainer Card */}
          <div className="bg-industrial-surface p-8 rounded-2xl border border-industrial-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-industrial-secondary/10 text-industrial-secondary rounded-lg flex items-center justify-center mb-6 mx-auto">
              <GraduationCap size={28} />
            </div>
            <h2 className="text-2xl font-bold text-industrial-dark mb-4">Trainer</h2>
            <p className="text-industrial-muted mb-8">
              Access assigned assessments, view personal performance, and identify areas for professional growth.
            </p>
            <Link 
              href="/login?role=trainer"
              className="inline-block w-full py-3 px-6 bg-industrial-secondary text-industrial-surface rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Trainer Portal
            </Link>
          </div>
        </div>

        <div className="pt-12 border-t border-industrial-border mt-12 flex flex-col md:flex-row justify-between items-center text-industrial-muted text-sm">
          <div>© 2026 Fiber Train Assessment System</div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span>Production Version 1.0</span>
            <span>System Status: <span className="text-industrial-success font-bold">● Operational</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
