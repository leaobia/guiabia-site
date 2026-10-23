import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const font = Manrope({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL("https://app.guiabia.com.br"),
  title: "Bia: um passo pequeno de cada vez",
  description: "Aplicativo de acolhimento, segurança, estudo, trabalho e rede de apoio para mulheres.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={font.variable}>
      <body>{children}</body>
    </html>
  );
}
