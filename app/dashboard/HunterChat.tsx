"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Kako da poboljšam opis svog zadnjeg posla?",
  "Što napisati u motivacijskom pismu ako nemam iskustva?",
  "Koje vještine mi nedostaju za junior developer poziciju?",
  "Kako se pripremiti za prvi razgovor za posao?",
];

export default function HunterChat({ firstName }: { firstName: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || isSending) return;

    setError("");
    setInput("");
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setIsSending(true);

    try {
      const res = await fetch("/api/hunter/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history: messages }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Hunter trenutno ne odgovara.");
        return;
      }
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setError("Greška u vezi. Provjeri internet i pokušaj ponovno.");
    } finally {
      setIsSending(false);
    }
  }

  const bubbleBase: CSSProperties = {
    maxWidth: "82%",
    padding: "12px 15px",
    fontSize: 14,
    lineHeight: 1.65,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  return (
    <div
      style={{
        background: "var(--rh-surface)",
        border: "1px solid var(--rh-border)",
        borderRadius: 20,
        boxShadow: "var(--rh-shadow-card)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--rh-border-soft)", display: "flex", alignItems: "center", gap: 11 }}>
        <span style={{ width: 34, height: 34, flex: "none", borderRadius: 10, background: "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent-dark))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>
          H
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: "var(--rh-text)" }}>Pitaj Huntera</div>
          <div style={{ fontSize: 12, color: "var(--rh-text-3)" }}>Životopis, motivacijsko pismo, oglasi i razgovori za posao</div>
        </div>
      </div>

      <div ref={scrollRef} style={{ padding: "18px 20px", minHeight: 220, maxHeight: 420, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.length === 0 && (
          <div>
            <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.65, color: "var(--rh-text-2)" }}>
              Bok {firstName} — pitaj me bilo što o svom životopisu, motivacijskom pismu ili prijavi za posao.
              Odgovaram na temelju podataka iz tvog profila, pa što je profil potpuniji, to su savjeti konkretniji.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  style={{ padding: "8px 13px", borderRadius: 999, border: "1px dashed var(--rh-border-strong)", background: "var(--rh-surface-2)", color: "var(--rh-accent)", font: "inherit", fontSize: 12.5, fontWeight: 600, cursor: "pointer", textAlign: "left" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div
              style={{
                ...bubbleBase,
                borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.role === "user" ? "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))" : "var(--rh-surface-2)",
                color: m.role === "user" ? "#fff" : "var(--rh-text-2)",
                border: m.role === "user" ? "none" : "1px solid var(--rh-border)",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isSending && (
          <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "6px 2px" }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--rh-text-4)", animation: "rh-pulse 1.1s ease-in-out infinite", animationDelay: `${i * 0.16}s` }}
              />
            ))}
            <span style={{ fontSize: 12.5, color: "var(--rh-text-3)", marginLeft: 6 }}>Hunter razmišlja…</span>
          </div>
        )}

        {error && (
          <div style={{ padding: "10px 13px", borderRadius: 10, background: "var(--rh-danger-soft)", border: "1px solid var(--rh-danger)", color: "var(--rh-danger)", fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      <div style={{ padding: "14px 16px", borderTop: "1px solid var(--rh-border-soft)", background: "var(--rh-surface-2)" }}>
        <div className="rh-fieldwrap" style={{ display: "flex", gap: 9, alignItems: "flex-end", border: "1px solid var(--rh-border)", borderRadius: 13, background: "var(--rh-surface)", padding: 7 }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={2}
            maxLength={2000}
            placeholder="Npr. Kako da opišem praksu koju sam radio?"
            style={{ flex: 1, padding: "8px 10px", border: "none", outline: "none", font: "inherit", fontSize: 14, color: "var(--rh-text)", background: "transparent", resize: "none", lineHeight: 1.6 }}
          />
          <button
            type="button"
            onClick={() => send(input)}
            disabled={isSending || !input.trim()}
            style={{ flex: "none", padding: "10px 17px", borderRadius: 10, border: "none", background: input.trim() && !isSending ? "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))" : "var(--rh-text-4)", color: "#fff", font: "inherit", fontSize: 13.5, fontWeight: 700, cursor: input.trim() && !isSending ? "pointer" : "default" }}
          >
            Pošalji
          </button>
        </div>
        <div style={{ marginTop: 9, fontSize: 11.5, color: "var(--rh-text-3)", lineHeight: 1.5 }}>
          Hunter odgovara samo na pitanja o životopisu, pismima i traženju posla. Odgovore uvijek provjeri prije slanja poslodavcu.
        </div>
      </div>
    </div>
  );
}
