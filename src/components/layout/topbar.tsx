import { Bell, CircleHelp, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 bg-white/80 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        aria-label="Abrir menu"
        className="lg:hidden"
      >
        <Menu className="h-6 w-6" aria-hidden />
      </Button>

      <div className="relative max-w-xl flex-1">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          aria-label="Buscar fornecedores e documentos"
          placeholder="Buscar fornecedores, docs..."
          className="w-full rounded-lg bg-brand-50 py-2.5 pl-10 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
        />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="hidden sm:block">
          <Button variant="ghost">
            <CircleHelp className="h-5 w-5" aria-hidden />
            Suporte
          </Button>
        </div>

        <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
          <Bell className="h-5 w-5" aria-hidden />
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger-700 text-[10px] font-bold text-white">
            3
          </span>
        </Button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-white">
          <User className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </header>
  );
}