"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, Users, Home } from "lucide-react";
import { classNames } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/members", label: "Members", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex sm:flex-col w-60 shrink-0 border-r border-stone-100 bg-white/70 px-4 py-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-soft">
            <Home size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-800 leading-tight">Hostel Tracker</p>
            <p className="text-xs text-stone-400 leading-tight">Monthly expenses</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-amber-50 text-amber-700"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-around border-t border-stone-100 bg-white/95 backdrop-blur px-2 py-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={classNames(
                "flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 text-xs font-medium",
                active ? "text-amber-600" : "text-stone-400"
              )}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
