// Cliente da API do Guia BIA para o Portal da Recrutadora (só roda no navegador).
// Sessão via Bearer token guardado no localStorage; a API não usa cookies.

// Aceita a URL com ou sem /api/v1 no final
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://bia-back-end-mu.vercel.app/api/v1")
  .replace(/\/+$/, "")
  .replace(/(\/api\/v1)?$/, "/api/v1");
const SESSION_KEY = "bia.recrutadora.sessao";

export type Session = { accessToken: string; refreshToken: string };

export type User = {
  id: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  isRecruiter: boolean;
  companyName: string | null;
  /** Data de criação da conta (ISO). Define quem é Recrutadora Fundadora. */
  createdAt?: string | null;
};

export type RecruiterProfile = {
  isRecruiter: boolean;
  companyName: string | null;
  hasAccess: boolean;
  trialActive: boolean;
  trialDaysRemaining: number;
  /** Cortesia de vagas (ex.: Recrutadora Fundadora). Tem prioridade sobre o teste grátis. */
  complimentary?: boolean;
  /** Fim da cortesia (null = vitalícia). */
  complimentaryExpiresAt?: string | null;
  verificationStatus: "none" | "pending" | "approved" | "rejected" | string;
};

export type WorkModel = "remote" | "hybrid" | "presential";
export type JobStatus = "active" | "closed" | "archived";

export type Job = {
  id: string;
  title: string;
  companyName: string;
  description: string;
  requirements: string | null;
  benefits: string | null;
  salaryRange: string | null;
  location: string | null;
  workModel: WorkModel;
  affirmativeTags: string[];
  contactEmail: string | null;
  applyUrl: string | null;
  whatsapp: string | null;
  status: JobStatus;
  viewsCount: number;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type JobInput = {
  title: string;
  companyName: string;
  description: string;
  workModel: WorkModel;
  requirements?: string;
  benefits?: string;
  salaryRange?: string;
  location?: string;
  contactEmail?: string;
  applyUrl?: string;
  whatsapp?: string;
  affirmativeTags?: string[];
  status?: JobStatus;
};

/**
 * Nome da empresa para preencher formulários: o do perfil e, se a conta não tiver
 * (ex.: ativada pelo app sem nome), o da vaga mais recente.
 */
export async function loadCompanyName(profile: RecruiterProfile | null): Promise<string> {
  const fresh = await api.profile().catch(() => profile);
  if (fresh?.companyName) return fresh.companyName;
  if (!fresh?.hasAccess) return "";
  const jobs = await api.jobs().catch(() => []);
  return jobs[0]?.companyName ?? "";
}

export type ApplicationStatus = "submitted" | "reviewed" | "shortlisted" | "rejected" | "hired";

export type Application = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string | null;
  resume: { title: string; fileUrl: string; fileName: string } | null;
  coverLetter: string | null;
  status: ApplicationStatus;
  createdAt: string;
};

export type PlanTier = "monthly" | "annual";

export type WebPlan = {
  tier: PlanTier;
  title: string;
  priceCents: number;
  priceFormatted: string;
  frequencyMonths: number;
};

export type BillingStatus = {
  planActive: boolean;
  planSource: "google_play" | "web" | "cortesia" | null;
  canSubscribe: boolean;
  message: string | null;
  subscription: {
    // "scheduled" só existe em teoria: a reativada aparece em `scheduled`, e `subscription` é o acesso atual
    status: "pending" | "active" | "past_due" | "cancelled" | "scheduled";
    tier: PlanTier;
    priceCents: number;
    priceFormatted: string;
    currentPeriodEnd: string | null;
    accessExpiresAt: string | null;
    nextPaymentDate: string | null;
    cancelledAt: string | null;
  } | null;
  plans: WebPlan[];
  /** Renovação cancelada com acesso ainda valendo: pode reativar (cobrança começa quando o acesso atual acabar). */
  canReactivate?: boolean;
  /** Assinatura reativada que ainda não começou a cobrar. */
  scheduled?: { tier: PlanTier; priceCents: number; priceFormatted: string; startsAt: string } | null;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    /** Erros de validação por campo (VALIDATION_ERROR), para mostrar embaixo de cada campo. */
    public fields: Record<string, string> = {}
  ) {
    super(message);
  }
}

/* ---------- sessão ---------- */

export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    const s = raw ? JSON.parse(raw) : null;
    return s?.accessToken && s?.refreshToken ? s : null;
  } catch {
    return null;
  }
}

export function saveSession(s: Session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ accessToken: s.accessToken, refreshToken: s.refreshToken }));
  } catch {}
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

// Avisado quando a sessão acaba (refresh recusado); o PortalProvider manda para o login.
let onSessionExpired: () => void = () => {};
export const setSessionExpiredHandler = (fn: () => void) => {
  onSessionExpired = fn;
};

/* ---------- requisições ---------- */

async function parseError(res: Response): Promise<ApiError> {
  let body: { error?: { code?: string; message?: string; details?: { field?: string; issue?: string }[] } } | null =
    null;
  try {
    body = await res.json();
  } catch {}
  const err = body?.error;
  const details = err?.details?.filter((d) => d.issue) ?? [];
  const fields: Record<string, string> = {};
  for (const d of details) if (d.field && !fields[d.field]) fields[d.field] = d.issue!;
  const message =
    err?.code === "VALIDATION_ERROR" && details.length
      ? details.map((d) => d.issue).join(" ")
      : err?.message || "Algo deu errado. Tente de novo em instantes.";
  return new ApiError(res.status, err?.code ?? "UNKNOWN", message, fields);
}

async function send(path: string, method: string, body: unknown, token?: string) {
  try {
    return await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "NETWORK", "Não foi possível conectar. Confira a sua internet e tente de novo.");
  }
}

// Um refresh por vez: chamadas que recebem 401 ao mesmo tempo esperam o mesmo refresh.
let refreshing: Promise<boolean> | null = null;

function refreshSession(usedToken: string): Promise<boolean> {
  // Outra aba (ou chamada) já renovou a sessão: basta usar o token novo.
  const current = readSession();
  if (current && current.accessToken !== usedToken) return Promise.resolve(true);
  if (!current) return Promise.resolve(false);

  // Sem internet o send lança NETWORK: a sessão fica guardada para tentar de novo depois.
  refreshing ??= (async () => {
    try {
      const res = await send("/auth/refresh", "POST", { refreshToken: current.refreshToken });
      if (!res.ok) return false;
      saveSession(await res.json());
      return true;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

/** Chamada pública (sem token): login, cadastro, esqueci a senha. */
export async function publicRequest<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const res = await send(path, method, body);
  if (!res.ok) throw await parseError(res);
  return res.json();
}

/** Chamada autenticada, com um refresh automático se o token tiver expirado. */
export async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const session = readSession();
  if (!session) {
    onSessionExpired();
    throw new ApiError(401, "UNAUTHORIZED", "Faça login para continuar.");
  }

  let res = await send(path, method, body, session.accessToken);
  if (res.status === 401) {
    if (!(await refreshSession(session.accessToken))) {
      clearSession();
      onSessionExpired();
      throw new ApiError(401, "SESSION_EXPIRED", "Sua sessão expirou. Entre de novo.");
    }
    res = await send(path, method, body, readSession()?.accessToken);
  }
  if (!res.ok) throw await parseError(res);
  return res.json();
}

/* ---------- rotas ---------- */

type AuthResponse = Session & { user: User };

export const api = {
  login: (email: string, password: string) =>
    publicRequest<AuthResponse>("/auth/login", "POST", { email, password }),
  register: (fullName: string, email: string, password: string) =>
    publicRequest<AuthResponse>("/auth/register", "POST", { fullName, email, password }),
  logout: (refreshToken: string) => publicRequest("/auth/logout", "POST", { refreshToken }),
  forgotPassword: (email: string) =>
    publicRequest<{ message: string }>("/auth/forgot-password", "POST", { email }),
  resetPassword: (email: string, code: string, newPassword: string) =>
    publicRequest<{ message: string }>("/auth/reset-password", "POST", { email, code, newPassword }),

  me: () => request<{ user: User }>("/auth/me").then((r) => r.user),
  requestEmailCode: () => request<{ message: string }>("/auth/verify-email/request", "POST", {}),
  confirmEmailCode: (code: string) => request("/auth/verify-email/confirm", "POST", { code }),

  profile: () =>
    request<{ data: RecruiterProfile & { company_name?: string | null } }>("/recruiter/jobs/profile").then((r) => ({
      ...r.data,
      companyName: r.data.companyName?.trim() || r.data.company_name?.trim() || null,
    })),
  activate: (companyName: string) => request("/recruiter/jobs/activate", "POST", { companyName }),
  updateProfile: (companyName: string) => request("/recruiter/jobs/profile", "PATCH", { companyName }),

  jobs: () => request<{ data: Job[] }>("/recruiter/jobs").then((r) => r.data),
  job: (id: string) => request<{ data: Job }>(`/recruiter/jobs/${encodeURIComponent(id)}`).then((r) => r.data),
  createJob: (data: JobInput) =>
    request<{ data: Job }>("/recruiter/jobs", "POST", data).then((r) => r.data),
  updateJob: (id: string, data: Partial<JobInput>) =>
    request<{ data: Job }>(`/recruiter/jobs/${encodeURIComponent(id)}`, "PATCH", data).then((r) => r.data),
  archiveJob: (id: string) => request(`/recruiter/jobs/${encodeURIComponent(id)}`, "DELETE"),

  applications: (jobId: string) =>
    request<{ data: Application[] }>(`/recruiter/jobs/${encodeURIComponent(jobId)}/applications`).then(
      (r) => r.data
    ),
  setApplicationStatus: (jobId: string, applicationId: string, status: ApplicationStatus) =>
    request<{ data: Application }>(
      `/recruiter/jobs/${encodeURIComponent(jobId)}/applications/${encodeURIComponent(applicationId)}`,
      "PATCH",
      { status }
    ).then((r) => r.data),

  // Assinatura do BIA Pro pelo site (Mercado Pago). Os preços vêm sempre do back.
  webPlans: () => publicRequest<{ data: WebPlan[] }>("/billing/web/plans").then((r) => r.data),
  billingStatus: () => request<{ data: BillingStatus }>("/billing/web/subscription").then((r) => r.data),
  subscribe: (tier: PlanTier, cardToken: string, payerEmail?: string) =>
    request<{ data: BillingStatus }>("/billing/web/subscription", "POST", { tier, cardToken, payerEmail }).then(
      (r) => r.data
    ),
  reactivateSubscription: (tier: PlanTier, cardToken: string, payerEmail?: string) =>
    request<{ data: BillingStatus }>("/billing/web/subscription/reactivate", "POST", { tier, cardToken, payerEmail }).then(
      (r) => r.data
    ),
  cancelSubscription: () =>
    request<{ data: BillingStatus }>("/billing/web/subscription/cancel", "POST", {}).then((r) => r.data),
};

/* ---------- textos ---------- */

export const NO_ACCESS_MESSAGE = "Seu período de teste acabou. Para continuar publicando vagas, assine o BIA Pro.";

export const WORK_MODEL_LABEL: Record<WorkModel, string> = {
  remote: "Remoto",
  hybrid: "Híbrido",
  presential: "Presencial",
};

export const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  active: "Aberta",
  closed: "Encerrada",
  archived: "Arquivada",
};

export const TAG_LABEL: Record<string, string> = {
  maes: "Mães",
  "50mais": "50+",
  pcd: "PCD",
  transicao_carreira: "Transição de carreira",
  geral: "Geral",
};

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  submitted: "Nova",
  reviewed: "Analisada",
  shortlisted: "Pré-selecionada",
  rejected: "Não seguiu",
  hired: "Contratada",
};

export const formatCents = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Data no horário de Brasília (a cortesia acaba às 23h59 de Brasília, que em UTC já é o dia seguinte). */
export const formatDateBr = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
};

/** "até 18/11/2027" ou "sem data de fim" para a cortesia; null se a conta não tem cortesia. */
export const courtesyUntil = (profile: RecruiterProfile | null) => {
  if (!profile?.complimentary) return null;
  const end = profile.complimentaryExpiresAt ? formatDateBr(profile.complimentaryExpiresAt) : "";
  return end ? `até ${end}` : "sem data de fim";
};

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR");
};
