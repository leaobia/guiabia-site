import { ApiError } from "@/lib/recrutadora/api";

/**
 * Trata os erros de acesso das telas de vaga: e-mail não verificado vai para a verificação,
 * e sem acesso/rejeitada recarrega o perfil para a tela mostrar o aviso certo.
 * Devolve true quando o erro já foi tratado.
 */
export async function handleAccessError(
  err: unknown,
  go: (path: string) => void,
  reload: () => Promise<void>
): Promise<boolean> {
  if (!(err instanceof ApiError)) return false;
  if (err.code === "EMAIL_NOT_VERIFIED") {
    go("/recrutadora/verificar-email");
    return true;
  }
  if (err.code === "PLAN_FEATURE_REQUIRED" || err.code === "RECRUITER_REJECTED") {
    await reload().catch(() => {});
  }
  return false;
}
