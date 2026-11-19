"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import { api, courtesyUntil, formatDate, JOB_STATUS_LABEL, WORK_MODEL_LABEL, type Job, type WorkModel } from "@/lib/recrutadora/api";
import Icon, { type IconName } from "../icons";
import { FounderCardEntry, FounderCardInvite } from "../carteirinha/Invite";
import { usePortal, VERIFY } from "../PortalProvider";
import { AccessBlock, canPublish, ErrorMessage, Loading, PortalShell } from "../ui";

const NEW_JOB = "/recrutadora/vagas/nova";
const WORK_ICON: Record<WorkModel, IconName> = { remote: "laptop", hybrid: "home", presential: "building" };
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function Stat({ icon, tone, value, label }: { icon: IconName; tone?: string; value: string | number; label: string }) {
  return (
    <div className={`rp-stat ${tone ?? ""}`}>
      <span className="ico"><Icon name={icon} size={22} /></span>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export default function Vagas() {
  const { ready, user, profile } = usePortal("recruiter");
  const [jobs, setJobs] = useState<Job[] | null>(null);
  // Candidaturas com status "submitted" (novas) por vaga; a lista de vagas só traz o total
  const [newByJob, setNewByJob] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const allowed = canPublish(profile);

  useEffect(() => {
    if (!ready || !allowed) return;
    api.jobs().then(async (list) => {
      setJobs(list);
      const withApps = list.filter((j) => j.applicationsCount > 0);
      const counts = await Promise.all(
        withApps.map((j) =>
          api.applications(j.id).then(
            (apps) => [j.id, apps.filter((a) => a.status === "submitted").length] as const,
            () => [j.id, 0] as const
          )
        )
      );
      setNewByJob(Object.fromEntries(counts));
    }, (err) => setError(err.message));
  }, [ready, allowed]);

  if (!ready) return <Loading />;

  const company = profile?.companyName || jobs?.[0]?.companyName;
  const active = jobs?.filter((j) => j.status === "active").length ?? 0;
  const views = jobs?.reduce((s, j) => s + j.viewsCount, 0) ?? 0;
  const newApps = newByJob ? Object.values(newByJob).reduce((s, n) => s + n, 0) : null;
  const trial = profile?.trialActive ? String(profile.trialDaysRemaining) : "—";
  // Cortesia (ex.: Recrutadora Fundadora) vale mais que o teste: mostra a data de fim no lugar do contador
  const courtesy = courtesyUntil(profile);

  return (
    <PortalShell>
      <div className="rp-stack lg">
        <section className="rp-hello">
          <Avatar size={84} state="greeting" dot={false} />
          <div className="rp-stack" style={{ gap: 4 }}>
            <h1>Olá{company ? `, ${company}` : ""}!</h1>
            <p>Que bom ter você aqui. Vamos encontrar ótimas profissionais?</p>
          </div>
          {allowed && (
            <Link className="rp-btn light" href={NEW_JOB}>
              <Icon name="plus" size={18} /> Nova vaga
            </Link>
          )}
        </section>

        <FounderCardInvite user={user} />
        <FounderCardEntry user={user} />
        <AccessBlock profile={profile} />
        {user && !user.emailVerified && (
          <p className="rp-notice">
            <Icon name="mail" size={22} />
            <span>
              Confirme seu e-mail para publicar vagas. <Link href={VERIFY}>Confirmar agora</Link>
            </span>
          </p>
        )}
        <ErrorMessage error={error} />

        {allowed && (
          <div className="rp-stats">
            <Stat icon="briefcase" value={jobs ? active : "…"} label="vagas ativas" />
            <Stat icon="sparkle" tone="coral" value={newApps ?? "…"} label="candidaturas novas" />
            <Stat icon="eye" tone="ok" value={jobs ? views : "…"} label="visualizações" />
            {courtesy ? (
              <Stat icon="calendar" tone="ok small" value={courtesy} label="cortesia liberada" />
            ) : (
              <Stat
                icon="clock"
                tone="gold"
                value={trial}
                label={profile?.trialActive ? (profile.trialDaysRemaining === 1 ? "dia de teste" : "dias de teste") : "teste grátis encerrado"}
              />
            )}
          </div>
        )}

        {allowed && !jobs && !error && <Loading />}

        {jobs?.length === 0 && (
          <div className="rp-card rp-empty">
            <Avatar size={120} state="thinking" dot={false} />
            <h2>Sua primeira vaga começa aqui</h2>
            <p className="rp-muted">
              Tem muita mulher talentosa esperando uma oportunidade. Publique uma vaga e a gente leva até
              elas pelo app Guia BIA.
            </p>
            <Link className="rp-btn coral" href={NEW_JOB}>
              <Icon name="plus" size={18} /> Publicar a primeira vaga
            </Link>
          </div>
        )}

        {!!jobs?.length && (
          <section className="rp-stack">
            <h2>Suas vagas</h2>
            <div className="rp-grid two">
              {jobs.map((job) => {
                const fresh = newByJob?.[job.id] ?? 0;
                const detail = `/recrutadora/vagas/${job.id}`;
                return (
                  <article key={job.id} className={`rp-card rp-job ${job.status}`}>
                    <div className="rp-between" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}>
                      <h3>
                        <Link className="rp-job-title" href={detail}>
                          {job.title}
                        </Link>
                      </h3>
                      <span className={`rp-badge ${job.status}`}>{JOB_STATUS_LABEL[job.status]}</span>
                    </div>
                    <div className="rp-meta">
                      <span><Icon name={WORK_ICON[job.workModel]} size={16} /> {WORK_MODEL_LABEL[job.workModel]}</span>
                      {job.location && <span><Icon name="pin" size={16} /> {job.location}</span>}
                      <span><Icon name="calendar" size={16} /> {formatDate(job.createdAt)}</span>
                      <span><Icon name="eye" size={16} /> {plural(job.viewsCount, "visualização", "visualizações")}</span>
                    </div>
                    <Link href={detail} className="rp-job-count">
                      <Icon name="users" size={22} />
                      <strong>{job.applicationsCount}</strong>
                      {job.applicationsCount === 1 ? "candidata" : "candidatas"}
                      {fresh > 0 && <span className="rp-badge submitted new">{plural(fresh, "nova", "novas")}</span>}
                    </Link>
                    <div className="rp-row">
                      <Link className="rp-btn small" href={detail}>
                        Ver candidatas
                      </Link>
                      <Link className="rp-btn small secondary" href={`${detail}/editar`}>
                        <Icon name="edit" size={16} /> Editar
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </PortalShell>
  );
}
