"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, loadCompanyName, type JobInput } from "@/lib/recrutadora/api";
import Icon from "../../icons";
import { HOME, usePortal, VERIFY } from "../../PortalProvider";
import { AccessBlock, canPublish, Loading, PortalShell } from "../../ui";
import JobForm from "../JobForm";
import { handleAccessError } from "../errors";

export default function NovaVaga() {
  const { ready, user, profile, reload } = usePortal("recruiter");
  const router = useRouter();
  const [company, setCompany] = useState<string | null>(null);
  const unverified = ready && !!user && !user.emailVerified;
  const allowed = canPublish(profile);

  useEffect(() => {
    if (unverified) router.replace(VERIFY);
  }, [unverified, router]);

  // Empresa vem preenchida com o nome do perfil (editável no formulário)
  useEffect(() => {
    if (ready && allowed && !unverified) loadCompanyName(profile).then(setCompany);
  }, [ready, allowed, unverified]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready || unverified) return <Loading />;

  const create = async (data: JobInput) => {
    try {
      const job = await api.createJob(data);
      router.push(`/recrutadora/vagas/${job.id}`);
    } catch (err) {
      if (!(await handleAccessError(err, router.push, reload))) throw err;
    }
  };

  return (
    <PortalShell>
      <div className="rp-stack lg">
        <Link href={HOME} className="rp-back">
          <Icon name="arrowLeft" size={18} /> Voltar para as vagas
        </Link>
        <div className="rp-stack" style={{ gap: 6 }}>
          <h1>Nova vaga</h1>
          <p className="rp-muted">Em três passos. Ao lado, você vê como a vaga aparece no app.</p>
        </div>
        {!allowed ? (
          <AccessBlock profile={profile} />
        ) : company === null ? (
          <Loading />
        ) : (
          <JobForm submitLabel="Publicar vaga" defaultCompany={company} onSubmit={create} />
        )}
      </div>
    </PortalShell>
  );
}
