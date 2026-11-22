import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/features/auth/token";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE); // apaga o cookie: o navegador perde o "crachá"
  return response;
}