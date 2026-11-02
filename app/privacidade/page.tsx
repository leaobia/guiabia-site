import Link from "next/link";

export const metadata = { title: "Política de privacidade | Bia" };

const VERSAO = "1.2";
const ATUALIZADO_EM = "2 de novembro de 2026";
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
          concluídos, certificados, cupons resgatados, avaliações de
          anunciantes e os negócios que você cadastrar.
        </li>
        <li>
          <strong>Chat com a BIA:</strong> as mensagens que você envia e as
          respostas geradas (veja a seção 5).
        </li>
        <li>
          <strong>Localização:</strong> as coordenadas do aparelho, quando
          você permite, para mostrar negócios próximos (veja a seção 4).
        </li>
        <li>
          <strong>Assinaturas:</strong> os pagamentos são processados pelo
          Google Play e gerenciados pelo RevenueCat. O app recebe só o status
          da assinatura (plano, validade e se está ativa) e nunca tem acesso
          aos dados do seu cartão ou de outro meio de pagamento.
        </li>
        <li>
          <strong>Dados técnicos:</strong> informações do dispositivo e do
          acesso necessárias para o funcionamento e a segurança do aplicativo,
          como o identificador para envio de notificações.
        </li>
      </ul>

      <h2 style={h2Style}>3. Para que usamos os seus dados</h2>
      <ul>
        <li>Criar e manter a sua conta e permitir o acesso ao aplicativo.</li>
        <li>
          Oferecer trilhas, comunidade, cupons, o chat com a BIA, a vitrine de
          negócios e a conexão com vagas e empresas.
        </li>
        <li>Liberar e gerenciar os recursos da sua assinatura.</li>
        <li>Enviar notificações sobre a sua conta e o aplicativo.</li>
        <li>
          Garantir a segurança da plataforma e prevenir fraudes e abusos.
        </li>
        <li>Cumprir obrigações legais e atender solicitações das titulares.</li>
        <li>Comunicar mudanças importantes e responder ao seu contato.</li>
      </ul>
      <p>
        As bases legais usadas são, conforme o caso: execução do contrato (os
        Termos de Uso), cumprimento de obrigação legal, legítimo interesse
        (segurança e prevenção a fraudes) e consentimento (localização,
        notificações e comunicações opcionais).
      </p>

      <h2 style={h2Style}>4. Permissões do aparelho</h2>
      <p>
        O app só pede as permissões abaixo, e você pode negá-las ou
        revogá-las a qualquer momento nas configurações do aparelho:
      </p>
      <ul>
        <li>
          <strong>Localização:</strong> usada só com o app aberto, para
          mostrar negócios próximos. As coordenadas são enviadas ao nosso
          servidor no momento da busca.
        </li>
        <li>
          <strong>Notificações (push):</strong> para avisar sobre a sua conta,
          candidaturas, mensagens e novidades do app.
        </li>
        <li>
          <strong>Fotos e arquivos:</strong> o app acessa só os arquivos que
          você escolher, como a logo e a galeria do seu negócio e o seu
          currículo.
        </li>
        <li>
          <strong>Discador:</strong> usado só quando você toca para ligar para
          o 190, o 180 ou o seu contato de confiança.
        </li>
      </ul>
      <p>
        O app <strong>não</strong> usa a câmera, o microfone nem a agenda de
        contatos do aparelho.
      </p>

      <h2 style={h2Style}>5. Chat com a BIA (IA)</h2>
      <p>
        As mensagens do chat são enviadas ao Google (Gemini) apenas para gerar
        as respostas. O histórico fica guardado por até{" "}
        <strong>90 dias</strong> e é apagado quando você exclui a sua conta.
      </p>
      <p>
        <strong>Não envie dados sensíveis no chat</strong>, como documentos,
        senhas, dados bancários ou de saúde.
      </p>

      <h2 style={h2Style}>6. Com quem compartilhamos</h2>
      <ul>
        <li>
          <strong>Empresas e recrutadoras:</strong> quando você se candidata a
          uma vaga ou deixa o seu currículo visível, as informações
          necessárias ficam disponíveis para a empresa responsável pela vaga.
        </li>
        <li>
          <strong>Operadores</strong>, que tratam dados em nosso nome, sob
          contrato:
          <ul>
            <li>Google: Google Play (assinaturas) e Firebase/FCM (notificações);</li>
            <li>Expo: envio de notificações;</li>
            <li>RevenueCat: gerenciamento das assinaturas;</li>
            <li>Vercel: hospedagem;</li>
            <li>
              Supabase: banco de dados e armazenamento de fotos e currículos;
            </li>
            <li>Resend: envio de e-mails;</li>
            <li>Google AI (Gemini): respostas do chat com a BIA.</li>
          </ul>
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

      <h2 style={h2Style}>7. Transferência internacional de dados</h2>
      <p>
        Esses operadores podem processar dados fora do Brasil. Nesses casos, a
        transferência segue as salvaguardas previstas na LGPD, como cláusulas
        contratuais e a adoção de padrões adequados de proteção de dados.
      </p>

      <h2 style={h2Style}>8. Por quanto tempo guardamos os dados</h2>
      <p>
        Guardamos os dados enquanto a sua conta estiver ativa. Depois da
        exclusão da conta:
      </p>
      <ul>
        <li>
          <strong>registros de pagamento e assinatura:</strong> até 5 anos,
          por obrigação legal e fiscal e para atender reembolsos ou
          contestações;
        </li>
        <li>
          <strong>registro do pedido de exclusão</strong> (data e e-mail): até
          5 anos, para comprovar que o pedido foi atendido;
        </li>
        <li>
          <strong>cópias de segurança (backups):</strong> sobrescritas em até
          90 dias.
        </li>
      </ul>
      <p>
        O histórico do chat com a BIA é guardado por até 90 dias, mesmo com a
        conta ativa. Após esses prazos, os dados são apagados ou anonimizados.
      </p>

      <h2 style={h2Style}>9. Seus direitos</h2>
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

      <h2 style={h2Style}>10. Exclusão de conta</h2>
      <p>
        Você pode excluir a sua conta diretamente nas configurações do
        aplicativo. Ao excluir, removemos os seus dados pessoais, exceto as
        informações que a lei nos obriga a guardar, pelos prazos da seção 8.
        Excluir a conta não cancela a assinatura no Google Play.
      </p>
      <p>
        O passo a passo, o pedido de exclusão sem o aplicativo e a lista do
        que é apagado e do que é mantido estão na página{" "}
        <Link href="/excluir-conta">Excluir conta</Link>.
      </p>

      <h2 style={h2Style}>11. Segurança</h2>
      <p>
        Adotamos medidas técnicas e organizacionais para proteger os seus
        dados contra acesso não autorizado, perda e uso indevido. O seu
        contato de confiança fica salvo só no seu aparelho, e o modo discreto
        não envia nenhum dado ao nosso servidor.
      </p>
      <p>
        Nenhum sistema é totalmente seguro; por isso, mantenha a sua senha em
        sigilo e avise a gente se suspeitar de qualquer acesso indevido à sua
        conta.
      </p>

      <h2 style={h2Style}>12. Encarregada de proteção de dados (DPO)</h2>
      <p>
        A pessoa responsável por receber as suas solicitações e as
        comunicações da ANPD é {NOME_ENCARREGADA}. Contato:{" "}
        <a href={`mailto:${EMAIL_PRIVACIDADE}`}>{EMAIL_PRIVACIDADE}</a>.
      </p>

      <h2 style={h2Style}>13. Alterações nesta Política</h2>
      <p>
        Podemos atualizar esta Política periodicamente. Quando houver mudanças
        relevantes, avisaremos você pela plataforma e indicaremos a nova
        versão e a data no topo desta página.
      </p>
    </main>
  );
}
