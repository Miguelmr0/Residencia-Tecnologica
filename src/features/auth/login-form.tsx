"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  Globe,
  Info,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";
import { Cards } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DEMO_CREDENTIALS, InvalidCredentialsError } from "@/mocks/auth";
import { useLogin } from "./hooks";
import { loginSchema, type LoginFormValues } from "./schema";

const SIMULATED_NOTICE =
  "Este recurso é simulado neste protótipo e ainda não está disponível. Entre com e-mail e senha.";

type BannerTone = "danger" | "success" | "info";

const bannerStyles: Record<BannerTone, string> = {
  danger: "bg-danger-50 text-danger-700",
  success: "bg-emerald-50 text-emerald-700",
  info: "bg-brand-50 text-brand-700",
};

function Banner({ tone, icon: Icon, children }: { tone: BannerTone; icon: LucideIcon; children: ReactNode }) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("flex items-start gap-2 rounded-lg p-3 text-sm font-medium", bannerStyles[tone])}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p>{children}</p>
    </div>
  );
}

function InlineAction({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-sm font-semibold text-brand-700 underline-offset-2 hover:underline",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
        className
      )}
    >
      {children}
    </button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    resetField,
    setFocus,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", remember: false },
  });

  useEffect(() => {
    if (!login.isSuccess) return;
    const timer = setTimeout(() => router.replace("/dashboard"), 800);
    return () => clearTimeout(timer);
  }, [login.isSuccess, router]);

  const busy = login.isPending || login.isSuccess;

  function showNotice() {
    setNotice(SIMULATED_NOTICE);
  }

  function onSubmit(values: LoginFormValues) {
    setNotice(null);
    login.mutate(values, {
      onError: () => {
        resetField("password");
        setFocus("password");
      },
    });
  }

  function handleSso() {
    setNotice(null);
    login.mutate({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
      remember: false,
    });
  }

  const errorMessage =
    login.error instanceof InvalidCredentialsError
      ? login.error.message
      : "Não foi possível entrar agora. Tente novamente em instantes.";

  return (
    <div className="w-full max-w-md space-y-4">
      <Cards className="space-y-5 sm:p-8">
        <BrandLogo className="lg:hidden" />

        <div>
          <h1 className="text-xl font-bold">Acesse sua conta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Insira suas credenciais corporativas para entrar no console VendorHub.
          </p>
        </div>

        <div>
          <Button
            type="button"
            variant="secondary"
            className="h-11 w-full bg-brand-50 text-ink hover:bg-brand-100"
            onClick={handleSso}
            disabled={busy}
          >
            <KeyRound aria-hidden />
            Entrar com SSO Corporativo
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Microsoft Entra ID • Google Workspace • Okta
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground" aria-hidden>
          <span className="h-px flex-1 bg-slate-200" />
          ou continue com e-mail corporativo
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {login.isError && (
          <Banner tone="danger" icon={CircleAlert}>
            {errorMessage}
          </Banner>
        )}
        {login.isSuccess && (
          <Banner tone="success" icon={CircleCheck}>
            Login realizado com sucesso. Redirecionando para o painel...
          </Banner>
        )}
        {notice && !login.isError && !login.isSuccess && (
          <Banner tone="info" icon={Info}>
            {notice}
          </Banner>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            label="E-mail corporativo"
            type="email"
            inputMode="email"
            autoComplete="username"
            placeholder="nome@empresa.com.br"
            icon={Mail}
            error={errors.email?.message}
            readOnly={busy}
            {...register("email")}
          />

          <Input
            label="Senha de acesso"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Digite sua senha"
            icon={Lock}
            error={errors.password?.message}
            readOnly={busy}
            labelAction={
              <InlineAction onClick={showNotice} className="text-xs">
                Esqueceu a senha?
              </InlineAction>
            }
            endAdornment={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
              </Button>
            }
            {...register("password")}
          />

          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" className="h-4 w-4 accent-brand-700" {...register("remember")} />
            Lembrar deste dispositivo por 30 dias
          </label>

          <Button type="submit" className="h-11 w-full text-sm" disabled={busy} aria-busy={login.isPending}>
            {login.isPending ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Entrando...
              </>
            ) : login.isSuccess ? (
              "Redirecionando..."
            ) : (
              <>
                Entrar no VendorHub
                <ArrowRight aria-hidden />
              </>
            )}
          </Button>
        </form>

        <div className="flex items-start gap-2 rounded-lg bg-brand-50 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden />
          <p>
            Conexão protegida por autenticação multifator (MFA). Ao continuar, você concorda com a
            conformidade com a{" "}
            <InlineAction onClick={showNotice}>Política de Segurança da Informação</InlineAction> e os{" "}
            <InlineAction onClick={showNotice}>Termos de Uso</InlineAction>.
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Sua empresa ainda não possui acesso ao VendorHub?{" "}
          <InlineAction onClick={showNotice}>Solicitar demonstração institucional</InlineAction>
        </p>
      </Cards>

      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
        <p className="flex items-center gap-2">
          <span aria-hidden className="h-2 w-2 rounded-full bg-emerald-500" />
          Status do Sistema: <span className="font-semibold text-ink">Todos os serviços operacionais</span>
        </p>
        <p className="flex items-center gap-3">
          <InlineAction onClick={showNotice} className="font-medium text-muted-foreground">
            Central de Ajuda
          </InlineAction>
          <span className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" aria-hidden />
            Português (Brasil)
          </span>
        </p>
      </div>
    </div>
  );
}