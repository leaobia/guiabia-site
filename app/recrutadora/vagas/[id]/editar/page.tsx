"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, type Job, type JobInput } from "@/lib/recrutadora/api";
import Icon from "../../../icons";
import { HOME, usePortal } from "../../../PortalProvider";
import { AccessBlock, canPublish, ErrorMessage, Loading, PortalShell } from "../../../ui";
import { useConfirm } from "../../../ConfirmDialog";
import JobForm from "../../JobForm";
import { handleAccessError } from "../../errors";

export default function EditarVaga() {
  const { id } = useParams<{ id: string }>();
  const { ready, profile, reload } = usePortal("recruiter");
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [dialog, confirm] = useConfirm();
  const allowed = canPublish(profile);

  useEffect(() => {
    if (!ready || !allowed) return;
    api.job(id).then(setJob, (err) => setError(err.message));
  }, [ready, allowed, id]);

  if (!ready) return <Loading />;
  const detail = `/recrutadora/vagas/${id}`;

  const save = async (data: JobInput) => {
    try {
      await api.updateJob(id, data);
      router.push(detail);
    } catch (err) {
      if (!(await handleAccessError(err, router.push, reload))) throw err;
    }
  };

  const archive = async () => {
    const ok = await confirm({
      title: "Arquivar esta vaga?",
      message: "Ela sai do app e da sua lista de vagas, e não dá para desfazer pelo portal.",
      confirmLabel: "Arquivar vaga",
      danger: true,
    });
    if (!ok) return;
    setArchiving(true);
    setError(null);
    try {
      await api.archiveJob(id);
      router.push(HOME);
    } catch (err) {
      setError((err as Error).message);
      setArchiving(false);
    }
  };

  return (
    <PortalShell>
      {dialog}
      <div className="rp-stack lg">
        <Link href={detail} className="rp-back">
          <Icon name="arrowLeft" size={18} /> Voltar para a vaga
        </Link>
        <h1>Editar vaga</h1>
        <AccessBlock profile={profile} />
        <ErrorMessage error={error} />
        {allowed && !job && !error && <Loading />}
        {job && (
          <>
            <JobForm initial={job} submitLabel="Salvar alterações" onSubmit={save} />
            <section className="rp-card rp-stack" style={{ maxWidth: 720 }}>
              <h2>Arquivar vaga</h2>
              <p className="rp-muted">
                A vaga deixa de aparecer no app e na sua lista. Para só parar de receber candidaturas,
                marque a vaga como encerrada na etapa Contato.
              </p>
              <div>
                <button type="button" className="rp-btn danger" onClick={archive} disabled={archiving}>
                  {archiving ? "Arquivando…" : "Arquivar vaga"}
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </PortalShell>
  );
}
