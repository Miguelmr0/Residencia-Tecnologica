"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FolderOpen,
  LayoutDashboard,
  ListChecks,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}
const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/unidades", label: "Fornecedores", icon: Building2 },
  { href: "/documentos", label: "Documentos", icon: FolderOpen },
  { href: "/tarefas", label: "Tarefas", icon: ListChecks },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}
export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-white p-4 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-6 flex items-center gap-3 px-2 pt-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 font-bold text-white">
            V
          </div>
          <span className="text-xl font-bold text-brand-700">VendorHub</span>
        </div>

        <nav aria-label="Navegação principal" className="flex flex-1 flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                  active ? "bg-brand-100 text-brand-700" : "text-muted hover:bg-slate-50"
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 rounded-xl bg-brand-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">
            MS
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Mariana Silva</p>
            <p className="truncate text-xs text-muted">Compras / Admin</p>
          </div>
          <button type="button" aria-label="Sair" className="rounded-md p-2 text-muted hover:bg-white">
            <LogOut className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </aside>
    </>
  );
}