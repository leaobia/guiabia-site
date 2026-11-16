import Link from "next/link";
 
export const metadata = { title: "Termos de uso | Bia" };
 
const VERSAO = "1.3";
const ATUALIZADO_EM = "16 de novembro de 2026";
const DESENVOLVEDORA = "BIANCA PEREIRA LEÃO";
const EMAIL_SUPORTE = "bia.comunidade.feminina@gmail.com";
const ASSINATURAS_PLAY = "https://play.google.com/store/account/subscriptions";

const h2Style = { marginTop: 32, marginBottom: 8 } as const;
 
export default function Termos() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "32px 16px 64px",
        lineHeight: 1.65,
      }}
    >
      <h1>Termos de uso</h1>
      <p>
        Versão {VERSAO}. Última atualização: {ATUALIZADO_EM}.
      </p>
 
      <p>
        Bem-vinda aos Termos de Uso da plataforma Bia. Estes Termos regulam o
        acesso e a utilização do nosso aplicativo, dos conteúdos, das trilhas
        de conhecimento, da área de comunidade e dos serviços relacionados. O
        aplicativo Guia BIA é desenvolvido e oferecido por {DESENVOLVEDORA}.
      </p>
      <p>
        Ao acessar ou utilizar o aplicativo, você concorda com os termos
        abaixo. Se não concordar com qualquer parte deles, deve interromper o
        uso da plataforma.
      </p>
 
      <h2 style={h2Style}>1. Cadastro e elegibilidade</h2>
      <p>
        1.1. Algumas funcionalidades, como acessar a comunidade, guardar o
        progresso nas trilhas de conhecimento, resgatar cupons de desconto,
        contratar um plano pago ou interagir como anunciante ou recrutadora,
        exigem cadastro com informações verdadeiras, completas e atualizadas.
      </p>
      <p>
        1.2. Você é responsável por manter a confidencialidade das suas
        credenciais de acesso (e-mail e senha) e por todas as atividades
        realizadas na sua conta.
      </p>
      <p>
        1.3. A plataforma pode recusar cadastros, suspender ou encerrar
        contas que tenham informações falsas ou que violem as regras de boa
        convivência.
      </p>
      <p>
        1.4. Idade mínima: o Bia é destinado a pessoas com 18 anos ou mais. Ao
        criar a conta, você declara ter pelo menos 18 anos.
      </p>
 
      <h2 style={h2Style}>2. Descrição dos serviços</h2>
      <p>O Bia oferece um ecossistema digital voltado ao desenvolvimento profissional e pessoal, que inclui:</p>
      <ul>
        <li>
          <strong>Trilhas de conhecimento:</strong> conteúdos educacionais
          organizados em módulos e aulas.
        </li>
        <li>
          <strong>Chat com a BIA:</strong> assistente com inteligência
          artificial.
        </li>
        <li>
          <strong>Comunidade e interação:</strong> espaço para troca de
          experiências entre usuárias.
        </li>
        <li>
          <strong>Vitrine de cupons:</strong> códigos de desconto e benefícios
          de marcas parceiras.
        </li>
        <li>
          <strong>Perfis especializados:</strong> funcionalidades para
          membras, anunciantes e recrutadoras.
        </li>
        <li>
          <strong>Vagas:</strong> publicação de vagas por recrutadoras e
          candidatura pelas usuárias.
        </li>
        <li>
          <strong>Central de segurança:</strong> atalhos para o 190, o Ligue
          180 e um contato de confiança.
        </li>
        <li>
          <strong>Planos pagos:</strong> Bia Basic e Bia Pro, com recursos
          adicionais, descritos na seção 3.
        </li>
      </ul>
      <p>
        2.1. Avisos importantes: as respostas da BIA são geradas por
        inteligência artificial e podem conter erros. Elas não substituem
        orientação jurídica, médica, psicológica ou profissional. A Central de
        segurança apenas facilita o contato: o Bia não é um serviço de
        emergência e não acompanha chamadas. Em situação de perigo, ligue 190
        (Polícia) ou 180 (Central de Atendimento à Mulher).
      </p>

      <h2 style={h2Style}>3. Planos e pagamentos</h2>
      <p>
        3.1. O Bia oferece funcionalidades gratuitas e os planos pagos abaixo.
      </p>
      <ul>
        <li>
          <strong>Bia Basic</strong> (R$ 19,99/mês): até 200 mensagens por
          mês no chat da BIA, até 5 currículos salvos e candidaturas
          ilimitadas.
        </li>
        <li>
          <strong>Bia Pro</strong> (R$ 29,90/mês ou R$ 219,99/ano): até 500
          mensagens por mês no chat da BIA, currículos ilimitados, vagas
          ilimitadas como recrutadora e 1 empreendimento na vitrine com até 18
          fotos.
        </li>
      </ul>
      <p>3.2. Os planos podem ser contratados de duas formas:</p>
      <ul>
        <li>
          <strong>Pelo aplicativo:</strong> o pagamento é feito pela sua conta
          Google, via Google Play. O preço final é o exibido no Google Play no
          momento da contratação.
        </li>
        <li>
          <strong>Pelo site</strong> (Portal da Recrutadora, em{" "}
          <Link href="/recrutadora">app.guiabia.com.br/recrutadora</Link>):
          apenas o Bia Pro, com cartão de crédito, processado pelo Mercado
          Pago. O plano mensal custa R$ 29,90 por mês e o anual custa R$ 219,99,
          cobrados de uma só vez por ano. Os dados do cartão são digitados no
          formulário seguro do Mercado Pago e não são recebidos nem guardados
          pelo Bia.
        </li>
      </ul>
      <p>
        3.3. O acesso ao plano é liberado após a confirmação do pagamento pelo
        Google Play ou pelo Mercado Pago. No site, a confirmação pode levar
        alguns minutos.
      </p>
      <p>
        3.4. A assinatura é renovada automaticamente ao fim de cada período
        (mensal ou anual), com nova cobrança no mesmo meio de pagamento (conta
        Google ou cartão de crédito), até que você a cancele. Se a cobrança da
        renovação no cartão for recusada, o Mercado Pago tenta cobrar de novo;
        se nenhuma tentativa for aprovada, o acesso ao plano é encerrado.
      </p>
      <p>
        3.5. Ao ativar o perfil de recrutadora, você ganha 30 dias grátis para
        publicar vagas. O teste grátis não vira assinatura automaticamente: ao
        fim dele, nada é cobrado. Se você assinar o Bia Pro durante o teste, a
        cobrança começa na data da assinatura.
      </p>
      <p>
        3.6. Cursos pagos são comprados avulsos pelo Google Play, com acesso
        vitalício enquanto a conta existir. Reembolso aprovado remove o acesso
        ao curso. Cursos concluídos geram certificado com código de validação.
      </p>
      <p>
        3.7. Acesso gratuito para parceiras: o Bia pode conceder, a seu
        critério, acesso gratuito ao Bia Basic ou ao Bia Pro a parceiras e
        testadoras. Esse acesso não gera cobrança e pode ser encerrado a
        qualquer momento, com aviso prévio.
      </p>
      <p>
        3.8. Mudança de preço: se o preço de um plano mudar, avisaremos com
        pelo menos 30 dias de antecedência. O novo valor só vale a partir da
        renovação seguinte ao aviso, e você pode cancelar antes dela sem custo.
      </p>

      <h2 id="reembolso" style={h2Style}>
        4. Cancelamento e reembolso
      </h2>
      <p>
        4.1. <strong>Assinatura pelo aplicativo:</strong> você pode cancelar a
        qualquer momento no Google Play, em{" "}
        <a href={ASSINATURAS_PLAY} target="_blank" rel="noopener noreferrer">
          play.google.com/store/account/subscriptions
        </a>
        , ou pelo botão &quot;Gerenciar ou cancelar assinatura&quot; no
        aplicativo.
      </p>
      <p>
        4.2. <strong>Assinatura pelo site:</strong> você pode cancelar a
        qualquer momento no Portal da Recrutadora, em Assinatura, no botão
        &quot;Cancelar renovação&quot;.
      </p>
      <p>
        4.3. Nos dois casos, o cancelamento interrompe a renovação e não há
        novas cobranças. O acesso ao plano continua até o fim do período já
        pago; no site, essa data aparece na tela de Assinatura.
      </p>
      <p>
        4.4. Ao excluir a sua conta, a assinatura feita pelo site é cancelada
        automaticamente. Já a assinatura do Google Play <strong>não</strong> é
        cancelada com a exclusão da conta: cancele-a antes, para não ser
        cobrada de novo.
      </p>
      <p>
        4.5. Conforme o Código de Defesa do Consumidor, você pode desistir da
        contratação em até 7 (sete) dias corridos após o pagamento e receber o
        valor integral de volta.
      </p>
      <p>
        4.6. O pedido de reembolso pode ser feito pelo e-mail{" "}
        <a href={`mailto:${EMAIL_SUPORTE}`}>{EMAIL_SUPORTE}</a>, informando o
        e-mail cadastrado e a data do pagamento. Compras pelo aplicativo também
        podem ser reembolsadas pelo Google Play. O estorno é feito no mesmo
        meio de pagamento usado na compra: pelo Google, nas compras do
        aplicativo, e pelo Mercado Pago, no cartão de crédito, nas assinaturas
        do site. O prazo para o valor aparecer na fatura depende da operadora
        do cartão.
      </p>
      <p>
        4.7. Com o reembolso, o acesso ao plano é encerrado.
      </p>
      <p>
        4.8. Contestação no cartão: se uma cobrança for contestada junto ao
        banco ou à operadora do cartão (chargeback), o acesso ao plano pode ser
        suspenso até a contestação ser resolvida.
      </p>
 
      <h2 style={h2Style}>5. Regras de conduta na comunidade e nas avaliações</h2>
      <p>
        5.1. Queremos um ambiente seguro, colaborativo e respeitoso. Ao usar
        a comunidade ou o sistema de avaliações de anunciantes, é proibido:
      </p>
      <ul>
        <li>
          publicar conteúdo ofensivo, de ódio, preconceituoso, difamatório ou
          que viole direitos de terceiros;
        </li>
        <li>enviar spam, correntes ou publicidade não autorizada;</li>
        <li>
          fazer avaliações falsas, fraudulentas ou mal-intencionadas nas
          páginas de anunciantes.
        </li>
      </ul>
      <p>
        5.2. As avaliações de anunciantes podem ser anônimas quando você
        escolher essa opção. Nesse caso, sua identidade fica protegida no
        sistema interno, para fins de segurança e prevenção de fraudes.
      </p>

      <h2 style={h2Style}>5A. Regras para recrutadoras</h2>
      <p>
        5A.1. As vagas devem ser reais, com informações verdadeiras sobre a
        empresa, a função e as condições de trabalho.
      </p>
      <p>
        5A.2. É proibido cobrar qualquer valor das candidatas, pedir documentos
        desnecessários antes da contratação ou publicar vagas com
        discriminação ilegal. Vagas afirmativas (como para mães, mulheres 50+
        ou pessoas com deficiência) são permitidas.
      </p>
      <p>
        5A.3. A recrutadora é responsável, como controladora, pelos dados
        pessoais das candidatas que recebe. Ela deve usá-los só para o processo
        seletivo e tratá-los conforme a LGPD.
      </p>
      <p>
        5A.4. O Bia pode remover vagas e suspender perfis de recrutadoras que
        violem estas regras.
      </p>
 
      <h2 style={h2Style}>6. Cupons de desconto e links de afiliados</h2>
      <p>
        6.1. A plataforma disponibiliza uma vitrine de cupons e vantagens de
        marcas parceiras. Alguns links podem usar programas de afiliação, o
        que significa que podemos receber uma comissão por compras feitas
        através deles, sem custo adicional para você.
      </p>
      <p>
        6.2. Não nos responsabilizamos pela validade dos cupons, pela entrega
        de produtos, pelas políticas de troca, pela qualidade dos serviços das
        marcas parceiras nem por alterações de preço feitas por lojas
        externas. Problemas com compras devem ser resolvidos diretamente com a
        loja parceira.
      </p>
 
      <h2 style={h2Style}>7. Propriedade intelectual</h2>
      <p>
        7.1. Todo o conteúdo da plataforma (textos, gráficos, logotipos,
        ícones, códigos-fonte, estrutura das trilhas de conhecimento e
        vídeos) pertence ao Bia ou é licenciado para nós, e é protegido pelas
        leis de direitos autorais e de propriedade intelectual.
      </p>
      <p>
        7.2. É proibido reproduzir, distribuir ou modificar qualquer conteúdo
        da plataforma sem autorização prévia por escrito.
      </p>
 
      <h2 style={h2Style}>8. Privacidade e tratamento de dados</h2>
      <p>
        O tratamento dos seus dados pessoais é regido pela nossa{" "}
        <Link href="/privacidade">Política de Privacidade</Link>, em
        conformidade com a Lei Geral de Proteção de Dados (LGPD). Ao aceitar
        estes Termos, você declara que leu e entendeu a Política de
        Privacidade.
      </p>
 
      <h2 style={h2Style}>9. Modificações dos Termos</h2>
      <p>
        Podemos atualizar estes Termos periodicamente para refletir melhorias
        no aplicativo ou mudanças legais. Quando houver alterações
        significativas, avisaremos você pela própria plataforma e poderemos
        pedir um novo aceite. O uso continuado após as alterações indica
        concordância com os novos termos.
      </p>
 
      <h2 style={h2Style}>10. Encerramento e exclusão de conta</h2>
      <p>
        10.1. Você pode solicitar a exclusão da sua conta e dos seus dados
        diretamente nas configurações do aplicativo ou pela página{" "}
        <Link href="/excluir-conta">Excluir conta</Link>. A exclusão da conta
        cancela a assinatura feita pelo site, mas não a do Google Play (veja o
        item 4.4).
      </p>
      <p>
        10.2. Podemos suspender o acesso de qualquer usuária que viole estes
        Termos de Uso.
      </p>
 
      <h2 style={h2Style}>11. Lei aplicável e foro</h2>
      <p>
        Estes Termos são regidos pelas leis da República Federativa do Brasil.
        Fica eleito o foro do domicílio da usuária para resolver eventuais
        conflitos.
      </p>
 
      <h2 style={h2Style}>12. Contato</h2>
      <p>
        Em caso de dúvidas sobre estes Termos de Uso, fale com a gente pelo
        e-mail <a href={`mailto:${EMAIL_SUPORTE}`}>{EMAIL_SUPORTE}</a>.
      </p>
    </main>
  );
}