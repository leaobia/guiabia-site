"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/recrutadora/api";
import { nextStep, usePortal } from "../PortalProvider";
import { AuthCard, ErrorMessage, Field, formValues, Loading, Success, useFieldErrors } from "../ui";

export default function VerificarEmail() {
  const { ready, user, profile, justRegistered, reload } = usePortal("user");
  const router = useRouter();
  const fields = useFieldErrors();
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const requested = useRef(false);
  const after = nextStep(user, profile, true);

  const sendCode = async () => {
    setError(null);
    try {
      setInfo((await api.requestEmailCode()).message);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    if (!ready || !user) return;
    if (user.emailVerified) {
      router.replace(after);
      return;
    }
    // O cadastro já dispara o e-mail; quem chega por outro caminho recebe um código agora
    if (!justRegistered && !requested.current) {
      requested.current = true;
      sendCode();
    }
  }, [ready, user, justRegistered, after, router]);

  if (!ready || !user || user.emailVerified) return <Loading />;

  const confirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = formValues(e.currentTarget);
    if (!fields.check(v, { code: { required: true, pattern: [/^\d{6}$/, "O código tem 6 números."] } })) return;
    setBusy(true);
    setError(null);
    try {
      await api.confirmEmailCode(v.code.trim());
      await reload();
      router.replace(after);
    } catch (err) {
      if (!fields.fromApi(err)) setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <AuthCard
      title="Confirme seu e-mail"
      intro={
        <>
          Digite o código de 6 dígitos que enviamos para <strong>{user.email}</strong>. Você precisa
          confirmar o e-mail para publicar vagas.
        </>
      }
    >
      <form className="rp-stack" onSubmit={confirm} onInput={fields.clearOnInput} noValidate>
        {info && <Success>{info}</Success>}
        <ErrorMessage error={error} />
        <Field label="Código" name="code" required error={fields.errors.code}>
          <input className="rp-input rp-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} />
        </Field>
        <button className="rp-btn block" disabled={busy}>
          {busy ? "Confirmando…" : "Confirmar"}
        </button>
      </form>
      <button type="button" className="rp-btn secondary block" onClick={sendCode}>
        Enviar novo código
      </button>
      <p className="rp-muted" style={{ textAlign: "center" }}>
        Não chegou? Confira a caixa de spam. <Link href={after}>Fazer isso depois</Link>
      </p>
    </AuthCard>
  );
}
