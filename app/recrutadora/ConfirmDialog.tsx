"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Avatar from "@/components/Avatar";

type Options = {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** Ação que apaga ou encerra algo: botão de confirmar em vermelho. */
  danger?: boolean;
};

/**
 * Confirmação no estilo do portal, no lugar do window.confirm.
 * Uso: const [dialog, confirm] = useConfirm(); ... if (await confirm({...})) ...; e renderize {dialog}.
 * O <dialog> nativo cuida do foco, da tecla Esc e de bloquear o resto da página.
 */
export function useConfirm() {
  const ref = useRef<HTMLDialogElement>(null);
  const resolver = useRef<((ok: boolean) => void) | null>(null);
  const [options, setOptions] = useState<Options | null>(null);

  useEffect(() => {
    if (options && !ref.current?.open) ref.current?.showModal();
  }, [options]);

  const close = (ok: boolean) => {
    ref.current?.close();
    resolver.current?.(ok);
    resolver.current = null;
    setOptions(null);
  };

  const confirm = useCallback(
    (opts: Options) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setOptions(opts);
      }),
    []
  );

  const dialog = (
    <dialog
      ref={ref}
      className="rp-modal"
      aria-labelledby="rp-modal-title"
      onCancel={(e) => {
        e.preventDefault();
        close(false);
      }}
      onClick={(e) => {
        // Clique fora da caixa (no fundo escurecido) cancela
        if (e.target === ref.current) close(false);
      }}
    >
      {options && (
        <div className="rp-modal-box rp-stack">
          <Avatar size={64} state="thinking" dot={false} />
          <h2 id="rp-modal-title">{options.title}</h2>
          <div className="rp-muted">{options.message}</div>
          <div className="rp-modal-actions">
            <button type="button" className="rp-btn secondary" onClick={() => close(false)} autoFocus>
              {options.cancelLabel ?? "Voltar"}
            </button>
            <button type="button" className={`rp-btn${options.danger ? " danger-solid" : ""}`} onClick={() => close(true)}>
              {options.confirmLabel}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );

  return [dialog, confirm] as const;
}
