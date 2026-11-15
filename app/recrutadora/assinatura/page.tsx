"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import {
  api,
  ApiError,
  formatCents,
  formatDate,
  type BillingStatus,
  type PlanTier,
  type WebPlan,
} from "@/lib/recrutadora/api";
import Icon from "../icons";
import { HOME, usePortal } from "../PortalProvider";
import { useConfirm } from "../ConfirmDialog";
import { AccessBlock, ErrorMessage, Field, Loading, PortalShell, Success, useFieldErrors } from "../ui";
import CardBrick from "./CardBrick";

// Só em desenvolvimento (npm run dev): nunca vale num build de produção, mesmo se a variável vazar para a Vercel
const TEST_PAYER_EMAIL =
  process.env.NODE_ENV !== "production" ? process.env.NEXT_PUBLIC_MERCADOPAGO_TEST_PAYER_EMAIL?.trim() : undefined;

const PLAY_SUBSCRIPTIONS = "https://play.google.com/store/account/subscriptions";
const POLL_MS = 5000;
const POLL_MAX = 24; // ~2 minutos esperando a primeira cobrança ser aprovada

const TIER_LABEL: Record<PlanTier, string> = { monthly: "Mensal", annual: "Anual" };
const BENEFITS = [
  "Vagas ilimitadas como recrutadora",
  "Candidatas e currículos organizados por vaga",
  "Renovação automática; cancele quando quiser",
];

export default function Assinatura() {
  const { ready, user, profile, reload } = usePortal("recruiter");
  const [plans, setPlans] = useState<WebPlan[] | null>(null);
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [tier, setTier] = useState<PlanTier>("annual");
  const [error, setError] = useState<string | null>(null);
  const [justSubscribed, setJustSubscribed] = useState(false);
  // Renovação cancelada com acesso valendo: assinatura nova que só cobra quando o acesso atual acabar
  const [reactivating, setReactivating] = useState(false);
  const [justReactivated, setJustReactivated] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [polls, setPolls] = useState(0);
  const [dialog, confirm] = useConfirm();
  // E-mail de quem paga no Mercado Pago: o da conta, ou o comprador de teste em desenvolvimento
  const defaultPayer = TEST_PAYER_EMAIL || user?.email || "";
  const [payerEmail, setPayerEmail] = useState(defaultPayer);
  const payerField = useFieldErrors();
  useEffect(() => {
    if (defaultPayer) setPayerEmail((current) => current || defaultPayer);
  }, [defaultPayer]);

  const load = useCallback(async () => {
    const [p, s] = await Promise.all([api.webPlans(), api.billingStatus()]);
    setPlans(p);
    setStatus(s);
    return s;
  }, []);

  useEffect(() => {
    if (ready) load().catch((err) => setError(err.message));
  }, [ready, load]);

  const pending = !!status && !status.planActive && status.subscription?.status === "pending" && !status.canSubscribe;

  // Pagamento em processamento: confere de tempos em tempos até a cobrança ser aprovada
  useEffect(() => {
    if (!pending || polls >= POLL_MAX) return;
    const t = setTimeout(async () => {
      const s = await api.billingStatus().catch(() => null);
      if (s) setStatus(s);
      if (s?.planActive) reload().catch(() => {});
      setPolls((n) => n + 1);
    }, POLL_MS);
    return () => clearTimeout(t);
  }, [pending, polls, reload]);

  if (!ready) return <Loading />;
  // Perfil rejeitado não volta a publicar vagas com assinatura: mostra só o aviso
  if (profile?.verificationStatus === "rejected") {
    return (
      <PortalShell>
        <AccessBlock profile={profile} />
      </PortalShell>
    );
  }

  const subscribe = async (token: string) => {
    setError(null);
    if (!payerField.check({ payerEmail }, { payerEmail: { required: true, email: true } })) {
      throw new Error("payerEmail"); // o formulário do cartão volta a aceitar envio
    }
    try {
      if (reactivating) {
        setStatus(await api.reactivateSubscription(tier, token, payerEmail.trim()));
        setReactivating(false);
        setJustReactivated(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const s = await api.subscribe(tier, token, payerEmail.trim());
      setStatus(s);
      setJustSubscribed(true);
      setPolls(0);
      if (s.planActive) await reload();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (err instanceof ApiError && err.code === "REACTIVATION_NOT_AVAILABLE") {
        setReactivating(false);
        await load().catch(() => {});
        setError(err.message);
        return;
      }
      if (err instanceof ApiError && (err.code === "SUBSCRIPTION_PENDING" || err.code === "PLAN_ALREADY_ACTIVE")) {
        await load().catch(() => {});
        setPolls(0);
        return;
      }
      if (!payerField.fromApi(err)) {
        setError((err as Error).message);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      throw err; // o formulário do Mercado Pago volta a aceitar envio
    }
  };

  const cancel = async () => {
    const until = status?.subscription?.currentPeriodEnd;
    const ok = await confirm({
      title: status?.scheduled ? "Cancelar a reativação?" : "Cancelar a renovação?",
      message: `A assinatura não será mais cobrada.${until ? ` Você continua com acesso até ${formatDate(until)}.` : ""}`,
      confirmLabel: status?.scheduled ? "Cancelar reativação" : "Cancelar renovação",
      cancelLabel: "Manter assinatura",
      danger: true,
    });
    if (!ok) return;
    setCancelling(true);
    setError(null);
    try {
      setStatus(await api.cancelSubscription());
      setJustReactivated(false);
      await reload();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCancelling(false);
    }
  };

  const selected = plans?.find((p) => p.tier === tier);
  const monthly = plans?.find((p) => p.tier === "monthly");
  const annual = plans?.find((p) => p.tier === "annual");
  const yearlySaving = monthly && annual ? monthly.priceCents * 12 - annual.priceCents : 0;
  const accessEnd = status?.subscription?.currentPeriodEnd ?? status?.subscription?.accessExpiresAt ?? null;
  const showCheckout = !!status && !!plans && ((!status.planActive && !pending) || reactivating);

  return (
    <PortalShell>
      {dialog}
      <div className="rp-stack lg">
        <Link href={HOME} className="rp-back">
          <Icon name="arrowLeft" size={18} /> Voltar para as vagas
        </Link>
        <div className="rp-row" style={{ gap: 18, flexWrap: "nowrap" }}>
          <Avatar size={76} state="greeting" dot={false} />
          <div className="rp-stack" style={{ gap: 6 }}>
            <h1>Assinatura BIA Pro</h1>
            <p className="rp-muted">Continue publicando vagas e recebendo candidatas depois do teste grátis.</p>
          </div>
        </div>

        <ErrorMessage error={error} />
        {!status && !error && <Loading />}

        {status?.planActive && !reactivating && (
          <ActivePlan
            status={status}
            justSubscribed={justSubscribed}
            justReactivated={justReactivated}
            cancelling={cancelling}
            onCancel={cancel}
            onReactivate={() => {
              setError(null);
              setReactivating(true);
              setTier(status.subscription?.tier ?? "annual");
            }}
          />
        )}

        {pending && (
          <div className="rp-card rp-empty">
            <Avatar size={96} state="thinking" dot={false} />
            <h2>Seu pagamento está em processamento</h2>
            <p className="rp-muted">
              {polls < POLL_MAX
                ? "Estamos esperando a confirmação do Mercado Pago. Isso costuma levar poucos minutos; esta tela atualiza sozinha."
                : "A confirmação está demorando mais que o normal. Você pode sair desta tela: o acesso é liberado assim que o pagamento for aprovado."}
            </p>
            {polls >= POLL_MAX && (
              <button type="button" className="rp-btn secondary" onClick={() => setPolls(0)}>
                Verificar de novo
              </button>
            )}
          </div>
        )}

        {showCheckout && status && plans && (
          <div className="rp-editor">
            <div className="rp-stack lg">
              {reactivating && (
                <div className="rp-stack">
                  <p className="rp-notice">
                    <Icon name="calendar" size={22} />
                    <span>
                      <strong>Nada é cobrado agora.</strong>{" "}
                      {accessEnd
                        ? `A primeira cobrança será em ${formatDate(accessEnd)}, quando o seu acesso atual acabar.`
                        : "A primeira cobrança acontece quando o seu acesso atual acabar."}{" "}
                      Você pode trocar de plano.
                    </span>
                  </p>
                  <div>
                    <button type="button" className="rp-btn secondary small" onClick={() => setReactivating(false)}>
                      <Icon name="arrowLeft" size={16} /> Voltar sem reativar
                    </button>
                  </div>
                </div>
              )}
              {!reactivating && profile?.trialActive && (
                <p className="rp-notice">
                  <Icon name="clock" size={22} />
                  <span>
                    Seu teste grátis ainda tem {profile.trialDaysRemaining}{" "}
                    {profile.trialDaysRemaining === 1 ? "dia" : "dias"}. Se assinar agora, a cobrança começa hoje.
                  </span>
                </p>
              )}
              {!reactivating && status.subscription?.status === "cancelled" && status.subscription.accessExpiresAt && (
                <p className="rp-notice">
                  <Icon name="calendar" size={22} />
                  <span>Sua assinatura anterior foi cancelada em {formatDate(status.subscription.cancelledAt ?? "")}.</span>
                </p>
              )}

              <fieldset className="rp-fieldset">
                <legend><h2>Escolha o plano</h2></legend>
                <div className="rp-plans">
                  {plans.map((p) => (
                    <label key={p.tier} className={`rp-plan${tier === p.tier ? " on" : ""}`}>
                      <input type="radio" name="tier" value={p.tier} checked={tier === p.tier} onChange={() => setTier(p.tier)} />
                      <span className="rp-row" style={{ justifyContent: "space-between" }}>
                        <strong>{TIER_LABEL[p.tier]}</strong>
                        {p.tier === "annual" && yearlySaving > 0 && (
                          <span className="rp-badge coral">Economize {formatCents(yearlySaving)}</span>
                        )}
                      </span>
                      <span className="price">{p.priceFormatted}</span>
                      <span className="rp-muted">
                        {p.frequencyMonths === 12
                          ? `Equivale a ${formatCents(Math.round(p.priceCents / 12))} por mês, cobrado uma vez por ano.`
                          : "Cobrado todo mês."}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <ul className="rp-checks">
                {BENEFITS.map((b) => (
                  <li key={b}>
                    <Icon name="check" size={18} /> {b}
                  </li>
                ))}
              </ul>
            </div>

            <section className="rp-card rp-stack" aria-label="Pagamento">
              <div className="rp-stack" style={{ gap: 4 }}>
                <h2>Pagamento com cartão de crédito</h2>
                <p className="rp-muted">
                  {selected?.title}: {selected?.priceFormatted}
                  {reactivating && accessEnd ? `, a partir de ${formatDate(accessEnd)}` : ""}. Pagamento seguro pelo
                  Mercado Pago; o Guia BIA não recebe os dados do seu cartão.
                </p>
              </div>
              <Field
                label="E-mail de quem paga"
                name="payerEmail"
                required
                hint={
                  TEST_PAYER_EMAIL
                    ? "Modo de teste: e-mail da conta compradora de teste do Mercado Pago (.env.local)."
                    : "O Mercado Pago envia o comprovante para este e-mail."
                }
                error={payerField.errors.payerEmail}
              >
                <input
                  className="rp-input"
                  type="email"
                  autoComplete="email"
                  value={payerEmail}
                  onChange={(e) => {
                    setPayerEmail(e.target.value);
                    payerField.setErrors({});
                  }}
                />
              </Field>
              {selected && (
                <CardBrick
                  key={selected.tier}
                  amountCents={selected.priceCents}
                  email={defaultPayer}
                  onToken={subscribe}
                  onError={setError}
                />
              )}
              <p className="rp-muted" style={{ fontSize: ".85rem" }}>
                A assinatura renova automaticamente ao fim de cada período até você cancelar, aqui nesta tela. Ao
                assinar, você concorda com os <Link href="/termo">Termos de Uso</Link>.
              </p>
            </section>
          </div>
        )}
      </div>
    </PortalShell>
  );
}

function ActivePlan({
  status,
  justSubscribed,
  justReactivated,
  cancelling,
  onCancel,
  onReactivate,
}: {
  status: BillingStatus;
  justSubscribed: boolean;
  justReactivated: boolean;
  cancelling: boolean;
  onCancel: () => void;
  onReactivate: () => void;
}) {
  const sub = status.subscription;
  const fromWeb = status.planSource === "web" && sub;
  const scheduled = status.scheduled;
  const renewalOff = sub?.status === "cancelled" && !scheduled;
  return (
    <div className="rp-stack" style={{ maxWidth: 720 }}>
      {justSubscribed && <Success>Assinatura confirmada! Obrigada por confiar no Guia BIA.</Success>}
      {justReactivated && <Success>Assinatura reativada! Nada foi cobrado agora.</Success>}
      <section className="rp-card rp-stack">
        <div className="rp-between">
          <h2>Seu plano BIA Pro está ativo</h2>
          <span className={`rp-badge ${renewalOff ? "closed" : "active"}`}>
            {renewalOff ? "Renovação cancelada" : scheduled ? "Reativada" : "Ativo"}
          </span>
        </div>

        {status.planSource === "google_play" && (
          <p className="rp-muted">
            Sua assinatura foi feita pelo Google Play. Para mudar ou cancelar, use o app ou acesse{" "}
            <a href={PLAY_SUBSCRIPTIONS} target="_blank" rel="noopener noreferrer">
              play.google.com/store/account/subscriptions
            </a>
            .
          </p>
        )}
        {status.planSource === "cortesia" && <p className="rp-muted">Seu acesso é uma cortesia da equipe BIA.</p>}

        {fromWeb && (
          <>
            <div className="rp-meta">
              <span><Icon name="sparkle" size={16} /> {TIER_LABEL[sub.tier]} · {sub.priceFormatted}</span>
              {sub.status !== "cancelled" && sub.nextPaymentDate && (
                <span><Icon name="calendar" size={16} /> Próxima cobrança em {formatDate(sub.nextPaymentDate)}</span>
              )}
              {sub.status === "cancelled" && sub.accessExpiresAt && (
                <span><Icon name="clock" size={16} /> Acesso até {formatDate(sub.accessExpiresAt)}</span>
              )}
            </div>
            {sub.status === "past_due" && (
              <p className="rp-notice">
                <Icon name="money" size={22} />
                <span>
                  A última cobrança não foi aprovada. O Mercado Pago vai tentar de novo nos próximos dias; confira se o
                  cartão tem limite. Seu acesso continua enquanto isso.
                </span>
              </p>
            )}
            {scheduled && (
              <p className="rp-notice">
                <Icon name="calendar" size={22} />
                <span>
                  Assinatura reativada: plano {TIER_LABEL[scheduled.tier].toLowerCase()} ({scheduled.priceFormatted}). A
                  primeira cobrança será em {formatDate(scheduled.startsAt)}, quando o acesso atual acabar.
                </span>
              </p>
            )}
            {renewalOff && status.canReactivate && (
              <div className="rp-stack" style={{ gap: 8 }}>
                <p className="rp-muted">
                  Quer continuar depois dessa data? Reative a assinatura: nada é cobrado agora, e a cobrança começa
                  quando o acesso atual acabar.
                </p>
                <div>
                  <button type="button" className="rp-btn coral" onClick={onReactivate}>
                    Reativar assinatura
                  </button>
                </div>
              </div>
            )}
            {(sub.status !== "cancelled" || scheduled) && (
              <div>
                <button type="button" className="rp-btn danger" onClick={onCancel} disabled={cancelling}>
                  {cancelling ? "Cancelando…" : scheduled ? "Cancelar reativação" : "Cancelar renovação"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
      <Link className="rp-btn" href={HOME} style={{ justifySelf: "start" }}>
        Ir para as vagas
      </Link>
    </div>
  );
}
