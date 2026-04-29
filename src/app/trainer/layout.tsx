import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ClipboardList, 
  History, 
  BarChart3, 
  Factory
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default async function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.user.role !== "trainer") {
    redirect("/login?role=trainer");
  }

  const navItems = [
    { name: "Dashboard", href: "/trainer", icon: LayoutDashboard },
    { name: "Available Assessments", href: "/trainer/assessments", icon: ClipboardList },
    { name: "My History", href: "/trainer/history", icon: History },
    { name: "Weak Areas", href: "/trainer/analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-industrial-bg flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-industrial-dark text-industrial-surface flex flex-col md:fixed md:inset-y-0">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <Factory size={28} className="text-industrial-secondary" />
          <span className="font-bold text-lg leading-tight">FTAS Trainer</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <item.icon size={20} className="group-hover:text-industrial-secondary transition-colors" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-industrial-secondary flex items-center justify-center text-xs font-bold">
              {session.user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-xs text-industrial-muted truncate">Process Trainer</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
