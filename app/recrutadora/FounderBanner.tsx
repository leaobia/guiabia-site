"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./icons";

/** Fim da campanha: o banner some depois de 31/01/2027, 23h59 (horário de Brasília). */
const FOUNDER_ENDS_AT = Date.parse("2027-02-01T00:00:00-03:00");
const VIDEO_ID = "rGQ478SoQOg";

/**
 * Só decide no navegador, depois de montar: o HTML gerado no build não traz o banner,
 * então ele não fica no ar por cache depois do prazo e não há diferença de hidratação.
 */
export function useFounderActive() {
  const [active, setActive] = useState(false);
  useEffect(() => setActive(Date.now() < FOUNDER_ENDS_AT), []);
  return active;
}

/** Tutorial do YouTube: o player só carrega quando a pessoa clica (nada do YouTube antes disso). */
function TutorialVideo({ compact }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="rp-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
          title="Tutorial: como funciona o Portal da Recrutadora"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }
  if (compact) {
    return (
      <button type="button" className="rp-btn secondary block" onClick={() => setOpen(true)}>
        <Icon name="play" size={18} /> Veja como funciona
      </button>
    );
  }
  return (
    <button type="button" className="rp-video rp-video-cover" onClick={() => setOpen(true)} aria-label="Veja como funciona: assistir ao tutorial">
      <img src={`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`} alt="" loading="lazy" />
      <span className="rp-video-play">
        <Icon name="play" size={22} /> Veja como funciona
      </span>
    </button>
  );
}

/** Faixa no topo da página inicial, acima do cabeçalho. */
export function FounderStrip({ href }: { href: string }) {
  if (!useFounderActive()) return null;
  return (
    <Link className="rp-founder-strip" href={href}>
      <span aria-hidden="true">💜</span> <strong>Recrutadora Fundadora:</strong> 12 meses grátis até 31/01
      <Icon name="arrowRight" size={16} />
    </Link>
  );
}

/** Texto dos "dias grátis": durante a campanha, só a oferta de fundadora (uma mensagem só). */
export const FOUNDER_FREE = "12 meses grátis para Recrutadoras Fundadoras";

/** Destaque da campanha Recrutadora Fundadora, com o tutorial logo abaixo. */
export default function FounderBanner({ compact = false }: { compact?: boolean }) {
  if (!useFounderActive()) return null;
  return (
    <div className={`rp-stack${compact ? "" : " lg"}`}>
      <aside className={`rp-founder${compact ? " compact" : ""}`} aria-label="Campanha Recrutadora Fundadora">
        <span className="rp-founder-tag">Até 31/01/2027</span>
        <h2>
          <span aria-hidden="true">💜</span> Seja uma Recrutadora Fundadora da Bia
        </h2>
        <p>
          Cadastre-se até 31/01/2027 e ganhe <strong>12 meses grátis do plano BIA Pro</strong>. A cortesia é
          liberada em até 48h após o cadastro. Sem cartão, sem compromisso.
        </p>
      </aside>
      <TutorialVideo compact={compact} />
    </div>
  );
}
