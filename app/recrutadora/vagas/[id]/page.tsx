"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Avatar from "@/components/Avatar";
import {
  api,
  APPLICATION_STATUS_LABEL,
  formatDate,
  JOB_STATUS_LABEL,
  WORK_MODEL_LABEL,
  type Application,
  type ApplicationStatus,
  type Job,
} from "@/lib/recrutadora/api";
import Icon from "../../icons";
import { HOME, usePortal } from "../../PortalProvider";
import { AccessBlock, canPublish, ErrorMessage, Loading, PortalShell } from "../../ui";

const STATUSES = Object.keys(APPLICATION_STATUS_LABEL) as ApplicationStatus[];
// O link do currículo vale 15 minutos; ao voltar para a aba depois de 10, a lista é recarregada
const RESUME_LINK_REFRESH_MS = 10 * 60 * 1000;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

export default function Candidatas() {
  const { id } = useParams<{ id: string }>();
  const { ready, profile } = usePortal("recruiter");
  const allowed = canPublish(profile);
  const [job, setJob] = useState<Job | null>(null);
  const [apps, setApps] = useState<Application[] | null>(null);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);
  const loadedAt = useRef(0);

  const loadApps = useCallback(async () => {
    const list = await api.applications(id);
    loadedAt.current = Date.now();
    setApps(list);
  }, [id]);

  useEffect(() => {
    if (!ready || !allowed) return;
    Promise.all([api.job(id).then(setJob), loadApps()]).catch((err) => setError(err.message));
  }, [ready, allowed, id, loadApps]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && loadedAt.current && Date.now() - loadedAt.current > RESUME_LINK_REFRESH_MS) {
        loadApps().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [loadApps]);

  if (!ready) return <Loading />;

  const changeStatus = async (app: Application, status: ApplicationStatus) => {
    setError(null);
    setApps((list) => list?.map((a) => (a.id === app.id ? { ...a, status } : a)) ?? list);
    try {
      await api.setApplicationStatus(id, app.id, status);
    } catch (err) {
      setApps((list) => list?.map((a) => (a.id === app.id ? { ...a, status: app.status } : a)) ?? list);
      setError((err as Error).message);
    }
  };

  const toggleJob = async () => {
    if (!job) return;
    const next = job.status === "active" ? "closed" : "active";
    setToggling(true);
    setError(null);
    try {
      setJob(await api.updateJob(id, { status: next }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setToggling(false);
    }
  };

  const count = (s: ApplicationStatus) => apps?.filter((a) => a.status === s).length ?? 0;
  const visible = apps?.filter((a) => filter === "all" || a.status === filter) ?? [];

  return (
    <PortalShell>
      <div className="rp-stack lg">
        <Link href={HOME} className="rp-back">
          <Icon name="arrowLeft" size={18} /> Voltar para as vagas
        </Link>
        <AccessBlock profile={profile} />
        <ErrorMessage error={error} />
        {allowed && !job && !error && <Loading />}

        {job && (
          <section className={`rp-card rp-job ${job.status}`} style={{ gap: 12 }}>
            <div className="rp-between" style={{ alignItems: "flex-start" }}>
              <div className="rp-stack" style={{ gap: 8 }}>
                <span className={`rp-badge ${job.status}`} style={{ justifySelf: "start" }}>
                  {JOB_STATUS_LABEL[job.status]}
                </span>
                <h1>{job.title}</h1>
              </div>
              <div className="rp-row">
                {job.status !== "archived" && (
                  <button type="button" className="rp-btn small secondary" onClick={toggleJob} disabled={toggling}>
                    {job.status === "active" ? "Encerrar vaga" : "Reabrir vaga"}
                  </button>
                )}
                <Link className="rp-btn small" href={`/recrutadora/vagas/${id}/editar`}>
                  <Icon name="edit" size={16} /> Editar
                </Link>
              </div>
            </div>
            <div className="rp-meta">
              <span><Icon name="building" size={16} /> {job.companyName}</span>
              <span><Icon name="laptop" size={16} /> {WORK_MODEL_LABEL[job.workModel]}</span>
              {job.location && <span><Icon name="pin" size={16} /> {job.location}</span>}
              <span><Icon name="calendar" size={16} /> Publicada em {formatDate(job.createdAt)}</span>
              <span><Icon name="eye" size={16} /> {job.viewsCount} visualizações</span>
            </div>
          </section>
        )}

        {apps && (
          <section className="rp-stack">
            <h2>
              Candidatas <span className="rp-muted">({apps.length})</span>
            </h2>
            {apps.length > 0 && (
              <div className="rp-chips" role="group" aria-label="Filtrar por situação">
                {(["all", ...STATUSES] as const).map((s) => (
                  <label key={s} className="rp-chip">
                    <input type="radio" name="filtro" checked={filter === s} onChange={() => setFilter(s)} />
                    <span>
                      {s === "all" ? `Todas (${apps.length})` : `${APPLICATION_STATUS_LABEL[s]} (${count(s)})`}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {apps.length === 0 && (
              <div className="rp-card rp-empty">
                <Avatar size={110} state="thinking" dot={false} />
                <h2>As candidaturas vão aparecer aqui</h2>
                <p className="rp-muted">
                  Assim que alguém se candidatar pelo app, você vê o currículo e pode marcar cada etapa.
                  Enquanto isso, vale caprichar na descrição da vaga.
                </p>
              </div>
            )}
            {apps.length > 0 && visible.length === 0 && <p className="rp-muted">Nenhuma candidata nesta situação.</p>}

            <div className="rp-grid two">
              {visible.map((app) => (
                <article key={app.id} className="rp-card rp-cand">
                  <div className="rp-cand-head">
                    <span className="rp-initials" aria-hidden="true">{initials(app.candidateName)}</span>
                    <div className="rp-stack" style={{ gap: 4, flex: 1, minWidth: 0 }}>
                      <div className="rp-between" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}>
                        <h3>{app.candidateName}</h3>
                        <span className={`rp-badge ${app.status}`}>{APPLICATION_STATUS_LABEL[app.status]}</span>
                      </div>
                      <p className="rp-muted">Candidatura em {formatDate(app.createdAt)}</p>
                    </div>
                  </div>

                  <div className="rp-meta">
                    <a href={`mailto:${app.candidateEmail}`}><Icon name="mail" size={16} /> {app.candidateEmail}</a>
                    {app.candidatePhone && (
                      <a href={`tel:${app.candidatePhone}`}><Icon name="phone" size={16} /> {app.candidatePhone}</a>
                    )}
                  </div>

                  {app.coverLetter && (
                    <details>
                      <summary>Mensagem da candidata</summary>
                      <p className="rp-pre" style={{ marginTop: 8 }}>{app.coverLetter}</p>
                    </details>
                  )}

                  <div className="rp-cand-actions">
                    {app.resume?.fileUrl ? (
                      <a className="rp-btn small" href={app.resume.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Icon name="file" size={16} /> Ver currículo
                      </a>
                    ) : (
                      <span className="rp-muted">Sem currículo anexado</span>
                    )}
                    <label className="rp-row" style={{ gap: 8, fontWeight: 700 }}>
                      Situação
                      <select
                        className="rp-input rp-select"
                        value={app.status}
                        onChange={(e) => changeStatus(app, e.target.value as ApplicationStatus)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{APPLICATION_STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </PortalShell>
  );
}
