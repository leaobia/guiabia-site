// Desenha a carteirinha de Recrutadora Fundadora (1080×1350, 4:5) num <canvas>, no próprio navegador.
// A foto é usada como veio: só recorte e posição escolhidos pela recrutadora, sem filtro nem retoque.

export const ART_W = 1080;
export const ART_H = 1350;

/** Moldura em arco onde vai a foto (o destaque da peça). */
const ARCH = { x: 200, y: 206, w: 680, h: 700, r: 56 };

const C = {
  deep: "#2d0f52",
  violet: "#4b1d80",
  purple: "#6b2fb5",
  lilac: "#dcc7ec",
  glow: "#e0c8f0",
  mist: "#f3ebfa",
  coral: "#e8746a",
  coralSoft: "#fdebe7",
};

export type Framing = { zoom: number; ox: number; oy: number };
export const DEFAULT_FRAMING: Framing = { zoom: 1, ox: 0, oy: 0 };

export type CardData = {
  name: string;
  company: string | null;
  /** Ex.: "nov/2026" */
  since: string;
  /** Número da carteirinha, derivado do id da conta. */
  number: string;
  photo: HTMLImageElement | null;
  framing: Framing;
  /** Família da fonte do site (Manrope, carregada pelo next/font). */
  font: string;
};

/** Tamanho da foto desenhada e quanto dá para arrastar para cada lado. */
function photoBox(photo: HTMLImageElement, zoom: number) {
  const iw = photo.naturalWidth;
  const ih = photo.naturalHeight;
  const scale = Math.max(ARCH.w / iw, ARCH.h / ih) * zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  return { dw, dh, maxX: (dw - ARCH.w) / 2, maxY: (dh - ARCH.h) / 2 };
}

/** Mantém a foto cobrindo toda a moldura (sem sobrar fundo). */
export function clampFraming(photo: HTMLImageElement | null, f: Framing): Framing {
  if (!photo) return f;
  const zoom = Math.min(3, Math.max(1, f.zoom));
  const { maxX, maxY } = photoBox(photo, zoom);
  return {
    zoom,
    ox: Math.max(-maxX, Math.min(maxX, f.ox)),
    oy: Math.max(-maxY, Math.min(maxY, f.oy)),
  };
}

function archPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const top = w / 2;
  ctx.beginPath();
  ctx.moveTo(x, y + top);
  ctx.arc(x + top, y + top, top, Math.PI, 0);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.closePath();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Estrelinha de 4 pontas (o "brilho" usado no portal). */
function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.quadraticCurveTo(x + s * 0.18, y - s * 0.18, x + s, y);
  ctx.quadraticCurveTo(x + s * 0.18, y + s * 0.18, x, y + s);
  ctx.quadraticCurveTo(x - s * 0.18, y + s * 0.18, x - s, y);
  ctx.quadraticCurveTo(x - s * 0.18, y - s * 0.18, x, y - s);
  ctx.fill();
  ctx.restore();
}

function heart(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.9);
  ctx.bezierCurveTo(cx - s * 1.3, cy + s * 0.05, cx - s * 0.75, cy - s * 0.95, cx, cy - s * 0.35);
  ctx.bezierCurveTo(cx + s * 0.75, cy - s * 0.95, cx + s * 1.3, cy + s * 0.05, cx, cy + s * 0.9);
  ctx.fill();
  ctx.restore();
}

/** Flor do logo do Guia BIA (a mesma do /logo.svg), sem o quadrado de fundo. */
function flower(ctx: CanvasRenderingContext2D, cx: number, cy: number, unit: number, petal: string, center: string, dot: string) {
  const pts: [number, number][] = [
    [0, -9],
    [8.6, -2.8],
    [5.3, 7.3],
    [-5.3, 7.3],
    [-8.6, -2.8],
  ];
  ctx.fillStyle = petal;
  for (const [px, py] of pts) {
    ctx.beginPath();
    ctx.arc(cx + px * unit, cy + py * unit, 5.4 * unit, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = center;
  ctx.beginPath();
  ctx.arc(cx, cy, 3.6 * unit, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = dot;
  ctx.beginPath();
  ctx.arc(cx, cy, 1.8 * unit, 0, Math.PI * 2);
  ctx.fill();
}

/** Logo do Guia BIA: o mesmo desenho do /logo.svg (64×64), em qualquer tamanho. */
function logo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, font: string) {
  const u = size / 64;
  ctx.save();
  roundRect(ctx, x, y, size, size, 14 * u);
  ctx.fillStyle = C.violet;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "rgba(224,200,240,.45)";
  ctx.stroke();
  flower(ctx, x + 32 * u, y + 25 * u, u, C.lilac, C.violet, C.mist);
  ctx.fillStyle = C.mist;
  ctx.font = `700 ${15 * u}px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("bia", x + 32 * u, y + 56 * u);
  ctx.restore();
}

/** Texto com espaçamento entre letras (canvas.letterSpacing ainda não existe em todo navegador). */
function spacedWidth(ctx: CanvasRenderingContext2D, text: string, spacing: number) {
  return ctx.measureText(text).width + spacing * (text.length - 1);
}
function spacedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number, align: "left" | "center" | "right") {
  const w = spacedWidth(ctx, text, spacing);
  let cx = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
  ctx.save();
  ctx.textAlign = "left";
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
  ctx.restore();
}

/** Quebra o nome em até 2 linhas, diminuindo a fonte até caber. */
function fitName(ctx: CanvasRenderingContext2D, name: string, font: string, maxW: number) {
  for (let size = 72; size >= 44; size -= 2) {
    ctx.font = `800 ${size}px ${font}`;
    if (ctx.measureText(name).width <= maxW) return { size, lines: [name] };
  }
  const words = name.split(/\s+/);
  for (let size = 56; size >= 34; size -= 2) {
    ctx.font = `800 ${size}px ${font}`;
    // Melhor ponto de quebra: a linha mais larga fica a menor possível
    let best: string[] | null = null;
    let bestW = Infinity;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(" ");
      const b = words.slice(i).join(" ");
      const w = Math.max(ctx.measureText(a).width, ctx.measureText(b).width);
      if (w < bestW) {
        bestW = w;
        best = [a, b];
      }
    }
    if (best && bestW <= maxW) return { size, lines: best };
  }
  // Nome sem espaços e muito longo: corta com reticências
  ctx.font = `800 34px ${font}`;
  let cut = name;
  while (cut.length > 1 && ctx.measureText(cut + "…").width > maxW) cut = cut.slice(0, -1);
  return { size: 34, lines: [cut + "…"] };
}

function fitText(ctx: CanvasRenderingContext2D, text: string, weight: number, start: number, min: number, font: string, maxW: number) {
  let size = start;
  ctx.font = `${weight} ${size}px ${font}`;
  while (size > min && ctx.measureText(text).width > maxW) {
    size -= 1;
    ctx.font = `${weight} ${size}px ${font}`;
  }
  let t = text;
  while (t.length > 1 && ctx.measureText(t).width > maxW) t = t.slice(0, -2) + "…";
  return t;
}

export function drawCard(ctx: CanvasRenderingContext2D, d: CardData) {
  const { font } = d;
  ctx.save();
  ctx.clearRect(0, 0, ART_W, ART_H);
  ctx.textBaseline = "alphabetic";

  /* ---------- fundo ---------- */
  const bg = ctx.createLinearGradient(0, 0, ART_W, ART_H);
  bg.addColorStop(0, C.deep);
  bg.addColorStop(0.55, C.violet);
  bg.addColorStop(1, C.purple);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, ART_W, ART_H);

  const glow = (x: number, y: number, r: number, color: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, ART_W, ART_H);
  };
  glow(1010, 250, 520, "rgba(232,116,106,.42)");
  glow(40, 1240, 560, "rgba(224,200,240,.22)");
  glow(540, 560, 520, "rgba(143,79,207,.35)");

  // Flor do logo, grande e bem suave, como marca d'água
  ctx.save();
  ctx.globalAlpha = 0.06;
  flower(ctx, 1060, 640, 15, "#fff", "rgba(0,0,0,0)", "rgba(0,0,0,0)");
  flower(ctx, 40, 560, 10, "#fff", "rgba(0,0,0,0)", "rgba(0,0,0,0)");
  ctx.restore();

  /* ---------- cabeçalho ---------- */
  logo(ctx, 72, 60, 92, font);
  ctx.fillStyle = "#fff";
  ctx.font = `800 44px ${font}`;
  ctx.textAlign = "left";
  ctx.fillText("Guia BIA", 186, 104);
  ctx.fillStyle = C.glow;
  ctx.font = `600 24px ${font}`;
  ctx.fillText("Portal da Recrutadora", 187, 140);

  ctx.textAlign = "right";
  ctx.fillStyle = C.glow;
  ctx.font = `700 20px ${font}`;
  spacedText(ctx, "CARTEIRINHA OFICIAL", 1008, 100, 3.5, "right");
  ctx.fillStyle = "#fff";
  ctx.font = `700 28px ${font}`;
  spacedText(ctx, `Nº ${d.number}`, 1008, 140, 2, "right");

  /* ---------- foto em arco ---------- */
  const { x, y, w, h, r } = ARCH;
  // Arco coral deslocado, dando profundidade
  ctx.save();
  archPath(ctx, x + 26, y + 22, w, h, r);
  ctx.fillStyle = C.coral;
  ctx.fill();
  ctx.restore();
  // Contorno fino lilás deslocado para o outro lado
  ctx.save();
  archPath(ctx, x - 22, y - 18, w, h, r);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(224,200,240,.55)";
  ctx.stroke();
  ctx.restore();

  ctx.save();
  archPath(ctx, x, y, w, h, r);
  ctx.shadowColor = "rgba(20,5,40,.45)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = C.mist;
  ctx.fill();
  ctx.restore();

  ctx.save();
  archPath(ctx, x, y, w, h, r);
  ctx.clip();
  if (d.photo) {
    const f = clampFraming(d.photo, d.framing);
    const { dw, dh } = photoBox(d.photo, f.zoom);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(d.photo, x + (w - dw) / 2 + f.ox, y + (h - dh) / 2 + f.oy, dw, dh);
  } else {
    // Espaço reservado até a foto chegar
    const ph = ctx.createLinearGradient(0, y, 0, y + h);
    ph.addColorStop(0, C.mist);
    ph.addColorStop(1, C.lilac);
    ctx.fillStyle = ph;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "rgba(75,29,128,.22)";
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 330, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h + 40, 250, 260, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = C.violet;
    ctx.font = `700 34px ${font}`;
    ctx.textAlign = "center";
    ctx.fillText("Sua foto aqui", x + w / 2, y + 150);
  }
  ctx.restore();

  // Borda clara da moldura
  ctx.save();
  archPath(ctx, x, y, w, h, r);
  ctx.lineWidth = 10;
  ctx.strokeStyle = C.mist;
  ctx.stroke();
  ctx.restore();

  sparkle(ctx, 150, 300, 30, C.glow, 0.9);
  sparkle(ctx, 118, 372, 14, C.coralSoft, 0.8);
  sparkle(ctx, 935, 236, 22, "#fff", 0.85);
  sparkle(ctx, 960, 840, 34, C.coralSoft, 0.95);
  sparkle(ctx, 905, 900, 13, C.glow, 0.8);

  /* ---------- selo RECRUTADORA FUNDADORA ---------- */
  const pillY = y + h;
  ctx.font = `800 38px ${font}`;
  const label = "RECRUTADORA FUNDADORA";
  const lw = spacedWidth(ctx, label, 5);
  const pw = lw + 110;
  const ph = 92;
  ctx.save();
  roundRect(ctx, ART_W / 2 - pw / 2, pillY - ph / 2, pw, ph, ph / 2);
  ctx.shadowColor = "rgba(20,5,40,.35)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 10;
  const pg = ctx.createLinearGradient(ART_W / 2 - pw / 2, 0, ART_W / 2 + pw / 2, 0);
  pg.addColorStop(0, "#ef8a7f");
  pg.addColorStop(1, "#d95d52");
  ctx.fillStyle = pg;
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = "#fff";
  ctx.font = `800 38px ${font}`;
  spacedText(ctx, label, ART_W / 2, pillY + 14, 5, "center");

  /* ---------- nome, empresa e frase ---------- */
  ctx.textAlign = "center";
  const fit = fitName(ctx, d.name.trim() || "Recrutadora", font, 900);
  // Nome em 2 linhas: espaçamentos menores para tudo caber acima do rodapé
  const two = fit.lines.length > 1;
  const lineH = fit.size * (two ? 1.04 : 1.08);
  let ty = pillY + (two ? 58 : 72) + fit.size * 0.86;
  ctx.fillStyle = "#fff";
  ctx.font = `800 ${fit.size}px ${font}`;
  fit.lines.forEach((line, i) => {
    if (i) ty += lineH;
    ctx.fillText(line, ART_W / 2, ty);
  });

  if (d.company) {
    ty += two ? 42 : 50;
    ctx.fillStyle = C.glow;
    const company = fitText(ctx, d.company, 600, 30, 22, font, 860);
    ctx.fillText(company, ART_W / 2, ty);
  }

  // Frase entre aspas, com coração
  const quote = "“Eu faço parte do começo!”";
  ty += two ? (d.company ? 60 : 70) : d.company ? 72 : 82;
  ty = Math.min(ty, 1192); // nunca encosta na linha do rodapé (1226)
  ctx.font = `800 ${two ? 40 : 44}px ${font}`;
  ctx.fillStyle = C.coralSoft;
  const qw = ctx.measureText(quote).width;
  const heartGap = 44;
  ctx.textAlign = "left";
  const qx = ART_W / 2 - (qw + heartGap) / 2;
  ctx.fillText(quote, qx, ty);
  heart(ctx, qx + qw + heartGap - 14, ty - 16, 18, C.coral);

  /* ---------- rodapé ---------- */
  const fy = 1272;
  ctx.strokeStyle = "rgba(224,200,240,.28)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(72, fy - 46);
  ctx.lineTo(ART_W - 72, fy - 46);
  ctx.stroke();

  ctx.font = `600 26px ${font}`;
  ctx.fillStyle = C.glow;
  ctx.textAlign = "left";
  ctx.fillText(`Fundadora desde ${d.since}`, 72, fy);
  ctx.textAlign = "right";
  ctx.font = `800 28px ${font}`;
  ctx.fillStyle = "#fff";
  ctx.fillText("@bia.sua.jornada", ART_W - 72, fy);

  ctx.restore();
}

/** Converte um arraste na pré-visualização (px da tela) para a escala da arte. */
export const toArtScale = (canvas: HTMLCanvasElement) => ART_W / canvas.getBoundingClientRect().width;
