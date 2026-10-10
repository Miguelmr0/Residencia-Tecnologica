"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FolderOpen,
  LayoutDashboard,
  ListChecks,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  SquareText,
  Settings,
  RotateCcwClock,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/unidades", label: "Fornecedores", icon: Building2 },
  { href: "/documentos", label: "Documentos", icon: FolderOpen },
  { href: "/contratos", label: "Contratos", icon: SquareText },
  { href: "/tarefas", label: "Tarefas", icon: ListChecks },
  { href: "/historico", label: "Histórico", icon: RotateCcwClock},
  { href: "/settings", label: "Configurações", icon: Settings},
];

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapsed: () => void;
}

export function Sidebar({ open, collapsed, onClose, onToggleCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

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
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-white p-4 transition-[width,transform] duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed && "lg:w-20 lg:px-3"
        )}
      >
        <div
          className={cn(
            "mb-6 flex items-center gap-3 px-2 pt-2 lg:mb-10",
            collapsed && "lg:justify-center lg:px-0"
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-700 font-bold text-white">
            V
          </div>
          <span className={cn("text-xl font-bold text-brand-700", collapsed && "lg:hidden")}>
            VendorHub
          </span>
        </div>

        <div className={cn("mb-3 hidden lg:flex", collapsed ? "justify-center" : "justify-end px-1")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            aria-expanded={!collapsed}
          >
            <ToggleIcon className="h-5 w-5" aria-hidden />
          </Button>
        </div>

        <nav aria-label="Navegação principal" className="flex flex-1 flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                title={collapsed ? label : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                  active ? "bg-brand-100 text-brand-700" : "text-muted-foreground hover:bg-slate-50",
                  collapsed && "lg:justify-center lg:px-0"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className={cn(collapsed && "lg:sr-only")}>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div
          className={cn(
            "flex items-center gap-3 rounded-xl bg-brand-50 p-3",
            collapsed && "lg:flex-col lg:gap-2 lg:p-2"
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">
            MS
          </div>
          <div className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}>
            <p className="truncate text-sm font-semibold">Mariana Silva</p>
            <p className="truncate text-xs text-muted-foreground">Compras / Admin</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Sair">
            <LogOut className="h-5 w-5" aria-hidden />
          </Button>
        </div>
      </aside>
    </>
  );
}