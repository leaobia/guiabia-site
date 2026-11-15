"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { usePortal } from "../PortalProvider";
import { AuthCard, ErrorMessage, Field, formValues, Loading, RequiredNote, useFieldErrors } from "../ui";

export default function Cadastro() {
  const { ready, register } = usePortal("guest");
  const fields = useFieldErrors();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!ready) return <Loading />;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = formValues(e.currentTarget);
    setError(null);
    const ok = fields.check(v, {
      fullName: { required: true, min: 2 },
      email: { required: true, email: true },
      password: { required: true, min: 8 },
      confirm: { required: true, same: ["password", "As senhas não são iguais."] },
    });
    if (!ok) return;
    setBusy(true);
    try {
      await register(v.fullName.trim(), v.email.trim(), v.password);
    } catch (err) {
      if (!fields.fromApi(err)) setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <AuthCard
      title="Crie sua conta"
      intro="Publique vagas e receba candidaturas de mulheres no Guia BIA. Se você já usa o app, entre com a mesma conta."
    >
      <form className="rp-stack" onSubmit={submit} onInput={fields.clearOnInput} noValidate>
        <RequiredNote />
        <ErrorMessage error={error} />
        <Field label="Seu nome completo" name="fullName" required error={fields.errors.fullName}>
          <input className="rp-input" autoComplete="name" />
        </Field>
        <Field label="E-mail" name="email" required error={fields.errors.email}>
          <input className="rp-input" type="email" autoComplete="email" />
        </Field>
        <Field label="Senha" name="password" required hint="Mínimo 8 caracteres." error={fields.errors.password}>
          <input className="rp-input" type="password" autoComplete="new-password" />
        </Field>
        <Field label="Repita a senha" name="confirm" required error={fields.errors.confirm}>
          <input className="rp-input" type="password" autoComplete="new-password" />
        </Field>
        <p className="rp-muted">
          Ao criar a conta, você concorda com os <Link href="/termo">Termos de Uso</Link> e a{" "}
          <Link href="/privacidade">Política de Privacidade</Link>.
        </p>
        <button className="rp-btn block" disabled={busy}>
          {busy ? "Criando…" : "Criar conta"}
        </button>
      </form>
      <p className="rp-muted" style={{ textAlign: "center" }}>
        Já tem conta? <Link href="/recrutadora/entrar">Entrar</Link>
      </p>
    </AuthCard>
  );
}
