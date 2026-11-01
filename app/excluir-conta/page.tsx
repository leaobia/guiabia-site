import Link from "next/link";
import Footer from "@/components/Footer";
import { siteConfig } from "@/site.config";
import FormularioExclusao from "./FormularioExclusao";

export const metadata = {
  title: "Excluir conta – Guia BIA",
  description:
    "Como excluir a sua conta do Guia BIA e quais dados são apagados ou mantidos.",
};

const DESENVOLVEDORA = "BIANCA PEREIRA LEÃO";
const EMAIL = siteConfig.contactEmail;
const PRAZO = "30 dias";
const ASSINATURAS_PLAY = "https://play.google.com/store/account/subscriptions";

const h1Style = {
  fontSize: "clamp(2rem, 7vw, 2.8rem)",
  color: "var(--violet)",
} as const;
const h2Style = {
  marginTop: 40,
  marginBottom: 12,
  fontSize: "clamp(1.35rem, 4.5vw, 1.7rem)",
  maxWidth: "none",
} as const;
const avisoStyle = {
  background: "var(--deep)",
  color: "#fff",
  padding: 20,
  borderRadius: 20,
  marginTop: 32,
} as const;

export default function ExcluirConta() {
  return (
    <>
      <main
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "32px 16px 64px",
          lineHeight: 1.65,
        }}
      >
        <h1 style={h1Style}>Excluir conta – Guia BIA</h1>
        <p className="muted">
          Aplicativo Guia BIA, desenvolvido por {DESENVOLVEDORA}.
        </p>
        <p>
          Você pode pedir a exclusão da sua conta e dos dados associados a ela
          a qualquer momento, pelo aplicativo ou por esta página, sem precisar
          ter o app instalado.
        </p>

        <h2 style={h2Style}>Pelo aplicativo</h2>
        <ol>
          <li>Abra o Guia BIA e entre na sua conta.</li>
          <li>
            Vá em <strong>Configurações</strong>.
          </li>
          <li>
            Toque em <strong>Encerrar / Apagar Conta</strong>.
          </li>
          <li>Confirme digitando a sua senha.</li>
        </ol>
        <p>A exclusão pelo app é feita na hora.</p>

        <h2 style={h2Style}>Sem o aplicativo</h2>
        <p>
          Preencha o formulário com o e-mail da conta. O pedido vai para{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a> e é atendido em até{" "}
          <strong>{PRAZO}</strong>. Podemos responder pedindo uma confirmação,
          para garantir que o pedido foi feito pela titular da conta.
        </p>
        <FormularioExclusao emailDestino={EMAIL} prazo={PRAZO} />

        <h2 style={h2Style}>O que é apagado ou anonimizado</h2>
        <ul>
          <li>
            <strong>Perfil:</strong> nome, e-mail, senha, foto e demais dados
            do cadastro, incluindo dados sensíveis que você tenha informado.
          </li>
          <li>
            <strong>Currículos:</strong> todos os currículos cadastrados.
          </li>
          <li>
            <strong>Candidaturas:</strong> as candidaturas a vagas deixam de
            estar ligadas a você.
          </li>
          <li>
            <strong>Negócios:</strong> os negócios que você cadastrou saem do
            ar e são apagados.
          </li>
          <li>
            <strong>Mensagens do chat:</strong> as suas conversas e mensagens.
          </li>
          <li>
            <strong>Avaliações e publicações:</strong> as avaliações de
            anunciantes e as publicações na comunidade feitas por você.
          </li>
        </ul>

        <h2 style={h2Style}>O que é mantido, por quanto tempo e por quê</h2>
        <ul>
          <li>
            <strong>Registros de pagamento</strong> do Bia Pro (valor, data,
            status e identificador da transação): guardados por até{" "}
            <strong>5 anos</strong>, por obrigação legal e fiscal e para
            atender eventuais reembolsos ou contestações.
          </li>
          <li>
            <strong>Registro do pedido de exclusão</strong> (data e e-mail):
            guardado por até <strong>5 anos</strong>, para comprovar que o
            pedido foi atendido, conforme a LGPD.
          </li>
          <li>
            <strong>Dados anonimizados</strong>, que não permitem identificar
            você: podem ser mantidos sem prazo, para estatísticas.
          </li>
        </ul>
        <p>
          Terminado o prazo, esses dados também são apagados. Cópias de
          segurança são sobrescritas no ciclo normal, em até 90 dias.
        </p>

        <div style={avisoStyle}>
          <strong>Importante:</strong> excluir a conta <strong>não</strong>{" "}
          cancela a assinatura feita pelo Google Play. Para não ser cobrada de
          novo, cancele em{" "}
          <a
            href={ASSINATURAS_PLAY}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#fff" }}
          >
            play.google.com/store/account/subscriptions
          </a>
          .
        </div>

        <p style={{ marginTop: 32 }}>
          Para saber mais sobre como tratamos os seus dados, leia a{" "}
          <Link href="/privacidade">Política de Privacidade</Link>.
        </p>
      </main>
      <div className="wrap">
        <Footer />
      </div>
    </>
  );
}
