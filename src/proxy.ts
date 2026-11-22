import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/features/auth/token";

// roda antes de toda página. Só olha o cookie (checagem rápida).
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/login";

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const userId = await verifySessionToken(token);

  // Sem sessão válida em qualquer página que não seja o login: manda para o login.
  if (!userId && !isLoginPage) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";

    const response = NextResponse.redirect(loginUrl);
    if (token) response.cookies.delete(SESSION_COOKIE); // cookie inválido ou expirado: limpa
    return response;
  }

  // Já logado e abriu o login: leva direto para o painel.
  if (userId && isLoginPage) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Roda em todas as páginas, menos nas rotas /api (o login precisa ficar aberto),
// nos arquivos internos do Next e no favicon.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};