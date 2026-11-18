"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cloneElement, useState, type FormEvent, type ReactElement, type ReactNode } from "react";
import Avatar from "@/components/Avatar";
import { ApiError, NO_ACCESS_MESSAGE, type RecruiterProfile } from "@/lib/recrutadora/api";
import { FOUNDER_FREE, isFounderAccount, useFounderActive } from "./FounderBanner";
import Icon from "./icons";
import { ACTIVATE, BILLING, HOME, usePortal } from "./PortalProvider";

const CARD = "/recrutadora/carteirinha";

export const Brand = ({ href = "/recrutadora" }: { href?: string }) => (
  <Link href={href} className="rp-brand">
    <img src="/logo.svg" alt="" width={38} height={38} />
    <span>
      Guia BIA
      <small>Portal da Recrutadora</small>
    </span>
  </Link>
);

/** Moldura das telas de entrada: painel roxo com a BIA (no computador) e o formulário. */
export function AuthCard({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  const founder = useFounderActive();
  return (
    <div className="rp-auth">
      <aside className="rp-auth-side">
        <Avatar size={120} state="greeting" float />
        <h2>Vagas para mulheres, com quem quer contratar mulheres.</h2>
        <p>Publique suas vagas no app Guia BIA e acompanhe cada candidata em um só lugar.</p>
        <ul>
          <li>
            <span className="ico"><Icon name="sparkle" size={18} /></span>
            {founder ? FOUNDER_FREE : "30 dias grátis para começar"}
          </li>
          <li>
            <span className="ico"><Icon name="heart" size={18} /></span>Vagas afirmativas: mães, 50+, PCD e mais
          </li>
          <li>
            <span className="ico"><Icon name="file" size={18} /></span>Currículos organizados por vaga
          </li>
        </ul>
      </aside>
      <div className="rp-auth-main">
        <div className="rp-auth-card rp-stack">
          <Brand />
          <h1 style={{ marginTop: 8 }}>{title}</h1>
          {intro && <p className="rp-muted">{intro}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}

/** Moldura das telas logadas: barra branca com a navegação e o botão de sair. */
export function PortalShell({ children }: { children: ReactNode }) {
  const { user, profile, logout } = usePortal("user");
  const pathname = usePathname();
  const current = (href: string) => (pathname === href ? "page" : undefined);
  return (
    <>
      <header className="rp-top">
        <div className="wrap">
          <Brand href={profile?.isRecruiter ? HOME : "/recrutadora"} />
          <nav className="rp-nav" aria-label="Portal da Recrutadora">
            {profile?.isRecruiter && (
              <>
                <Link href={HOME} aria-current={current(HOME)}>
                  <Icon name="briefcase" /> <span className="label">Vagas</span>
                </Link>
                <Link href={ACTIVATE} aria-current={current(ACTIVATE)}>
                  <Icon name="building" /> <span className="label">Empresa</span>
                </Link>
                <Link href={BILLING} aria-current={current(BILLING)}>
                  <Icon name="sparkle" /> <span className="label">Assinatura</span>
                </Link>
                {isFounderAccount(user) && (
                  <Link href={CARD} aria-current={current(CARD)} title="Minha carteirinha de Recrutadora Fundadora">
                    <Icon name="badge" /> <span className="label">Carteirinha</span>
                  </Link>
                )}
              </>
            )}
            <button type="button" onClick={logout}>
              <Icon name="logout" /> <span className="label">Sair</span>
            </button>
          </nav>
        </div>
      </header>
      <main className="rp-main">{children}</main>
    </>
  );
}

export const Loading = () => (
  <p className="rp-muted" role="status" style={{ padding: 40, textAlign: "center" }}>
    Carregando…
  </p>
);

export const ErrorMessage = ({ error }: { error: string | null }) =>
  error ? (
    <p className="rp-alert" role="alert">
      {error}
    </p>
  ) : null;

export const Success = ({ children }: { children: ReactNode }) => (
  <p className="rp-ok" role="status">
    {children}
  </p>
);

/** A API só libera as rotas de vagas para quem tem acesso e não foi rejeitada na moderação. */
export const canPublish = (profile: RecruiterProfile | null) =>
  !!profile?.hasAccess && profile.verificationStatus !== "rejected";

/** Aviso de perfil rejeitado ou sem acesso. Devolve null quando a recrutadora pode publicar. */
export function AccessBlock({ profile }: { profile: RecruiterProfile | null }) {
  if (!profile) return null;
  if (profile.verificationStatus === "rejected") {
    return (
      <div className="rp-notice dark" role="alert">
        <span>
          Seu perfil de recrutadora foi rejeitado pela moderação. Não é possível publicar novas vagas. Se
          achar que foi um engano, fale com a equipe BIA em{" "}
          <a href="mailto:bia.comunidade.feminina@gmail.com">bia.comunidade.feminina@gmail.com</a>.
        </span>
      </div>
    );
  }
  if (!profile.hasAccess) {
    return (
      <div className="rp-notice dark" role="alert" style={{ flexWrap: "wrap" }}>
        <Avatar size={52} state="thinking" dot={false} />
        <span style={{ flex: "1 1 260px" }}>{NO_ACCESS_MESSAGE}</span>
        <Link className="rp-btn coral small" href={BILLING}>
          Assinar o BIA Pro
        </Link>
      </div>
    );
  }
  return null;
}

/* ---------- campos e validação ---------- */

export type Rules = {
  required?: boolean;
  min?: number;
  max?: number;
  email?: boolean;
  url?: boolean;
  pattern?: [RegExp, string];
  same?: [string, string];
};

export function validate(values: Record<string, string>, rules: Record<string, Rules>) {
  const errors: Record<string, string> = {};
  for (const [name, r] of Object.entries(rules)) {
    const v = (values[name] ?? "").trim();
    let msg: string | null = null;
    if (!v) msg = r.required ? "Preencha este campo." : null;
    else if (r.min && v.length < r.min) msg = `Use pelo menos ${r.min} caracteres.`;
    else if (r.max && v.length > r.max) msg = `Use no máximo ${r.max} caracteres.`;
    else if (r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "Digite um e-mail válido, como nome@empresa.com.";
    else if (r.url && !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(v)) msg = "O link precisa começar com https:// (ou http://).";
    else if (r.pattern && !r.pattern[0].test(v)) msg = r.pattern[1];
    else if (r.same && v !== (values[r.same[0]] ?? "").trim()) msg = r.same[1];
    if (msg) errors[name] = msg;
  }
  return errors;
}

const fieldId = (name: string) => `campo-${name}`;

function focusFirst(errors: Record<string, string>) {
  const first = Object.keys(errors)[0];
  if (first) requestAnimationFrame(() => document.getElementById(fieldId(first))?.focus());
}

/** Erros por campo: validação local antes de enviar e erros de validação devolvidos pela API. */
export function useFieldErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  return {
    errors,
    setErrors,
    /** Valida e mostra os erros; devolve true se estiver tudo certo. */
    check(values: Record<string, string>, rules: Record<string, Rules>) {
      const e = validate(values, rules);
      setErrors(e);
      focusFirst(e);
      return Object.keys(e).length === 0;
    },
    /** Se a API devolveu erros por campo, mostra embaixo de cada um e devolve true. */
    fromApi(err: unknown) {
      if (!(err instanceof ApiError) || !Object.keys(err.fields).length) return false;
      setErrors(err.fields);
      focusFirst(err.fields);
      return true;
    },
    /** Use no onInput/onChange do form: some o erro do campo que a pessoa está corrigindo. */
    clearOnInput(e: FormEvent<HTMLFormElement>) {
      const name = (e.target as HTMLInputElement).name;
      if (name && errors[name]) setErrors(({ [name]: _, ...rest }) => rest);
    },
  };
}

export const formValues = (form: HTMLFormElement) =>
  Object.fromEntries([...new FormData(form).entries()].map(([k, v]) => [k, String(v)]));

/** Rótulo + campo + dica + erro. Obrigatório ganha * e o erro aparece em vermelho embaixo. */
export function Field({
  label,
  name,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactElement<Record<string, unknown>>;
}) {
  const id = fieldId(name);
  const describedBy = [hint && `${id}-dica`, error && `${id}-erro`].filter(Boolean).join(" ") || undefined;
  return (
    <div className="rp-field">
      <label htmlFor={id}>
        {label}
        {required && (
          <span className="req" aria-hidden="true">
            {" "}*
          </span>
        )}
        {required && <span className="rp-sr"> (obrigatório)</span>}
      </label>
      {hint && <small id={`${id}-dica`}>{hint}</small>}
      {cloneElement(children, {
        id,
        name,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
      })}
      {error && (
        <p className="rp-field-error" id={`${id}-erro`}>
          {error}
        </p>
      )}
    </div>
  );
}

export const RequiredNote = () => (
  <p className="rp-muted">
    Campos com <span style={{ color: "var(--coral-deep)", fontWeight: 800 }}>*</span> são obrigatórios.
  </p>
);
