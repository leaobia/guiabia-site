// Ícones de traço (24×24) usados no portal. Herdam a cor do texto.
const PATHS = {
  briefcase: "M4 8h16v11H4z M9 8V5h6v3 M4 13h16",
  users: "M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19 M10 10.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M20 19v-1.5a3.5 3.5 0 0 0-2.5-3.3 M15.5 4.6a3 3 0 0 1 0 5.8",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2",
  pin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  laptop: "M5 6h14v9H5z M3 18h18",
  home: "M4 11l8-6.5 8 6.5 M6 9.5V19h12V9.5",
  building: "M5 20V5h9v15 M14 10h5v10 M3 20h18 M8 8.5h3 M8 12h3 M8 15.5h3",
  calendar: "M4 6h16v14H4z M4 10h16 M8 3.5v4 M16 3.5v4",
  plus: "M12 5v14 M5 12h14",
  edit: "M4 20h4L19 9l-4-4L4 16z M13.5 6.5l4 4",
  arrowLeft: "M19 12H5 M11 6l-6 6 6 6",
  arrowRight: "M5 12h14 M13 6l6 6-6 6",
  mail: "M3.5 6h17v12h-17z M3.5 6.5 12 13l8.5-6.5",
  phone: "M6.5 3.5h3l1.5 4-2 1.3a10 10 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z",
  file: "M6 3h8l4 4v14H6z M14 3v4h4 M9 12h6 M9 16h6",
  money: "M3 7h18v10H3z M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M6.5 10v.01 M17.5 14v.01",
  check: "M5 12.5l4.5 4.5L19 7.5",
  heart: "M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  logout: "M15 4h4v16h-4 M10 8l-4 4 4 4 M6 12h10",
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flex: "none" }}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
