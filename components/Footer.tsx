import { siteConfig } from "@/site.config";

export default function Footer() {
  const links = [
    { label: "Política de privacidade", href: siteConfig.privacyUrl },
    { label: "Termos de uso", href: siteConfig.termsUrl },
    { label: siteConfig.contactEmail, href: siteConfig.contactEmail && `mailto:${siteConfig.contactEmail}` },
  ].filter((l) => l.href);
  return (
    <footer className="foot">
      <span>© {new Date().getFullYear()} Bia</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{l.label}</a>
      ))}
    </footer>
  );
}
