"use client";
import { useAuth } from "@/lib/auth";

export default function RoleSwitch() {
  const { user, users, setUserId } = useAuth();
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/50 hidden md:inline">View as:</span>
      <select value={user.id} onChange={e=>setUserId(e.target.value)} className="h-8 rounded-full bg-[#0f1a33] border border-white/15 px-3 text-xs">
        {users.map(u=> <option key={u.id} value={u.id}>{u.name} — {u.role}</option>)}
      </select>
      <span className={`text-[10px] px-2 py-1 rounded-full border ${user.role==="CEO"?"bg-[#d4a843]/15 text-[#d4a843] border-[#d4a843]/30":"bg-white/10 text-white/70 border-white/10"}`}>{user.role}</span>
    </div>
  );
}
