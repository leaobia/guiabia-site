"use client";

import { siteConfig } from "@/site.config";

const INSTAGRAM_URL = "https://www.instagram.com/bia.sua.jornada";

type FooterLink = { label: string; href?: string };

function InstagramIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  const links: FooterLink[] = [
    { label: "Política de privacidade", href: siteConfig.privacyUrl },
    { label: "Termos de uso", href: siteConfig.termsUrl },
    {
      label: siteConfig.contactEmail ?? "",
      href: siteConfig.contactEmail ? `mailto:${siteConfig.contactEmail}` : undefined,
    },
  ];
  const visiveis = links.filter((l): l is { label: string; href: string } => Boolean(l.href));

  const voltarAoTopo = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="foot">
      <nav className="foot-links" aria-label="Links do rodapé">
        {visiveis.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
          >
            {l.label}
          </a>
        ))}
        <a
          className="foot-social"
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram da Bia"
        >
          <InstagramIcon />
        </a>
      </nav>

      <button type="button" className="foot-top" onClick={voltarAoTopo}>
        Voltar ao topo
      </button>

      <span className="foot-copy">© {new Date().getFullYear()} Bia</span>
    </footer>
  );
}