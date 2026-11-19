"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Avatar from "@/components/Avatar";
import type { User } from "@/lib/recrutadora/api";
import { isFounderAccount } from "../FounderBanner";
import Icon from "../icons";

export const CARD_PAGE = "/recrutadora/carteirinha";
/** Grupo do WhatsApp das Recrutadoras Fundadoras. */
export const FOUNDER_GROUP_URL = "https://chat.whatsapp.com/GqeMio59P8iAQZYX2raUiI";
const seenKey = (userId: string) => `bia.carteirinha.convite.${userId}`;

function seen(userId: string) {
  try {
    return localStorage.getItem(seenKey(userId)) === "1";
  } catch {
    return true; // sem armazenamento, não insiste no convite (o atalho no painel continua)
  }
}
function markSeen(userId: string) {
  try {
    localStorage.setItem(seenKey(userId), "1");
  } catch {}
}

/**
 * Convite que aparece uma vez, na chegada ao painel depois do cadastro.
 * "Deixar para mais tarde" só fecha o convite: o atalho no painel continua.
 */
export function FounderCardInvite({ user }: { user: User | null }) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const show = !!user && isFounderAccount(user);

  useEffect(() => {
    if (show && user && !seen(user.id) && !ref.current?.open) ref.current?.showModal();
  }, [show, user]);

  if (!show || !user) return null;

  const later = () => {
    markSeen(user.id);
    ref.current?.close();
  };
  const go = () => {
    markSeen(user.id);
    ref.current?.close();
    router.push(CARD_PAGE);
  };

  return (
    <dialog
      ref={ref}
      className="rp-modal"
      aria-labelledby="cc-invite-title"
      onCancel={(e) => {
        e.preventDefault();
        later();
      }}
    >
      <div className="rp-modal-box rp-stack rp-cc-invite">
        <Avatar size={84} state="greeting" dot={false} />
        <span className="rp-founder-tag">Recrutadora Fundadora</span>
        <h2 id="cc-invite-title">Você faz parte do começo! 💜</h2>
        <p className="rp-muted">
          Como uma das primeiras recrutadoras do Guia BIA, você pode gerar sua carteirinha exclusiva de Recrutadora
          Fundadora e compartilhar esse momento nas suas redes sociais.
        </p>
        <div className="rp-modal-actions">
          <button type="button" className="rp-btn secondary" onClick={later}>
            Deixar para mais tarde
          </button>
          <button type="button" className="rp-btn coral" onClick={go} autoFocus>
            <Icon name="badge" size={18} /> Gerar minha carteirinha
          </button>
        </div>
        <a className="rp-cc-invite-group" href={FOUNDER_GROUP_URL} target="_blank" rel="noopener noreferrer">
          <Icon name="chat" size={18} /> Participe também do grupo das Recrutadoras Fundadoras no WhatsApp
        </a>
      </div>
    </dialog>
  );
}

/** Convite fixo no painel para o grupo das fundadoras (todas com conta criada até 31/01/2027). */
export function FounderGroupEntry({ user }: { user: User | null }) {
  if (!isFounderAccount(user)) return null;
  return (
    <a href={FOUNDER_GROUP_URL} target="_blank" rel="noopener noreferrer" className="rp-cc-entry rp-group-entry">
      <span className="ico">
        <Icon name="chat" size={26} />
      </span>
      <span className="txt">
        <strong>Grupo das Recrutadoras Fundadoras</strong>
        <span>Entre no nosso grupo do WhatsApp e conecte-se com as outras fundadoras.</span>
      </span>
      <span className="go">
        Entrar no grupo <Icon name="arrowRight" size={18} />
      </span>
    </a>
  );
}

/** Atalho fixo no painel para quem tem direito à carteirinha. */
export function FounderCardEntry({ user }: { user: User | null }) {
  if (!isFounderAccount(user)) return null;
  return (
    <Link href={CARD_PAGE} className="rp-cc-entry">
      <span className="ico">
        <Icon name="badge" size={26} />
      </span>
      <span className="txt">
        <strong>Minha carteirinha de Recrutadora Fundadora</strong>
        <span>Gere sua arte com foto e compartilhe nas redes.</span>
      </span>
      <span className="go">
        Gerar <Icon name="arrowRight" size={18} />
      </span>
    </Link>
  );
}
