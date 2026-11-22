"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "./hooks";

export function LogoutButton() {
  const logout = useLogout();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Sair"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
    >
      <LogOut className="h-5 w-5" aria-hidden />
    </Button>
  );
}