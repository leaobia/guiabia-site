"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import { api, loadCompanyName } from "@/lib/recrutadora/api";
import Icon from "../icons";
import { HOME, usePortal } from "../PortalProvider";
import { ErrorMessage, Field, Loading, PortalShell, RequiredNote, Success, useFieldErrors } from "../ui";

// Ativa o perfil de recrutadora (inicia os 30 dias grátis) ou, se já ativo, troca o nome da empresa.
export default function Ativar() {
  const { ready, profile, reload } = usePortal("user");
  const router = useRouter();
  const fields = useFieldErrors();
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const isRecruiter = !!profile?.isRecruiter;

  // Busca o nome atual no GET /recruiter/jobs/profile ao abrir a tela
  useEffect(() => {
    if (!ready) return;
    loadCompanyName(profile).then((name) => setCompanyName((current) => current ?? name));
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready || !profile || companyName === null) return <Loading />;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    if (!fields.check({ companyName }, { companyName: { required: true, min: 2, max: 100 } })) return;
    setBusy(true);
    try {
      if (isRecruiter) {
        await api.updateProfile(companyName.trim());
        await reload();
        setSaved(true);
      } else {
        await api.activate(companyName.trim());
        await reload();
        router.replace(HOME);
      }
    } catch (err) {
      if (!fields.fromApi(err)) setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <PortalShell>
      <div className="rp-stack lg" style={{ maxWidth: 620 }}>
        {isRecruiter && (
          <Link href={HOME} className="rp-back">
            <Icon name="arrowLeft" size={18} /> Voltar para as vagas
          </Link>
        )}
        <div className="rp-row" style={{ gap: 18, flexWrap: "nowrap" }}>
          <Avatar size={76} state={isRecruiter ? "idle" : "greeting"} dot={false} />
          <div className="rp-stack" style={{ gap: 6 }}>
            <h1>{isRecruiter ? "Dados da empresa" : "Ative seu perfil de recrutadora"}</h1>
            <p className="rp-muted">
              {isRecruiter
                ? "Esse nome aparece no portal e vem preenchido nas vagas novas."
                : "Falta pouco! Informe o nome da empresa que vai aparecer nas suas vagas."}
            </p>
          </div>
        </div>

        {!isRecruiter && (
          <p className="rp-notice">
            <Icon name="sparkle" size={22} />
            <span>
              Ao ativar, você ganha <strong>30 dias grátis</strong> para publicar vagas e receber candidaturas.
            </span>
          </p>
        )}

        <form className="rp-card rp-stack" onSubmit={submit} noValidate>
          <RequiredNote />
          {saved && <Success>Nome da empresa atualizado.</Success>}
          <ErrorMessage error={error} />
          <Field label="Nome da empresa" name="companyName" required error={fields.errors.companyName}>
            <input
              className="rp-input"
              autoComplete="organization"
              maxLength={100}
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                fields.setErrors({});
                setSaved(false);
              }}
            />
          </Field>
          <div>
            <button className="rp-btn" disabled={busy}>
              {busy ? "Salvando…" : isRecruiter ? "Salvar" : "Ativar perfil grátis"}
            </button>
          </div>
        </form>
      </div>
    </PortalShell>
  );
}
