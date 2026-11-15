// Avatar da Bia com as ilustrações oficiais do app (public/bia).
type State = "idle" | "greeting" | "supportive" | "thinking";
const EXP: Record<State, { src: string; badge: string; ring: string }> = {
  idle: { src: "/bia/neutra.jpg", badge: "#6b2fb5", ring: "#e0c8f0" },
  greeting: { src: "/bia/sorrindo.jpg", badge: "#059669", ring: "#a7f3d0" },
  supportive: { src: "/bia/sorrindo.jpg", badge: "#6b2fb5", ring: "#e0c8f0" },
  thinking: { src: "/bia/pensativa.jpg", badge: "#e8746a", ring: "#f8cfc9" },
};

export default function Avatar({
  size = 120,
  state = "idle",
  float = false,
  dot = true,
}: {
  size?: number;
  state?: State;
  float?: boolean;
  dot?: boolean;
}) {
  const e = EXP[state];
  return (
    <span className={`avatar${float ? " float" : ""}`} style={{ width: size, height: size, borderColor: e.ring }}>
      <img src={e.src} alt="Bia, a assistente do app" width={size} height={size} />
      {dot && <i className="dot" style={{ background: e.badge }} />}
    </span>
  );
}
