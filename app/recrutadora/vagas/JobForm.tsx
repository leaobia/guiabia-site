"use client";

import { useState, type FormEvent } from "react";
import {
  TAG_LABEL,
  WORK_MODEL_LABEL,
  type Job,
  type JobInput,
  type JobStatus,
  type WorkModel,
} from "@/lib/recrutadora/api";
import Icon from "../icons";
import { ErrorMessage, Field, RequiredNote, useFieldErrors, type Rules } from "../ui";

type Props = {
  initial?: Job;
  defaultCompany?: string;
  submitLabel: string;
  onSubmit: (data: JobInput) => Promise<void>;
};

type Values = {
  title: string;
  companyName: string;
  description: string;
  workModel: WorkModel;
  location: string;
  salaryRange: string;
  requirements: string;
  benefits: string;
  contactEmail: string;
  whatsapp: string;
  applyUrl: string;
  status: JobStatus;
};

const DESCRIPTION_MIN = 10;

const STEPS: { title: string; rules: Partial<Record<keyof Values, Rules>> }[] = [
  {
    title: "Sobre",
    rules: {
      title: { required: true, min: 3, max: 150 },
      companyName: { required: true, min: 2, max: 100 },
      description: { required: true, min: DESCRIPTION_MIN },
      workModel: { required: true },
    },
  },
  { title: "Detalhes", rules: {} },
  { title: "Contato", rules: { contactEmail: { email: true }, applyUrl: { url: true } } },
];

const DETAIL_FIELDS = ["location", "salaryRange", "requirements", "benefits", "affirmativeTags"];
/** Etapa onde fica o campo (para abrir a etapa certa quando a API recusa um campo). */
const stepOf = (field: string) =>
  DETAIL_FIELDS.includes(field) ? 1 : Math.max(0, STEPS.findIndex((s) => field in s.rules));

export default function JobForm({ initial, defaultCompany, submitLabel, onSubmit }: Props) {
  const editing = !!initial;
  const fields = useFieldErrors();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tags, setTags] = useState<string[]>(initial?.affirmativeTags ?? ["geral"]);
  const [v, setV] = useState<Values>({
    title: initial?.title ?? "",
    companyName: initial?.companyName ?? defaultCompany ?? "",
    description: initial?.description ?? "",
    workModel: initial?.workModel ?? "remote",
    location: initial?.location ?? "",
    salaryRange: initial?.salaryRange ?? "",
    requirements: initial?.requirements ?? "",
    benefits: initial?.benefits ?? "",
    contactEmail: initial?.contactEmail ?? "",
    whatsapp: initial?.whatsapp ?? "",
    applyUrl: initial?.applyUrl ?? "",
    status: initial?.status ?? "active",
  });

  const set = (key: keyof Values) => (e: { target: { value: string } }) => {
    setV((prev) => ({ ...prev, [key]: e.target.value }));
    if (fields.errors[key]) fields.setErrors(({ [key]: _, ...rest }) => rest);
  };
  const toggleTag = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  /** Valida as etapas até `last`; se alguma falhar, vai para ela e mostra os erros. */
  const checkUpTo = (last: number) => {
    for (let i = 0; i <= last; i++) {
      if (!fields.check(v, STEPS[i].rules as Record<string, Rules>)) {
        setStep(i);
        return false;
      }
    }
    return true;
  };

  const goTo = (target: number) => {
    if (target > step && !checkUpTo(Math.min(target - 1, STEPS.length - 1))) return;
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!editing && step < STEPS.length - 1) return goTo(step + 1);
    if (!checkUpTo(STEPS.length - 1)) return;

    const t = (s: string) => s.trim();
    const data: JobInput = {
      title: t(v.title),
      companyName: t(v.companyName),
      description: t(v.description),
      workModel: v.workModel,
      affirmativeTags: tags.length ? tags : ["geral"],
    };
    // Na edição, "" apaga o campo; na criação, campo vazio nem vai
    for (const k of ["requirements", "benefits", "salaryRange", "location", "whatsapp", "contactEmail", "applyUrl"] as const) {
      if (t(v[k]) || editing) data[k] = t(v[k]);
    }
    if (editing && initial?.status !== "archived") data.status = v.status;

    setBusy(true);
    setError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      if (fields.fromApi(err)) {
        const failed = Object.keys((err as { fields: Record<string, string> }).fields)[0];
        setStep(stepOf(failed));
      } else {
        setError((err as Error).message);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setBusy(false);
    }
  };

  const descLength = v.description.trim().length;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="rp-editor">
      <form className="rp-stack lg" onSubmit={submit} noValidate>
        <ol className="rp-steps" aria-label="Etapas">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === step ? "step" : undefined}
                className={i < step ? "done" : undefined}
              >
                <span className="num">{i < step ? <Icon name="check" size={16} /> : i + 1}</span>
                <span className="txt">{s.title}</span>
              </button>
            </li>
          ))}
        </ol>

        <ErrorMessage error={error} />

        {step === 0 && (
          <section className="rp-card rp-form-grid">
            <div className="rp-stack" style={{ gap: 4 }}>
              <h2>Sobre a vaga</h2>
              <RequiredNote />
            </div>
            <Field label="Título da vaga" name="title" required error={fields.errors.title}>
              <input className="rp-input" maxLength={150} placeholder="Ex.: Assistente administrativa" value={v.title} onChange={set("title")} />
            </Field>
            <Field label="Empresa" name="companyName" required hint="Vem do seu perfil; pode trocar só nesta vaga." error={fields.errors.companyName}>
              <input className="rp-input" maxLength={100} value={v.companyName} onChange={set("companyName")} />
            </Field>
            <Field
              label="Descrição"
              name="description"
              required
              hint="Mínimo 10 caracteres. Conte o dia a dia, as responsabilidades e o que a vaga oferece."
              error={fields.errors.description}
            >
              <textarea className="rp-input" rows={7} value={v.description} onChange={set("description")} />
            </Field>
            <span className={`rp-count${descLength < DESCRIPTION_MIN ? " low" : ""}`} style={{ marginTop: -12 }}>
              {descLength} {descLength === 1 ? "caractere" : "caracteres"}
              {descLength < DESCRIPTION_MIN && ` · faltam ${DESCRIPTION_MIN - descLength}`}
            </span>
            <fieldset className="rp-fieldset">
              <legend>
                Modelo de trabalho <span className="req" style={{ color: "var(--coral-deep)" }} aria-hidden="true">*</span>
              </legend>
              <div className="rp-chips">
                {(Object.keys(WORK_MODEL_LABEL) as WorkModel[]).map((m) => (
                  <label key={m} className="rp-chip">
                    <input type="radio" name="workModel" value={m} checked={v.workModel === m} onChange={set("workModel")} />
                    <span>{WORK_MODEL_LABEL[m]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </section>
        )}

        {step === 1 && (
          <section className="rp-card rp-form-grid">
            <div className="rp-stack" style={{ gap: 4 }}>
              <h2>Detalhes</h2>
              <p className="rp-muted">Tudo aqui é opcional, mas vagas completas recebem mais candidaturas.</p>
            </div>
            <div className="rp-form-grid two">
              <Field label="Local" name="location" hint="Ex.: São Paulo, SP" error={fields.errors.location}>
                <input className="rp-input" value={v.location} onChange={set("location")} />
              </Field>
              <Field label="Faixa salarial" name="salaryRange" hint="Ex.: R$ 3.000 a R$ 4.000" error={fields.errors.salaryRange}>
                <input className="rp-input" value={v.salaryRange} onChange={set("salaryRange")} />
              </Field>
            </div>
            <Field label="Requisitos" name="requirements" error={fields.errors.requirements}>
              <textarea className="rp-input" rows={4} value={v.requirements} onChange={set("requirements")} />
            </Field>
            <Field label="Benefícios" name="benefits" error={fields.errors.benefits}>
              <textarea className="rp-input" rows={3} value={v.benefits} onChange={set("benefits")} />
            </Field>
            <fieldset className="rp-fieldset">
              <legend>Vaga afirmativa para</legend>
              <div className="rp-chips">
                {Object.entries(TAG_LABEL).map(([value, label]) => (
                  <label key={value} className="rp-chip">
                    <input type="checkbox" checked={tags.includes(value)} onChange={() => toggleTag(value)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </section>
        )}

        {step === 2 && (
          <section className="rp-card rp-form-grid">
            <div className="rp-stack" style={{ gap: 4 }}>
              <h2>Contato</h2>
              <p className="rp-muted">Opcional. As candidatas também podem se candidatar pelo app, com o currículo.</p>
            </div>
            <div className="rp-form-grid two">
              <Field label="E-mail de contato" name="contactEmail" error={fields.errors.contactEmail}>
                <input className="rp-input" type="email" value={v.contactEmail} onChange={set("contactEmail")} />
              </Field>
              <Field label="WhatsApp" name="whatsapp" error={fields.errors.whatsapp}>
                <input className="rp-input" type="tel" inputMode="tel" value={v.whatsapp} onChange={set("whatsapp")} />
              </Field>
            </div>
            <Field label="Link para se candidatar" name="applyUrl" hint="Começando com https://" error={fields.errors.applyUrl}>
              <input className="rp-input" type="url" placeholder="https://" value={v.applyUrl} onChange={set("applyUrl")} />
            </Field>
            {editing && initial?.status !== "archived" && (
              <fieldset className="rp-fieldset">
                <legend>Situação da vaga</legend>
                <div className="rp-chips">
                  {(["active", "closed"] as JobStatus[]).map((s) => (
                    <label key={s} className="rp-chip">
                      <input type="radio" name="status" value={s} checked={v.status === s} onChange={set("status")} />
                      <span>{s === "active" ? "Aberta para candidaturas" : "Encerrada"}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
          </section>
        )}

        <div className="rp-between">
          {step > 0 ? (
            <button type="button" className="rp-btn secondary" onClick={() => goTo(step - 1)}>
              <Icon name="arrowLeft" size={18} /> Voltar
            </button>
          ) : (
            <span />
          )}
          <div className="rp-row">
            {!isLast && (
              <button type="button" className={`rp-btn${editing ? " secondary" : ""}`} onClick={() => goTo(step + 1)}>
                Próximo <Icon name="arrowRight" size={18} />
              </button>
            )}
            {(isLast || editing) && (
              <button type="submit" className="rp-btn" disabled={busy}>
                {busy ? "Salvando…" : submitLabel}
              </button>
            )}
          </div>
        </div>
      </form>

      <JobPreview v={v} tags={tags} />
    </div>
  );
}

/** Como a vaga aparece para as usuárias no app (aproximação do card do app). */
function JobPreview({ v, tags }: { v: Values; tags: string[] }) {
  const company = v.companyName.trim() || "Sua empresa";
  return (
    <aside className="rp-preview-wrap" aria-label="Prévia da vaga no app">
      <span className="rp-preview-label">
        <Icon name="eye" size={16} /> Prévia no app
      </span>
      <div className="rp-phone">
        <div className="rp-phone-screen">
          <div className="rp-phone-bar">
            <img src="/logo.svg" alt="" width={22} height={22} style={{ borderRadius: 6 }} /> Vagas
          </div>
          <div className="rp-app-card">
            <div className="rp-row" style={{ flexWrap: "nowrap" }}>
              <span className="rp-app-logo">{company.charAt(0).toUpperCase()}</span>
              <div style={{ minWidth: 0 }}>
                <h4 className={v.title.trim() ? undefined : "placeholder"}>{v.title.trim() || "Título da vaga"}</h4>
                <p className="rp-muted" style={{ fontSize: ".88rem" }}>{company}</p>
              </div>
            </div>
            <div className="rp-row" style={{ gap: 6 }}>
              <span className="rp-pill"><Icon name="laptop" size={14} /> {WORK_MODEL_LABEL[v.workModel]}</span>
              {v.location.trim() && <span className="rp-pill"><Icon name="pin" size={14} /> {v.location.trim()}</span>}
              {v.salaryRange.trim() && <span className="rp-pill"><Icon name="money" size={14} /> {v.salaryRange.trim()}</span>}
            </div>
            {tags.filter((t) => t !== "geral").length > 0 && (
              <div className="rp-row" style={{ gap: 6 }}>
                {tags.filter((t) => t !== "geral").map((t) => (
                  <span key={t} className="rp-badge coral">{TAG_LABEL[t]}</span>
                ))}
              </div>
            )}
            <div className="rp-app-section">
              <b>Descrição</b>
              <p className={`rp-pre${v.description.trim() ? "" : " placeholder"}`}>
                {v.description.trim() || "A descrição da vaga aparece aqui."}
              </p>
            </div>
            {v.requirements.trim() && (
              <div className="rp-app-section">
                <b>Requisitos</b>
                <p className="rp-pre">{v.requirements.trim()}</p>
              </div>
            )}
            {v.benefits.trim() && (
              <div className="rp-app-section">
                <b>Benefícios</b>
                <p className="rp-pre">{v.benefits.trim()}</p>
              </div>
            )}
            <span className="rp-app-btn">Quero me candidatar</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
