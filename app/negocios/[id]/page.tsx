import type { Metadata } from "next";
import Avatar from "@/components/Avatar";
import Footer from "@/components/Footer";

type Props = { params: Promise<{ id: string }> };

type Business = {
  name: string;
  description?: string;
  coverImageUrl?: string;
  logoUrl?: string;
};

const API_URL =
  process.env.API_URL ?? "https://bia-back-end-mu.vercel.app/api/v1";
const DEFAULT_IMAGE = "https://guiabia.com.br/og-default-bia.png";

const isAbsoluteUrl = (url?: string) => !!url && /^https?:\/\//i.test(url);

async function getBusiness(id: string): Promise<Business | null> {
  try {
    const res = await fetch(`${API_URL}/businesses/${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
      // evita a página (e o robô do WhatsApp) ficar esperando se a API demorar
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const business = data?.business ?? data?.data ?? data;
    return business && typeof business.name === "string" ? business : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const business = await getBusiness(id);

  if (!business) {
    return {
      title: "Empreendimento no app Bia",
      description: "Abra este link no celular com o app Bia instalado.",
      robots: { index: false },
    };
  }

  const title = `${business.name} | Guia BIA`;
  const description = (
    business.description?.trim() ||
    `Conheça ${business.name} no Guia BIA, comunidade de apoio e empreendedorismo feminino.`
  ).slice(0, 160);

  const candidate = business.coverImageUrl || business.logoUrl;
  const image = isAbsoluteUrl(candidate) ? (candidate as string) : DEFAULT_IMAGE;

  return {
    title,
    description,
    robots: { index: false },
    openGraph: {
      title,
      description,
      url: `https://app.guiabia.com.br/negocios/${encodeURIComponent(id)}`,
      siteName: "Guia BIA",
      images: [{ url: image, width: 1200, height: 630, alt: business.name }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function Negocio({ params }: Props) {
  const { id } = await params;
  const business = await getBusiness(id); // o Next reaproveita o fetch do generateMetadata
  const appLink = `bia://negocios/${encodeURIComponent(id)}`;

  return (
    <main>
      <div className="final" style={{ minHeight: "80vh", display: "grid", alignItems: "center" }}>
        <div className="wrap">
          <Avatar size={150} state="greeting" float />
          <h2>
            {business
              ? `${business.name} está no app Bia.`
              : "Esse empreendimento está no app Bia."}
          </h2>
          <p style={{ margin: 0, color: "var(--glow)", maxWidth: "40ch" }}>
            Se o app estiver instalado neste celular, toque no botão para ver produtos, contatos e solicitar agendamento.
          </p>
          <a className="btn" href={appLink}>Abrir no app Bia</a>
          <p style={{ margin: 0, color: "var(--glow)", maxWidth: "40ch", fontSize: ".95rem" }}>
            Sem o app instalado, não é possível ver o empreendimento por aqui.
          </p>
        </div>
      </div>
      <div className="wrap"><Footer /></div>
    </main>
  );
}