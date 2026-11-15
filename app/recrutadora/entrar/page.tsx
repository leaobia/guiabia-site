"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { usePortal } from "../PortalProvider";
import { AuthCard, ErrorMessage, Field, formValues, Loading, useFieldErrors } from "../ui";

export default function Entrar() {
  const { ready, login } = usePortal("guest");
  const fields = useFieldErrors();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!ready) return <Loading />;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = formValues(e.currentTarget);
    setError(null);
    if (!fields.check(v, { email: { required: true, email: true }, password: { required: true } })) return;
    setBusy(true);
    try {
      // O redirecionamento acontece no usePortal quando a sessão fica pronta
      await login(v.email.trim(), v.password);
    } catch (err) {
      if (!fields.fromApi(err)) setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Que bom ver você de novo" intro="Entre com a mesma conta do app Guia BIA.">
      <form className="rp-stack" onSubmit={submit} onInput={fields.clearOnInput} noValidate>
        <ErrorMessage error={error} />
        <Field label="E-mail" name="email" required error={fields.errors.email}>
          <input className="rp-input" type="email" autoComplete="email" />
        </Field>
        <Field label="Senha" name="password" required error={fields.errors.password}>
          <input className="rp-input" type="password" autoComplete="current-password" />
        </Field>
        <p style={{ marginTop: -6 }}>
          <Link href="/recrutadora/esqueci-senha">Esqueci a senha</Link>
        </p>
        <button className="rp-btn block" disabled={busy}>
          {busy ? "Entrando…" : "Entrar"}
        </button>
      </form>
      <p className="rp-muted" style={{ textAlign: "center" }}>
        Ainda não tem conta? <Link href="/recrutadora/cadastro">Criar conta grátis</Link>
      </p>
    </AuthCard>
  );
}
