"use client";

import Link from "next/link";
import Avatar from "@/components/Avatar";
import Footer from "@/components/Footer";
import Icon, { type IconName } from "./icons";
import { LOGIN, nextStep, usePortal } from "./PortalProvider";
import { Brand } from "./ui";

const SIGNUP = "/recrutadora/cadastro";

const BENEFITS: { icon: IconName; tone: string; title: string; text: string }[] = [
  {
    icon: "heart",
    tone: "coral",
    title: "Vagas para mulheres",
    text: "Sua vaga aparece no app Guia BIA, para mulheres que buscam trabalho, recolocação ou um novo começo.",
  },
  {
    icon: "sparkle",
    tone: "",
    title: "Grátis no início",
    text: "Ative o perfil de recrutadora e publique vagas por 30 dias sem pagar nada.",
  },
  {
    icon: "users",
    tone: "ok",
    title: "Candidatas organizadas",
    text: "Veja o currículo de cada candidata e marque quem foi analisada, pré-selecionada ou contratada.",
  },
];

export default function Apresentacao() {
  const { status, user, profile } = usePortal("public");
  const loggedIn = status === "ready";
  const cta = loggedIn ? nextStep(user, profile) : SIGNUP;
  const ctaLabel = loggedIn ? "Ir para o portal" : "Começar";

  return (
    <>
      <header className="rp-top">
        <div className="wrap">
          <Brand />
          <nav className="rp-nav" aria-label="Acesso">
            {!loggedIn && <Link href={LOGIN}>Entrar</Link>}
            <Link href={cta} className="rp-btn small">
              {ctaLabel}
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="rp-landing-hero">
          <div className="wrap">
            <div>
              <span className="rp-eyebrow">
                <Icon name="briefcase" size={16} /> Para empresas e recrutadoras
              </span>
              <h1>
                Contrate mulheres <em>incríveis</em> pelo Guia BIA.
              </h1>
              <p className="lead">
                Publique suas vagas no app que acolhe e conecta mulheres a estudo, trabalho e renda. Comece
                grátis e acompanhe cada candidata em um só lugar.
              </p>
              <div className="rp-row">
                <Link className="rp-btn coral" href={cta}>
                  {ctaLabel} <Icon name="arrowRight" size={18} />
                </Link>
                {!loggedIn && (
                  <Link className="rp-btn ghost" href={LOGIN}>
                    Já tenho conta
                  </Link>
                )}
              </div>
            </div>

            <div className="rp-hero-art" aria-hidden="true">
              <Avatar size={150} state="greeting" float />
              <div className="rp-app-card">
                <div className="rp-row" style={{ flexWrap: "nowrap" }}>
                  <span className="rp-app-logo">A</span>
                  <div>
                    <h4>Assistente administrativa</h4>
                    <p className="rp-muted">Sua empresa</p>
                  </div>
                </div>
                <div className="rp-row" style={{ gap: 6 }}>
                  <span className="rp-pill"><Icon name="laptop" size={14} /> Híbrido</span>
                  <span className="rp-pill"><Icon name="pin" size={14} /> São Paulo, SP</span>
                  <span className="rp-badge coral">Mães</span>
                </div>
                <span className="rp-app-btn">Quero me candidatar</span>
              </div>
            </div>
          </div>
        </section>

        <section className="rp-section">
          <div className="wrap rp-stack lg">
            <h2>Por que publicar no Guia BIA?</h2>
            <div className="rp-grid three">
              {BENEFITS.map((b) => (
                <article key={b.title} className={`rp-card rp-benefit ${b.tone}`}>
                  <span className="ico"><Icon name={b.icon} size={26} /></span>
                  <h3>{b.title}</h3>
                  <p className="rp-muted">{b.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rp-section" style={{ paddingTop: 0 }}>
          <div className="wrap rp-stack lg">
            <h2>Como funciona</h2>
            <ol className="rp-howto">
              <li>
                <h3>Crie sua conta</h3>
                <p className="rp-muted">Use seu e-mail ou a mesma conta do app. Depois, confirme o e-mail com um código.</p>
              </li>
              <li>
                <h3>Publique a vaga</h3>
                <p className="rp-muted">Em três passos, com a prévia de como ela aparece no app. Marque se é uma vaga afirmativa.</p>
              </li>
              <li>
                <h3>Receba candidatas</h3>
                <p className="rp-muted">Veja os currículos e atualize a situação de cada candidatura.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="rp-section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="rp-cta-band">
              <Avatar size={96} state="thinking" dot={false} />
              <h2>Sua próxima contratação pode estar no Guia BIA.</h2>
              <p>Ative o perfil de recrutadora e ganhe 30 dias grátis para publicar vagas.</p>
              <Link className="rp-btn coral" href={cta}>
                {ctaLabel} <Icon name="arrowRight" size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <div className="wrap">
        <Footer />
      </div>
    </>
  );
}
