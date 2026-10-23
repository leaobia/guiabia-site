// Port web do AvatarBia.tsx do app (mesmo desenho SVG).
type State = "idle" | "greeting" | "supportive";
const EXP = {
  idle: { mouth: "M 43 72 Q 50 76 57 72", badge: "#6b2fb5", ring: "#e0c8f0" },
  greeting: { mouth: "M 41 71 Q 50 79 59 71", badge: "#059669", ring: "#a7f3d0" },
  supportive: { mouth: "M 42 72 Q 50 78 58 72", badge: "#6b2fb5", ring: "#e0c8f0" },
};

function Eye({ cx }: { cx: number }) {
  return (
    <g className="eye">
      <ellipse cx={cx} cy="53" rx="4.8" ry="4.5" fill="#fff" />
      <circle cx={cx} cy="53" r="3.2" fill="#2d1810" />
      <circle cx={cx + 0.2} cy="53" r="1.4" fill="#000" />
      <circle cx={cx + 1.2} cy="51.8" r="0.9" fill="#fff" />
      <path d={`M ${cx - 5} 51 Q ${cx} 49 ${cx + 5} 51`} stroke="#38190d" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </g>
  );
}

export default function Avatar({ size = 120, state = "idle", float = false }: { size?: number; state?: State; float?: boolean }) {
  const e = EXP[state];
  return (
    <span className={`avatar${float ? " float" : ""}`} style={{ width: size, height: size, borderColor: e.ring }}>
      <svg viewBox="0 0 100 100" role="img" aria-label="Bia, a assistente do app" width="100%" height="100%">
        <defs>
          <radialGradient id="bg-grad" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#faf5f0" /><stop offset="100%" stopColor="#eedcd3" /></radialGradient>
          <linearGradient id="skin-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f8ded0" /><stop offset="100%" stopColor="#eec4b0" /></linearGradient>
          <linearGradient id="hair-base" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#5a2c1d" /><stop offset="70%" stopColor="#431e13" /><stop offset="100%" stopColor="#2e130c" /></linearGradient>
          <linearGradient id="curl-highlight" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#87432d" /><stop offset="100%" stopColor="#5e2d1d" /></linearGradient>
          <linearGradient id="sweater-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e2d42" /><stop offset="100%" stopColor="#141f2e" /></linearGradient>
        </defs>
        <circle cx="50" cy="50" r="49" fill="url(#bg-grad)" />
        <g fill="url(#hair-base)">
          <circle cx="24" cy="38" r="16" /><circle cx="21" cy="52" r="15" /><circle cx="23" cy="66" r="14" /><circle cx="28" cy="78" r="12" />
          <circle cx="76" cy="38" r="16" /><circle cx="79" cy="52" r="15" /><circle cx="77" cy="66" r="14" /><circle cx="72" cy="78" r="12" />
          <circle cx="34" cy="24" r="15" /><circle cx="50" cy="19" r="16" /><circle cx="66" cy="24" r="15" />
        </g>
        <path d="M 22 98 Q 24 84 38 82 L 50 85 L 62 82 Q 76 84 78 98 Z" fill="url(#sweater-grad)" />
        <path d="M 40 83 Q 50 88 60 83" stroke="#2b3e58" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 43 72 L 43 84 Q 50 87 57 84 L 57 72 Z" fill="#e2b59f" />
        <ellipse cx="50" cy="56" rx="23" ry="25" fill="url(#skin-grad)" />
        <ellipse cx="27" cy="56" rx="3.5" ry="5.5" fill="#eec4b0" /><ellipse cx="73" cy="56" rx="3.5" ry="5.5" fill="#eec4b0" />
        <ellipse cx="37" cy="63" rx="5" ry="3" fill="#ea9284" opacity="0.35" /><ellipse cx="63" cy="63" rx="5" ry="3" fill="#ea9284" opacity="0.35" />
        <g stroke="#431e13" strokeWidth="1.8" strokeLinecap="round" fill="none"><path d="M 36 46 Q 41 43 45 46" /><path d="M 55 46 Q 59 43 64 46" /></g>
        <Eye cx={41} /><Eye cx={59} />
        <path d="M 50 56 Q 49 63 50 64 Q 52 64 51 63" stroke="#d49a81" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d={e.mouth} stroke="#c85955" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <g fill="url(#curl-highlight)">
          <circle cx="36" cy="31" r="9" /><circle cx="48" cy="27" r="9" /><circle cx="62" cy="29" r="9" /><circle cx="54" cy="33" r="7" />
          <path d="M 28 42 C 24 48, 25 54, 30 58 C 32 50, 31 46, 28 42 Z" fill="#733222" />
          <path d="M 72 42 C 76 48, 75 54, 70 58 C 68 50, 69 46, 72 42 Z" fill="#733222" />
          <g strokeLinecap="round" fill="none">
            <path d="M 27 50 Q 23 58 29 64 Q 25 68 28 74" stroke="#8a442e" strokeWidth="2.5" />
            <path d="M 73 50 Q 77 58 71 64 Q 75 68 72 74" stroke="#8a442e" strokeWidth="2.5" />
            <path d="M 32 38 Q 28 44 32 50" stroke="#9e5039" strokeWidth="2" />
            <path d="M 68 38 Q 72 44 68 50" stroke="#9e5039" strokeWidth="2" />
          </g>
        </g>
      </svg>
      <i className="dot" style={{ background: e.badge }} />
    </span>
  );
}
