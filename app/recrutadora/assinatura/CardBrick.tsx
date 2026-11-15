"use client";

import { useEffect, useRef, useState } from "react";

// Card Payment Brick do Mercado Pago: o cartão é digitado no formulário do Mercado Pago
// e só o token (uso único) chega ao nosso back. Nenhum dado de cartão passa pelo site.
const SDK_URL = "https://sdk.mercadopago.com/js/v2";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

type BrickController = { unmount: () => void };
type MercadoPagoSdk = new (key: string, options: { locale: string }) => {
  bricks: () => { create: (type: "cardPayment", containerId: string, settings: unknown) => Promise<BrickController> };
};

declare global {
  interface Window {
    MercadoPago?: MercadoPagoSdk;
  }
}

let sdkPromise: Promise<void> | null = null;
function loadSdk() {
  if (window.MercadoPago) return Promise.resolve();
  sdkPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error("sdk"));
    };
    document.head.appendChild(script);
  });
  return sdkPromise;
}

type Props = {
  /** Valor em centavos, só para exibir no formulário; quem cobra é o back. */
  amountCents: number;
  email?: string;
  /** Recebe o token do cartão. Se rejeitar, o formulário volta a aceitar envio. */
  onToken: (token: string, payerEmail?: string) => Promise<void>;
  onError: (message: string) => void;
};

const CONTAINER_ID = "bia-card-brick";

export default function CardBrick({ amountCents, email, onToken, onError }: Props) {
  const [loading, setLoading] = useState(true);
  // Callbacks sempre atuais sem recriar o formulário a cada render
  const handlers = useRef({ onToken, onError });
  handlers.current = { onToken, onError };

  useEffect(() => {
    if (!PUBLIC_KEY) {
      handlers.current.onError("O pagamento pelo site ainda não está configurado. Fale com a equipe BIA.");
      setLoading(false);
      return;
    }
    let controller: BrickController | null = null;
    let cancelled = false;
    setLoading(true);

    loadSdk()
      .then(() => {
        if (cancelled || !window.MercadoPago) return;
        const mp = new window.MercadoPago(PUBLIC_KEY, { locale: "pt-BR" });
        return mp.bricks().create("cardPayment", CONTAINER_ID, {
          initialization: { amount: amountCents / 100, payer: email ? { email } : undefined },
          customization: {
            // Assinatura recorrente só aceita cartão de crédito, sem parcelamento
            paymentMethods: { maxInstallments: 1, types: { included: ["credit_card"] } },
            visual: {
              texts: { formTitle: "Cartão de crédito", formSubmit: "Assinar" },
              style: {
                theme: "default",
                customVariables: {
                  baseColor: "#4b1d80",
                  baseColorFirstVariant: "#6b2fb5",
                  baseColorSecondVariant: "#2d0f52",
                  borderRadiusMedium: "14px",
                  borderRadiusLarge: "20px",
                  formBackgroundColor: "#ffffff",
                },
              },
            },
          },
          callbacks: {
            onReady: () => setLoading(false),
            onSubmit: (data: { token: string; payer?: { email?: string } }) =>
              handlers.current.onToken(data.token, data.payer?.email),
            onError: (error: { type?: string }) => {
              if (error?.type === "critical") {
                setLoading(false);
                handlers.current.onError(
                  "Não foi possível carregar o formulário do cartão. Recarregue a página e tente de novo."
                );
              }
            },
          },
        });
      })
      .then((c) => {
        if (!c) return;
        if (cancelled) c.unmount();
        else controller = c;
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
        handlers.current.onError(
          "Não foi possível carregar o formulário do Mercado Pago. Confira sua internet ou se algum bloqueador está impedindo o carregamento."
        );
      });

    return () => {
      cancelled = true;
      controller?.unmount();
    };
  }, [amountCents, email]);

  return (
    <div>
      {loading && (
        <p className="rp-muted" role="status" style={{ padding: "24px 0", textAlign: "center" }}>
          Carregando o formulário seguro do Mercado Pago…
        </p>
      )}
      <div id={CONTAINER_ID} />
    </div>
  );
}
