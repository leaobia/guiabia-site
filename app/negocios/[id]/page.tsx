import type { Metadata } from "next";
import Avatar from "@/components/Avatar";
import Footer from "@/components/Footer";

type Props = { params: Promise<{ id: string }> };

async function getBusiness(id: string) {
  try {
    const res = await fetch(
      `https://api.guiabia.com.br/api/v1/businesses/${encodeURIComponent(id)}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.business || data.data || data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const business = await getBusiness(id);

  if (!business?.name) {
    return {
      title: "Empreendimento no app Bia",
      description: "Abra este link no celular com o app Bia instalado.",
      robots: { index: false },
    };
  }

  const title = `${business.name} | Guia BIA`;
  const description =
    business.description ||
    `Conheça ${business.name} no Guia BIA, comunidade de apoio e empreendedorismo feminino.`;
  const image =
    business.coverImageUrl ||
    business.logoUrl ||
    "https://guiabia.com.br/og-default-bia.png";

  return {
    title,
    description,
    robots: { index: false },
    openGraph: {
      title,
      description,
      url: `https://app.guiabia.com.br/negocios/${id}`,
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
            {business?.name
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