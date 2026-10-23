import Avatar from "@/components/Avatar";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

const Petals = () => (
  <svg className="petals" viewBox="-30 -30 60 60" aria-hidden fill="#dcc7ec">
    <circle cx="0" cy="-12" r="9" /><circle cx="11.5" cy="-3.7" r="9" /><circle cx="7" cy="9.7" r="9" /><circle cx="-7" cy="9.7" r="9" /><circle cx="-11.5" cy="-3.7" r="9" />
  </svg>
);

export default function Home() {
  return (
    <main>
      <div className="hero">
        <Petals />
        <div className="wrap">
          <div className="top"><img src="/logo.svg" alt="" width={38} height={38} />Bia</div>
          <div className="hero-grid">
            <div>
              <h1>Um passo pequeno de cada vez.</h1>
              <p className="lead">A Bia acolhe, orienta e conecta mulheres a segurança, estudo, trabalho e uma rede de apoio. Sem pressa e sem julgamento.</p>
              <Cta />
            </div>
            <div className="phone" aria-label="Exemplo de conversa com a Bia">
              <div className="phone-head">
                <Avatar size={52} state="greeting" />
                <div><b>Bia</b><small>Estou aqui com você</small></div>
              </div>
              <div className="msgs">
                <div className="msg bia" style={{ ["--d" as string]: ".4s" }}>Oi, eu sou a Bia. Como você está hoje?</div>
                <div className="msg me" style={{ ["--d" as string]: "1.6s" }}>Hoje foi um dia difícil.</div>
                <div className="msg bia" style={{ ["--d" as string]: "2.8s" }}>Obrigada por me contar. Você não precisa resolver tudo hoje. Podemos começar com um passo pequeno.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="block">
        <div className="wrap">
          <h2>Tudo o que você precisa, em um só lugar.</h2>
          <div className="feats">
            <div className="feat" style={{ ["--c" as string]: "#6b2fb5" }}><h3>Conversa que acolhe</h3><p>Converse com a Bia no seu ritmo. Ela escuta sem culpar e sugere caminhos práticos.</p></div>
            <div className="feat" style={{ ["--c" as string]: "#c85955" }}><h3>Central de segurança</h3><p>Atalhos para o 190 e o Ligue 180, e para uma pessoa de confiança. A ligação só começa depois da sua confirmação, e o app não envia SMS nem compartilha sua localização.</p></div>
            <div className="feat" style={{ ["--c" as string]: "#059669" }}><h3>Estudo e trabalho</h3><p>Trilhas com passos pequenos e concluíveis para ganhar autonomia e independência financeira.</p></div>
            <div className="feat" style={{ ["--c" as string]: "#d9a441" }}><h3>Garotas apoiam garotas</h3><p>Um diretório de negócios feitos por mulheres, com contato direto e cupons.</p></div>
          </div>
        </div>
      </section>

      <section className="block band">
        <div className="wrap">
          <p className="big">Ninguém precisa dar conta de tudo sozinha.</p>
          <p className="sub">A Bia nasceu para fortalecer a rede de apoio entre mulheres: quem precisa de ajuda encontra caminhos, e quem tem um negócio encontra apoio da comunidade.</p>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="emergency">
            <b>Em perigo agora?</b> Ligue <a href="tel:190">190</a> (Polícia) ou <a href="tel:180">180</a> (Central de Atendimento à Mulher). O app Bia não substitui o atendimento de emergência.
          </div>
        </div>
      </section>

      <div className="final">
        <div className="wrap">
          <Avatar size={140} state="greeting" float />
          <h2>Podemos começar quando você quiser.</h2>
          <Cta />
        </div>
      </div>

      <div className="wrap"><Footer /></div>
    </main>
  );
}
