import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {

    const res = await fetch(`https://api.guiabia.com.br/api/v1/businesses/${id}`, {
      next: { revalidate: 60 }, 
    });

    if (res.ok) {
      const data = await res.json();
      const business = data.business || data.data || data;

      const title = `${business.name} | Guia BIA`;
      const description =
        business.description ||
        `Conheça ${business.name} no Guia BIA, comunidade de apoio e empreendedorismo feminino.`;
      const image =
        business.coverImageUrl ||
        business.logoUrl ||
        'https://guiabia.com.br/og-default-bia.png';

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://app.guiabia.com.br/negocios/${id}`,
          siteName: 'Guia BIA',
          images: [{ url: image, width: 1200, height: 630, alt: business.name }],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [image],
        },
      };
    }
  } catch {
    
  }

  return {
    title: 'Empreendimento no Guia BIA',
    description: 'Abra este link no celular com o app Guia BIA instalado.',
  };
}

export default async function NegocioPage({ params }: Props) {
  const { id } = await params;
  const appDeepLink = `bia://negocios/${encodeURIComponent(id)}`;

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', background: '#faf5ff', padding: '24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '420px', background: '#ffffff', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #f3e8ff' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#4b1d80', margin: '0 0 12px' }}>
          Empreendimento no Guia BIA
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', margin: '0 0 24px' }}>
          Para visualizar os produtos, contatos e solicitar agendamento, abra no aplicativo oficial:
        </p>

        <a
          href={appDeepLink}
          style={{ display: 'block', backgroundColor: '#4b1d80', color: '#ffffff', fontWeight: '700', padding: '14px 20px', borderRadius: '14px', textDecoration: 'none', marginBottom: '12px' }}
        >
          Abrir no App BIA
        </a>

        <a
          href="https://guiabia.com.br"
          style={{ display: 'block', border: '1px solid #d1d5db', color: '#374151', fontWeight: '600', padding: '12px 20px', borderRadius: '14px', textDecoration: 'none', fontSize: '13px' }}
        >
          Ainda não tem o app? Baixar agora
        </a>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
              window.location.href = "${appDeepLink}";
            }
          `,
        }}
      />
    </main>
  );
}