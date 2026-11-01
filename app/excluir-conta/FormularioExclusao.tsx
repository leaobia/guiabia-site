"use client";

import { useState, type FormEvent } from "react";

type Props = { emailDestino: string; prazo: string };

const campoStyle = {
  display: "block",
  width: "100%",
  marginTop: 6,
  padding: "12px 14px",
  border: "2px solid var(--lilac)",
  borderRadius: 12,
  background: "#fff",
  color: "var(--ink)",
  font: "inherit",
} as const;

export default function FormularioExclusao({ emailDestino, prazo }: Props) {
  const [enviado, setEnviado] = useState(false);

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    const email = String(dados.get("email") ?? "").trim();
    const motivo = String(dados.get("motivo") ?? "").trim();

    const assunto = "Pedido de exclusão de conta – Guia BIA";
    const corpo = [
      "Olá, quero excluir a minha conta do Guia BIA e os dados associados a ela.",
      "",
      `E-mail da conta: ${email}`,
      `Motivo: ${motivo || "(não informado)"}`,
    ].join("\n");

    window.location.href = `mailto:${emailDestino}?subject=${encodeURIComponent(
      assunto
    )}&body=${encodeURIComponent(corpo)}`;
    setEnviado(true);
  };

  return (
    <form
      onSubmit={enviar}
      style={{
        display: "grid",
        gap: 18,
        background: "#fff",
        border: "2px solid var(--lilac)",
        borderRadius: 20,
        padding: 20,
      }}
    >
      <label style={{ fontWeight: 700 }}>
        E-mail da conta
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="voce@exemplo.com"
          style={campoStyle}
        />
      </label>

      <label style={{ fontWeight: 700 }}>
        Motivo <span style={{ fontWeight: 400 }}>(opcional)</span>
        <textarea name="motivo" rows={4} maxLength={1000} style={campoStyle} />
      </label>

      <button
        type="submit"
        className="btn"
        style={{
          background: "var(--violet)",
          color: "#fff",
          border: 0,
          cursor: "pointer",
          font: "inherit",
          fontWeight: 800,
          justifySelf: "start",
        }}
      >
        Enviar pedido de exclusão
      </button>

      {enviado && (
        <p role="status" style={{ margin: 0 }}>
          Abrimos o seu aplicativo de e-mail com o pedido preenchido. Confira e
          toque em enviar. Se nada abriu, mande a mensagem para{" "}
          <a href={`mailto:${emailDestino}`}>{emailDestino}</a> a partir do
          e-mail da conta. Atendemos em até {prazo}.
        </p>
      )}
    </form>
  );
}
