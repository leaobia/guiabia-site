import type { Metadata } from "next";
import PortalProvider from "./PortalProvider";
import "./portal.css";

export const metadata: Metadata = {
  title: "Portal da Recrutadora | Guia BIA",
  description: "Publique vagas para mulheres e acompanhe as candidatas no Guia BIA.",
  robots: { index: false },
};

export default function RecrutadoraLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rp">
      <PortalProvider>{children}</PortalProvider>
    </div>
  );
}
