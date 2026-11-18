"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type PointerEvent } from "react";
import Avatar from "@/components/Avatar";
import { isFounderAccount, parseApiDate } from "../FounderBanner";
import Icon from "../icons";
import { HOME, usePortal } from "../PortalProvider";
import { Loading, PortalShell } from "../ui";
import { ART_H, ART_W, clampFraming, DEFAULT_FRAMING, drawCard, toArtScale, type Framing } from "./art";

const INSTAGRAM = "bia.sua.jornada";
const CAPTION =
  `Agora é oficial: sou Recrutadora Fundadora do Guia BIA! 💜\n` +
  `Eu faço parte do começo de uma comunidade que conecta mulheres a oportunidades de trabalho.\n\n` +
  `@${INSTAGRAM} #GuiaBIA #RecrutadoraFundadora #VagasParaMulheres`;
const FILE_NAME = "carteirinha-recrutadora-fundadora.jpg";
const MAX_BYTES = 25 * 1024 * 1024;
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "nov/2026", no horário de Brasília. */
function sinceLabel(createdAt?: string | null) {
  const t = parseApiDate(createdAt);
  if (!Number.isFinite(t)) return "";
  const [y, m] = new Date(t).toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" }).split("-");
  return `${MONTHS[Number(m) - 1]}/${y}`;
}

/** Número da carteirinha: os 8 primeiros caracteres do id da conta. */
const cardNumber = (id: string) => {
  const hex = id.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase();
  return `${hex.slice(0, 4)}-${hex.slice(4)}`;
};

/** Fonte do site (Manrope do next/font), já carregada nos pesos usados na arte. */
async function siteFont() {
  const family = getComputedStyle(document.body).fontFamily || "sans-serif";
  try {
    await Promise.all(["600", "700", "800"].map((w) => document.fonts.load(`${w} 40px ${family}`, "Recrutadora Fundadora “Eu faço parte do começo!”")));
  } catch {}
  return family;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img); // a URL só é liberada quando trocar a foto ou sair da tela
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não conseguimos abrir essa imagem. Tente uma foto em JPG ou PNG."));
    };
    img.src = url;
  });
}

export default function Carteirinha() {
  const { ready, user, profile } = usePortal("recruiter");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);

  const [font, setFont] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [framing, setFraming] = useState<Framing>(DEFAULT_FRAMING);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const eligible = isFounderAccount(user);

  useEffect(() => {
    siteFont().then(setFont);
  }, []);

  // Libera a foto da memória ao trocar ou sair
  useEffect(() => () => {
    if (photo?.src.startsWith("blob:")) URL.revokeObjectURL(photo.src);
  }, [photo]);

  // Redesenha a cada mudança e prepara o arquivo final (pronto antes do clique, para o compartilhar funcionar no iPhone)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !font || !user) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawCard(ctx, {
      name: user.fullName,
      company: profile?.companyName ?? null,
      since: sinceLabel(user.createdAt),
      number: cardNumber(user.id),
      photo,
      framing,
      font,
    });
    setFile(null);
    if (!photo) return;
    const timer = setTimeout(() => {
      canvas.toBlob((blob) => blob && setFile(new File([blob], FILE_NAME, { type: "image/jpeg" })), "image/jpeg", 0.95);
    }, 250);
    return () => clearTimeout(timer);
  }, [font, user, profile, photo, framing, eligible, ready]);

  const pickPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0];
    e.target.value = "";
    if (!chosen) return;
    setError(null);
    setNotice(null);
    if (!chosen.type.startsWith("image/")) return setError("Escolha um arquivo de imagem (JPG ou PNG).");
    if (chosen.size > MAX_BYTES) return setError("Essa foto é muito grande. Escolha uma de até 25 MB.");
    try {
      const img = await loadImage(chosen);
      setFraming(DEFAULT_FRAMING);
      setPhoto(img);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const move = useCallback(
    (dx: number, dy: number) => setFraming((f) => clampFraming(photo, { ...f, ox: f.ox + dx, oy: f.oy + dy })),
    [photo]
  );

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!photo) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const k = toArtScale(e.currentTarget);
    move((e.clientX - d.x) * k, (e.clientY - d.y) * k);
    drag.current = { ...d, x: e.clientX, y: e.clientY };
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const copyCaption = () => {
    navigator.clipboard?.writeText(CAPTION).then(
      () => setNotice(`Legenda copiada! Cole no Instagram e marque @${INSTAGRAM}.`),
      () => setNotice(null)
    );
  };

  const download = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = FILE_NAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const canShareFile = typeof navigator !== "undefined" && !!file && !!navigator.canShare?.({ files: [file] });

  const share = () => {
    if (!file) return;
    // A legenda vai para a área de transferência: o Instagram não recebe texto junto com a imagem
    navigator.clipboard?.writeText(CAPTION).catch(() => {});
    if (canShareFile) {
      navigator.share({ files: [file], text: CAPTION }).then(
        () => setNotice(`Legenda copiada! Ao postar, cole a legenda e marque @${INSTAGRAM}. 💜`),
        (err: Error) => {
          if (err.name !== "AbortError") setError("Não deu para abrir o compartilhamento. Baixe a imagem e poste pelo Instagram.");
        }
      );
      return;
    }
    // Computador (ou navegador sem compartilhamento de arquivo): baixa e explica o caminho
    download();
    setNotice(
      `Imagem baixada e legenda copiada! Envie a imagem para o celular e poste no Instagram (feed ou stories), ou publique em instagram.com. Não esqueça de marcar @${INSTAGRAM}.`
    );
  };

  if (!ready || !user) return <Loading />;

  if (!eligible) {
    return (
      <PortalShell>
        <div className="rp-card rp-empty" style={{ maxWidth: 620, margin: "0 auto" }}>
          <Avatar size={110} state="thinking" dot={false} />
          <h1 style={{ fontSize: "1.6rem" }}>Carteirinha de Recrutadora Fundadora</h1>
          <p className="rp-muted">
            A carteirinha é exclusiva para as recrutadoras que criaram a conta até 31/01/2027, as primeiras do Guia BIA.
          </p>
          <Link className="rp-btn" href={HOME}>
            Voltar para as vagas
          </Link>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell>
      <div className="rp-stack lg">
        <Link href={HOME} className="rp-back">
          <Icon name="arrowLeft" size={18} /> Voltar para as vagas
        </Link>

        <div className="rp-stack" style={{ gap: 8, maxWidth: 680 }}>
          <span className="rp-founder-tag" style={{ justifySelf: "start" }}>Recrutadora Fundadora 💜</span>
          <h1>Sua carteirinha de Recrutadora Fundadora</h1>
          <p className="rp-muted">
            Você faz parte do começo do Guia BIA. Coloque sua foto, gere a arte e compartilhe esse momento nas suas redes.
          </p>
        </div>

        <div className="rp-cc">
          <div className="rp-cc-preview">
            <canvas
              ref={canvasRef}
              width={ART_W}
              height={ART_H}
              className={photo ? "has-photo" : undefined}
              role="img"
              aria-label={`Pré-visualização da carteirinha de Recrutadora Fundadora de ${user.fullName}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            />
            {photo && <p className="rp-muted rp-cc-hint">Arraste a foto para ajustar o enquadramento.</p>}
          </div>

          <div className="rp-stack rp-cc-steps">
            <section className="rp-card rp-stack">
              <h2>
                <span className="rp-cc-num">1</span> Sua foto
              </h2>
              <label className="rp-cc-consent">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>
                  Autorizo o uso da minha foto apenas para montar a minha carteirinha de Recrutadora Fundadora.
                </span>
              </label>
              <p className="rp-cc-privacy">
                <Icon name="check" size={18} />
                <span>
                  A foto não sai do seu aparelho: a arte é montada aqui no navegador, sem retoque, filtro ou IA. O Guia
                  BIA não guarda a foto nem publica nada por você.
                </span>
              </p>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickPhoto} />
              <button
                type="button"
                className={`rp-btn${photo ? " secondary" : ""} block`}
                disabled={!consent}
                style={!consent ? { cursor: "not-allowed" } : undefined}
                onClick={() => fileRef.current?.click()}
              >
                <Icon name="camera" size={18} /> {photo ? "Trocar foto e gerar de novo" : "Escolher minha foto"}
              </button>
              {!consent && <p className="rp-muted" style={{ fontSize: ".88rem" }}>Marque a autorização para escolher a foto.</p>}
              {error && (
                <p className="rp-alert" role="alert">
                  {error}
                </p>
              )}
              {photo && (
                <div className="rp-field">
                  <label htmlFor="cc-zoom">Zoom</label>
                  <input
                    id="cc-zoom"
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={framing.zoom}
                    onChange={(e) => setFraming((f) => clampFraming(photo, { ...f, zoom: Number(e.target.value) }))}
                  />
                </div>
              )}
            </section>

            <section className={`rp-card rp-stack${photo ? "" : " rp-cc-off"}`} aria-disabled={!photo}>
              <h2>
                <span className="rp-cc-num">2</span> Compartilhe
              </h2>
              <button type="button" className="rp-btn coral block rp-cc-insta" disabled={!file} onClick={share}>
                <Icon name="instagram" size={20} /> Compartilhar no Instagram
              </button>
              <div className="rp-row" style={{ gap: 10 }}>
                <button type="button" className="rp-btn secondary small" style={{ flex: "1 1 220px" }} disabled={!file} onClick={download}>
                  <Icon name="download" size={18} /> Baixar em alta resolução
                </button>
                <button type="button" className="rp-btn secondary small" style={{ flex: "1 1 220px" }} onClick={copyCaption}>
                  <Icon name="copy" size={18} /> Copiar legenda
                </button>
              </div>
              {notice && (
                <p className="rp-ok" role="status">
                  {notice}
                </p>
              )}
              <div className="rp-cc-tag">
                <Icon name="instagram" size={22} />
                <span>
                  Ao postar, marque{" "}
                  <a href={`https://www.instagram.com/${INSTAGRAM}/`} target="_blank" rel="noopener noreferrer">
                    @{INSTAGRAM}
                  </a>{" "}
                  pra gente comemorar com você! 💜
                </span>
              </div>
              <p className="rp-muted" style={{ fontSize: ".88rem" }}>
                No celular, o botão abre o compartilhamento: escolha Instagram (feed ou stories) e cole a legenda, que já
                fica copiada. A imagem tem 1080×1350, no tamanho certo para o feed.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
