"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left hover:bg-industrial-error/20 hover:text-industrial-error transition-colors text-industrial-muted"
    >
      <LogOut size={20} />
      <span>Logout</span>
    </button>
  );
}
