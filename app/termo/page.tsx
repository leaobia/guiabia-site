import Link from "next/link";
 
export const metadata = { title: "Termos de uso | Bia" };
 
const VERSAO = "1.0";
const ATUALIZADO_EM = "25 de outubro de 2026";
const EMAIL_SUPORTE = "bia.comunidade.feminina@gmail.com";
const PRAZO_ESTORNO = "7 dias úteis";
const BENEFICIOS_PRO = "acesso a 500 mensagens no ChatBia e recurso de 5 currículos enviados";
 
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
        de conhecimento, da área de comunidade e dos serviços relacionados.
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
        contratar o Bia Pro ou interagir como anunciante ou recrutadora,
        exigem cadastro com informações verdadeiras, completas e atualizadas.
      </p>
      <p>
        1.2. O uso do aplicativo é destinado a maiores de 18 anos. Menores de
        idade só podem usar a plataforma com autorização e acompanhamento de
        um responsável legal.
      </p>
      <p>
        1.3. Você é responsável por manter a confidencialidade das suas
        credenciais de acesso (e-mail e senha) e por todas as atividades
        realizadas na sua conta.
      </p>
      <p>
        1.4. A plataforma pode recusar cadastros, suspender ou encerrar
        contas que tenham informações falsas ou que violem as regras de boa
        convivência.
      </p>
 
      <h2 style={h2Style}>2. Descrição dos serviços</h2>
      <p>O Bia oferece um ecossistema digital voltado ao desenvolvimento profissional e pessoal, que inclui:</p>
      <ul>
        <li>
          <strong>Trilhas de conhecimento:</strong> conteúdos educacionais
          organizados em módulos e aulas.
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
          <strong>Bia Pro:</strong> plano pago com recursos adicionais,
          descrito na seção 3.
        </li>
      </ul>
 
      <h2 style={h2Style}>3. Bia Pro e pagamentos</h2>
      <p>
        3.1. O Bia oferece funcionalidades gratuitas e um plano pago, o Bia
        Pro, que dá acesso a: {BENEFICIOS_PRO}.
      </p>
      <p>
        3.2. O valor, a duração do plano e a forma de pagamento (PIX) são
        informados na tela de contratação, antes da confirmação do pagamento.
      </p>
      <p>
        3.3. O acesso ao Bia Pro é liberado após a confirmação do pagamento.
      </p>
      <p>
        3.4. O plano não é renovado automaticamente. Ao fim do período
        contratado, você decide se quer contratar novamente.
      </p>
 
      <h2 id="reembolso" style={h2Style}>
        4. Cancelamento e reembolso
      </h2>
      <p>
        4.1. Você pode desistir da contratação dos planos Bia em até 7 (sete) dias
        corridos após o pagamento e receber o valor integral de volta.
      </p>
      <p>
        4.2. Para isso, envie um e-mail para{" "}
        <a href={`mailto:${EMAIL_SUPORTE}`}>{EMAIL_SUPORTE}</a> informando o
        e-mail cadastrado no aplicativo e a data do pagamento.
      </p>
      <p>
        4.3. O reembolso é feito via PIX, para a mesma conta que realizou o
        pagamento, em até {PRAZO_ESTORNO} após o pedido.
      </p>
      <p>
        4.4. Com o reembolso, o acesso ao plano é encerrado.
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
        8.1. O tratamento dos seus dados pessoais é regido pela nossa{" "}
        <Link href="/privacidade">Política de Privacidade</Link>, em
        conformidade com a Lei Geral de Proteção de Dados (LGPD). Ao aceitar
        estes Termos, você declara que leu e entendeu a Política de
        Privacidade.
      </p>
      <p>
        8.2. Informações como raça, deficiência ou maternidade são dados
        sensíveis. Elas são sempre voluntárias, só são coletadas com o seu
        consentimento específico e são usadas apenas para as finalidades
        informadas na Política de Privacidade, como a inclusão em processos
        seletivos.
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
        diretamente nas configurações do aplicativo ou entrando em contato com
        o nosso suporte.
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