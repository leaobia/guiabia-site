import Link from "next/link";

export const metadata = { title: "Política de privacidade | Bia" };

const VERSAO = "1.0";
const ATUALIZADO_EM = "25 de outubro de 2026";
const CONTROLADORA = "BIANCA PEREIRA LEÃO";
const EMAIL_PRIVACIDADE = "bia.comunidade.feminina@gmail.com";
const NOME_ENCARREGADA = "BIANCA PEREIRA LEÃO";

const h2Style = { marginTop: 32, marginBottom: 8 } as const;

export default function Privacidade() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "32px 16px 64px",
        lineHeight: 1.65,
      }}
    >
      <h1>Política de privacidade</h1>
      <p>
        Versão {VERSAO}. Última atualização: {ATUALIZADO_EM}.
      </p>

      <p>
        Esta Política explica como o Bia coleta, usa, compartilha e protege os
        seus dados pessoais, em conformidade com a Lei Geral de Proteção de
        Dados (Lei nº 13.709/2018, a LGPD). Ela vale para o aplicativo e para
        o site do Bia, e deve ser lida junto com os{" "}
        <Link href="/termo">Termos de Uso</Link>.
      </p>

      <h2 style={h2Style}>1. Quem é responsável pelos seus dados</h2>
      <p>
        A controladora dos dados pessoais é {CONTROLADORA}. Para falar sobre
        privacidade, use o e-mail{" "}
        <a href={`mailto:${EMAIL_PRIVACIDADE}`}>{EMAIL_PRIVACIDADE}</a>.
      </p>

      <h2 style={h2Style}>2. Dados que coletamos</h2>
      <ul>
        <li>
          <strong>Cadastro:</strong> nome, e-mail, senha (armazenada de forma
          protegida) e as demais informações que você informar no perfil.
        </li>
        <li>
          <strong>Currículo e candidaturas:</strong> experiências, formação,
          habilidades e as vagas para as quais você se candidatar.
        </li>
        <li>
          <strong>Uso da plataforma:</strong> progresso nas trilhas, cursos
          concluídos, certificados, cupons resgatados, publicações na
          comunidade e avaliações de anunciantes.
        </li>
        <li>
          <strong>Pagamentos:</strong> dados do pagamento do Bia Pro (valor,
          data, status e identificador da transação). Não armazenamos dados
          bancários nem chaves PIX.
        </li>
        <li>
          <strong>Dados técnicos:</strong> informações do dispositivo e do
          acesso necessárias para o funcionamento e a segurança do aplicativo.
        </li>
      </ul>

      <h2 style={h2Style}>3. Dados sensíveis</h2>
      <p>
        Algumas informações que você pode escolher fornecer, como raça ou cor,
        deficiência (PCD) e maternidade, são dados pessoais sensíveis pela
        LGPD. Elas são sempre <strong>voluntárias</strong>: você pode usar o
        Bia sem informá-las. Só tratamos esses dados com o seu consentimento
        específico e destacado, e apenas para a finalidade informada no
        momento da coleta, como a inclusão em processos seletivos e vagas
        afirmativas. Você pode retirar o consentimento a qualquer momento,
        nas configurações do app ou pelo e-mail de privacidade.
      </p>

      <h2 style={h2Style}>4. Para que usamos os seus dados</h2>
      <ul>
        <li>Criar e manter a sua conta e permitir o acesso ao aplicativo.</li>
        <li>
          Oferecer trilhas, comunidade, cupons e a conexão com vagas e
          empresas.
        </li>
        <li>Processar pagamentos e reembolsos do Bia Pro.</li>
        <li>
          Garantir a segurança da plataforma e prevenir fraudes e abusos.
        </li>
        <li>Cumprir obrigações legais e atender solicitações das titulares.</li>
        <li>Comunicar mudanças importantes e responder ao seu contato.</li>
      </ul>
      <p>
        As bases legais usadas são, conforme o caso: execução do contrato (os
        Termos de Uso), cumprimento de obrigação legal, legítimo interesse
        (segurança e prevenção a fraudes) e consentimento (dados sensíveis e
        comunicações opcionais).
      </p>

      <h2 style={h2Style}>5. Com quem compartilhamos</h2>
      <ul>
        <li>
          <strong>Empresas e recrutadoras:</strong> quando você se candidata a
          uma vaga ou deixa o seu currículo visível, as informações
          necessárias ficam disponíveis para a empresa responsável pela vaga.
        </li>
        <li>
          <strong>Processadora de pagamentos (Mercado Pago):</strong> para
          gerar o PIX e processar devoluções.
        </li>
        <li>
          <strong>Serviços de tecnologia:</strong> provedores de hospedagem e
          infraestrutura que armazenam e processam os dados em nosso nome, sob
          contrato.
        </li>
        <li>
          <strong>Autoridades:</strong> quando houver obrigação legal ou
          ordem judicial.
        </li>
      </ul>
      <p>
        Não vendemos os seus dados pessoais. Nas avaliações anônimas de
        anunciantes, a sua identidade não é exibida publicamente.
      </p>

      <h2 style={h2Style}>6. Por quanto tempo guardamos os dados</h2>
      <p>
        Guardamos os dados enquanto a sua conta estiver ativa e, depois, pelo
        tempo necessário para cumprir obrigações legais (como registros de
        pagamento), exercer direitos em processos e prevenir fraudes. Após
        esse período, os dados são apagados ou anonimizados.
      </p>

      <h2 style={h2Style}>7. Seus direitos</h2>
      <p>Você pode pedir, a qualquer momento:</p>
      <ul>
        <li>confirmação de que tratamos seus dados e acesso a eles;</li>
        <li>correção de dados incompletos ou desatualizados;</li>
        <li>
          anonimização, bloqueio ou eliminação de dados desnecessários ou
          tratados fora da lei;
        </li>
        <li>
          portabilidade: uma cópia dos seus dados em formato legível (dados
          cadastrais, cursos, certificados e candidaturas);
        </li>
        <li>eliminação dos dados tratados com base no seu consentimento;</li>
        <li>informações sobre com quem compartilhamos os seus dados;</li>
        <li>revogação do consentimento.</li>
      </ul>
      <p>
        Para exercer esses direitos, escreva para{" "}
        <a href={`mailto:${EMAIL_PRIVACIDADE}`}>{EMAIL_PRIVACIDADE}</a>.
        Respondemos em até 15 dias. Você também pode reclamar à Autoridade
        Nacional de Proteção de Dados (ANPD).
      </p>

      <h2 style={h2Style}>8. Exclusão de conta</h2>
      <p>
        Você pode excluir a sua conta diretamente nas configurações do
        aplicativo. Ao excluir, removemos os seus dados pessoais. Podemos
        manter um registro anônimo (que não permite identificar você) e as
        informações que a lei nos obriga a guardar, como os registros de
        pagamento.
      </p>

      <h2 style={h2Style}>9. Segurança</h2>
      <p>
        Adotamos medidas técnicas e organizacionais para proteger os seus
        dados contra acesso não autorizado, perda e uso indevido. Nenhum
        sistema é totalmente seguro; por isso, mantenha a sua senha em sigilo
        e avise a gente se suspeitar de qualquer acesso indevido à sua conta.
      </p>

      <h2 style={h2Style}>10. Crianças e adolescentes</h2>
      <p>
        O Bia é destinado a maiores de 18 anos. Se identificarmos dados de
        menores sem a autorização de um responsável legal, eles serão
        excluídos.
      </p>

      <h2 style={h2Style}>11. Encarregada de proteção de dados (DPO)</h2>
      <p>
        A pessoa responsável por receber as suas solicitações e as
        comunicações da ANPD é {NOME_ENCARREGADA}. Contato:{" "}
        <a href={`mailto:${EMAIL_PRIVACIDADE}`}>{EMAIL_PRIVACIDADE}</a>.
      </p>

      <h2 style={h2Style}>12. Alterações nesta Política</h2>
      <p>
        Podemos atualizar esta Política periodicamente. Quando houver mudanças
        relevantes, avisaremos você pela plataforma e indicaremos a nova
        versão e a data no topo desta página.
      </p>
    </main>
  );
}