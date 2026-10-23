import type { Metadata } from "next";
import Avatar from "@/components/Avatar";
import Footer from "@/components/Footer";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Vaga compartilhada no app Bia",
    description: "Abra este link no celular com o app Bia instalado para ver a vaga.",
    robots: { index: false },
  };
}

export default async function Vaga({ params }: Props) {
  const { id } = await params;
  const appLink = `bia://vagas/${encodeURIComponent(id)}`;
  return (
    <main>
      <div className="final" style={{ minHeight: "80vh", display: "grid", alignItems: "center" }}>
        <div className="wrap">
          <Avatar size={150} state="greeting" float />
          <h2>Essa vaga está no app Bia.</h2>
          <p style={{ margin: 0, color: "var(--glow)", maxWidth: "40ch" }}>Se o app estiver instalado neste celular, toque no botão para abrir a vaga.</p>
          <a className="btn" href={appLink}>Abrir no app Bia</a>
          <p style={{ margin: 0, color: "var(--glow)", maxWidth: "40ch", fontSize: ".95rem" }}>Sem o app instalado, não é possível ver a vaga por aqui.</p>
        </div>
      </div>
      <div className="wrap"><Footer /></div>
    </main>
  );
}
