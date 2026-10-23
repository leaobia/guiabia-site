import { siteConfig } from "@/site.config";

export default function Cta() {
  const items = [
    { label: "Baixar na Google Play", href: siteConfig.playStoreUrl },
    { label: "Baixar para Android (APK)", href: siteConfig.apkUrl },
  ].filter((i) => i.href);
  if (!items.length) return <p className="soon"><span aria-hidden />Disponível em breve para Android</p>;
  return (
    <div className="ctas">
      {items.map((i, n) => (
        <a key={i.label} className={n === 0 ? "btn" : "btn ghost"} href={i.href}>{i.label}</a>
      ))}
    </div>
  );
}
