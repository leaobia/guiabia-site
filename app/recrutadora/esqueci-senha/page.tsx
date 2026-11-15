"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { api } from "@/lib/recrutadora/api";
import { usePortal } from "../PortalProvider";
import { AuthCard, ErrorMessage, Field, formValues, Loading, Success, useFieldErrors } from "../ui";

type Step = "email" | "code" | "done";
const CODE_RULE = { required: true, pattern: [/^\d{6}$/, "O código tem 6 números."] as [RegExp, string] };

export default function EsqueciSenha() {
  const { ready } = usePortal("guest");
  const fields = useFieldErrors();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!ready) return <Loading />;

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      if (!fields.fromApi(err)) setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const sendCode = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = formValues(e.currentTarget);
    if (!fields.check(v, { email: { required: true, email: true } })) return;
    run(async () => {
      const r = await api.forgotPassword(v.email.trim());
      setEmail(v.email.trim());
      setInfo(r.message);
      setStep("code");
    });
  };

  const reset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = formValues(e.currentTarget);
    const ok = fields.check(v, {
      code: CODE_RULE,
      newPassword: { required: true, min: 8 },
      confirm: { required: true, same: ["newPassword", "As senhas não são iguais."] },
    });
    if (!ok) return;
    run(async () => {
      await api.resetPassword(email, v.code.trim(), v.newPassword);
      setStep("done");
    });
  };

  if (step === "done") {
    return (
      <AuthCard title="Senha redefinida">
        <Success>Pronto! Sua senha foi trocada.</Success>
        <Link className="rp-btn block" href="/recrutadora/entrar">
          Entrar
        </Link>
      </AuthCard>
    );
  }

  if (step === "code") {
    return (
      <AuthCard title="Crie uma nova senha" intro={info ?? `Enviamos um código para ${email}.`}>
        <form className="rp-stack" onSubmit={reset} onInput={fields.clearOnInput} noValidate>
          <ErrorMessage error={error} />
          <Field label="Código de 6 dígitos" name="code" required error={fields.errors.code}>
            <input className="rp-input rp-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} />
          </Field>
          <Field label="Nova senha" name="newPassword" required hint="Mínimo 8 caracteres." error={fields.errors.newPassword}>
            <input className="rp-input" type="password" autoComplete="new-password" />
          </Field>
          <Field label="Repita a nova senha" name="confirm" required error={fields.errors.confirm}>
            <input className="rp-input" type="password" autoComplete="new-password" />
          </Field>
          <button className="rp-btn block" disabled={busy}>
            {busy ? "Salvando…" : "Trocar senha"}
          </button>
        </form>
        <button type="button" className="rp-btn secondary block" onClick={() => setStep("email")}>
          Usar outro e-mail
        </button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Esqueci a senha" intro="Informe o e-mail da conta. Vamos enviar um código para você criar uma nova senha.">
      <form className="rp-stack" onSubmit={sendCode} onInput={fields.clearOnInput} noValidate>
        <ErrorMessage error={error} />
        <Field label="E-mail" name="email" required error={fields.errors.email}>
          <input className="rp-input" type="email" autoComplete="email" defaultValue={email} />
        </Field>
        <button className="rp-btn block" disabled={busy}>
          {busy ? "Enviando…" : "Enviar código"}
        </button>
      </form>
      <p style={{ textAlign: "center" }}>
        <Link href="/recrutadora/entrar">Voltar para o login</Link>
      </p>
    </AuthCard>
  );
}
