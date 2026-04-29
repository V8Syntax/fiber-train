import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, User, UserCheck, UserX, Mail, Key } from "lucide-react";

export default async function TrainersPage() {
  const trainers = await db.query.users.findMany({
    where: eq(users.role, "trainer"),
    orderBy: [desc(users.createdAt)],
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-industrial-dark">Trainer Management</h1>
          <p className="text-industrial-muted">Manage trainer accounts and their access status.</p>
        </div>
        <Link
          href="/supervisor/trainers/add"
          className="bg-industrial-primary text-industrial-surface px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm"
        >
          <Plus size={20} />
          Add New Trainer
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.length === 0 ? (
          <div className="col-span-full bg-industrial-surface p-12 rounded-2xl border border-industrial-border text-center">
            <User size={48} className="mx-auto text-industrial-border mb-4" />
            <p className="text-industrial-muted">No trainers registered yet.</p>
          </div>
        ) : (
          trainers.map((trainer) => (
            <div key={trainer.id} className="bg-industrial-surface p-6 rounded-2xl border border-industrial-border shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-industrial-bg rounded-xl flex items-center justify-center text-industrial-dark font-bold">
                  {trainer.name.charAt(0)}
                </div>
                {trainer.status ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-industrial-success bg-industrial-success/10 px-2 py-1 rounded-full uppercase">
                    <UserCheck size={12} /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-industrial-error bg-industrial-error/10 px-2 py-1 rounded-full uppercase">
                    <UserX size={12} /> Inactive
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-industrial-dark mb-1">{trainer.name}</h3>
              <p className="text-sm text-industrial-muted mb-6 flex items-center gap-2">
                <Mail size={14} /> @{trainer.username}
              </p>

              <div className="flex border-t border-industrial-border pt-4 gap-2">
                <button className="flex-1 py-2 text-sm font-bold bg-industrial-bg text-industrial-dark rounded-lg hover:bg-industrial-surface-secondary transition-colors flex items-center justify-center gap-2">
                  <Key size={14} /> Reset Pwd
                </button>
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
