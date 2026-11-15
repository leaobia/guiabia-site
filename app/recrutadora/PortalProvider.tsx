"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  api,
  clearSession,
  readSession,
  saveSession,
  setSessionExpiredHandler,
  type RecruiterProfile,
  type User,
} from "@/lib/recrutadora/api";

type Status = "loading" | "anon" | "ready";

type Portal = {
  status: Status;
  user: User | null;
  profile: RecruiterProfile | null;
  /** true logo após o cadastro: o back já enviou o código de verificação. */
  justRegistered: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  reload: () => Promise<void>;
};

const PortalContext = createContext<Portal | null>(null);

export const HOME = "/recrutadora/vagas";
export const LOGIN = "/recrutadora/entrar";
export const ACTIVATE = "/recrutadora/ativar";
export const VERIFY = "/recrutadora/verificar-email";

/** Para onde vai quem acabou de entrar (ou de verificar o e-mail). */
export function nextStep(user: User | null, profile: RecruiterProfile | null, skipVerify = false) {
  if (user && !user.emailVerified && !skipVerify) return VERIFY;
  return profile?.isRecruiter ? HOME : ACTIVATE;
}

export default function PortalProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [justRegistered, setJustRegistered] = useState(false);

  const toAnon = useCallback(() => {
    setUser(null);
    setProfile(null);
    setStatus("anon");
  }, []);

  const reload = useCallback(async () => {
    const [u, p] = await Promise.all([api.me(), api.profile()]);
    setUser(u);
    setProfile(p);
    setStatus("ready");
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      toAnon();
      router.replace(LOGIN);
    });
    if (!readSession()) {
      toAnon();
      return;
    }
    reload().catch(() => {
      // Sessão inválida já caiu no handler acima; outros erros (rede) também pedem novo login
      if (!readSession()) toAnon();
      else setStatus("anon");
    });
  }, [reload, router, toAnon]);

  const value = useMemo<Portal>(
    () => ({
      status,
      user,
      profile,
      justRegistered,
      reload,
      login: async (email, password) => {
        saveSession(await api.login(email, password));
        setJustRegistered(false);
        await reload();
      },
      register: async (fullName, email, password) => {
        saveSession(await api.register(fullName, email, password));
        setJustRegistered(true);
        await reload();
      },
      logout: async () => {
        const s = readSession();
        clearSession();
        toAnon();
        router.replace(LOGIN);
        if (s) await api.logout(s.refreshToken).catch(() => {});
      },
    }),
    [status, user, profile, justRegistered, reload, router, toAnon]
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

/**
 * Lê o portal e redireciona conforme a tela:
 * - "public": não redireciona (página de apresentação).
 * - "guest": telas de login/cadastro; quem já entrou vai para o portal.
 * - "user": precisa estar logada (verificar e-mail, ativar perfil).
 * - "recruiter": precisa ter o perfil de recrutadora ativo.
 * `ready` diz se a tela já pode ser exibida.
 */
export function usePortal(guard: "public" | "guest" | "user" | "recruiter") {
  const portal = useContext(PortalContext);
  if (!portal) throw new Error("usePortal fora do PortalProvider");
  const router = useRouter();
  const pathname = usePathname();
  const { status, user, profile } = portal;

  let target: string | null = null;
  if (status === "anon" && (guard === "user" || guard === "recruiter")) target = LOGIN;
  if (status === "ready" && guard === "guest") target = nextStep(user, profile);
  if (status === "ready" && guard === "recruiter" && !profile?.isRecruiter) target = ACTIVATE;
  if (target === pathname) target = null;

  useEffect(() => {
    if (target) router.replace(target);
  }, [target, router]);

  const ready =
    !target && (guard === "public" ? status !== "loading" : guard === "guest" ? status === "anon" : status === "ready");
  return { ...portal, ready };
}
