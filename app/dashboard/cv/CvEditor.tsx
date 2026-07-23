"use client";

import { useEffect, useState } from "react";
import { saveCvEdits, regenerateCv } from "../actions";

export type EditableCvData = {
  summary: string;
  experiences: { title: string; bullets: string[] }[];
};

type EditMode = "summary" | `exp-${number}-title` | `exp-${number}-bullet-${number}` | null;

const STORAGE_KEY = (appId: string) => `cv-edit-${appId}`;
const STORAGE_TIMESTAMP_KEY = (appId: string) => `cv-edit-ts-${appId}`;

export default function CvEditor({
  applicationId,
  initialData,
  readOnly = false,
}: {
  applicationId: string;
  initialData: EditableCvData;
  readOnly?: boolean;
}) {
  const [data, setData] = useState<EditableCvData>(initialData);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Auto-save to localStorage na promjene
  useEffect(() => {
    // Provjeri ima li pending edita iz localStorage
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY(applicationId)) : null;
    const timestamp = typeof window !== "undefined" ? localStorage.getItem(STORAGE_TIMESTAMP_KEY(applicationId)) : null;

    if (stored && timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      // Ako je manje od 2 sata, ponudi restore
      if (age < 2 * 60 * 60 * 1000) {
        setShowRestorePrompt(true);
      } else {
        // Premalo staro, obriši
        localStorage.removeItem(STORAGE_KEY(applicationId));
        localStorage.removeItem(STORAGE_TIMESTAMP_KEY(applicationId));
      }
    }
  }, [applicationId]);

  // Spremi u localStorage kad se podaci promijene
  useEffect(() => {
    const isChanged = JSON.stringify(data) !== JSON.stringify(initialData);
    setHasChanges(isChanged);

    if (typeof window !== "undefined" && isChanged) {
      localStorage.setItem(STORAGE_KEY(applicationId), JSON.stringify(data));
      localStorage.setItem(STORAGE_TIMESTAMP_KEY(applicationId), Date.now().toString());
    }
  }, [data, initialData, applicationId]);

  const handleRestore = () => {
    const stored = localStorage.getItem(STORAGE_KEY(applicationId));
    if (stored) {
      try {
        const restoredData = JSON.parse(stored) as EditableCvData;
        setData(restoredData);
      } catch {
        // JSON parse error
      }
    }
    setShowRestorePrompt(false);
  };

  const handleDiscardRestore = () => {
    localStorage.removeItem(STORAGE_KEY(applicationId));
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY(applicationId));
    setShowRestorePrompt(false);
  };

  // Save edits to database
  async function handleSave() {
    setIsSaving(true);
    setError(null);
    try {
      const result = await saveCvEdits(applicationId, data);
      if (!result.success) {
        setError(result.error || "Neuspješno spremanje");
      } else {
        setEditMode(null);
        // Očisti localStorage nakon uspješnog spremanja
        localStorage.removeItem(STORAGE_KEY(applicationId));
        localStorage.removeItem(STORAGE_TIMESTAMP_KEY(applicationId));
        setHasChanges(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Greška pri spremanju");
    } finally {
      setIsSaving(false);
    }
  }

  // Regenerate CV with edited data as context
  async function handleRegenerate() {
    setIsRegenerating(true);
    setError(null);
    try {
      const result = await regenerateCv(applicationId, data);
      if (!result.success) {
        setError(result.error || "Neuspješna regeneracija");
      } else {
        // Update local data with regenerated CV
        setData(result.data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Greška pri regeneraciji");
    } finally {
      setIsRegenerating(false);
    }
  }

  const EditableField = ({
    value,
    mode,
    onChange,
    multiline = false,
  }: {
    value: string;
    mode: EditMode;
    onChange: (v: string) => void;
    multiline?: boolean;
  }) => {
    const isEditing = editMode === mode;

    if (isEditing) {
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          {multiline ? (
            <textarea
              autoFocus
              value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #2563EB",
                fontFamily: "inherit",
                fontSize: 13.5,
                lineHeight: 1.5,
                minHeight: 80,
                resize: "vertical",
              }}
            />
          ) : (
            <input
              autoFocus
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #2563EB",
                fontFamily: "inherit",
                fontSize: 13.5,
                lineHeight: 1.5,
              }}
            />
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              border: "none",
              background: "#2563EB",
              color: "#fff",
              fontWeight: 700,
              fontSize: 12.5,
              cursor: isSaving ? "default" : "pointer",
              opacity: isSaving ? 0.6 : 1,
            }}
          >
            {isSaving ? "Sprema..." : "Spremi"}
          </button>
          <button
            onClick={() => {
              setEditMode(null);
              onChange(value);
            }}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              border: "1px solid #E1E8F2",
              background: "#fff",
              color: "#42506B",
              fontWeight: 700,
              fontSize: 12.5,
              cursor: "pointer",
            }}
          >
            Otkaži
          </button>
        </div>
      );
    }

    return (
      <div
        onClick={() => !readOnly && setEditMode(mode)}
        style={{
          padding: "2px 4px",
          borderRadius: 4,
          cursor: readOnly ? "default" : "pointer",
          background: readOnly ? "transparent" : "rgba(37, 99, 235, 0.04)",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => !readOnly && (e.currentTarget.style.background = "rgba(37, 99, 235, 0.08)")}
        onMouseLeave={(e) => !readOnly && (e.currentTarget.style.background = "rgba(37, 99, 235, 0.04)")}
      >
        {multiline ? (
          <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "#3A4A66", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {value}
          </div>
        ) : (
          <div style={{ fontSize: 13.5, lineHeight: 1.5, color: "#3A4A66" }}>{value}</div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: "20px 0" }}>
      {/* Restore prompt */}
      {showRestorePrompt && (
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 8,
            background: "#DBEAFE",
            border: "1px solid #93C5FD",
            color: "#1E40AF",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            fontSize: 13.5,
          }}
        >
          <div>
            📝 Pronašli smo nespremljene izmjene od prije. Želite li ih vratiti?
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleRestore}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: "#2563EB",
                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Vrati
            </button>
            <button
              onClick={handleDiscardRestore}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #93C5FD",
                background: "#fff",
                color: "#1E40AF",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Odbij
            </button>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            background: "#FEE2E2",
            color: "#DC2626",
            marginBottom: 16,
            fontSize: 13.5,
          }}
        >
          {error}
        </div>
      )}

      {/* Unsaved changes indicator */}
      {hasChanges && !isSaving && (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 6,
            background: "#FEF3C7",
            border: "1px solid #FCD34D",
            color: "#92400E",
            marginBottom: 14,
            fontSize: 12.5,
            fontWeight: 500,
          }}
        >
          💾 Promjene se čuvaju automatski u memoriji preglednika
        </div>
      )}

      {/* Summary */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 13, fontWeight: 800, color: "#2563EB", textTransform: "uppercase", marginBottom: 10 }}>
          Profil
        </h3>
        <EditableField
          value={data.summary}
          mode="summary"
          onChange={(v) => setData({ ...data, summary: v })}
          multiline
        />
      </div>

      {/* Experiences */}
      {data.experiences.map((exp, expIdx) => (
        <div key={expIdx} style={{ marginBottom: 20, paddingLeft: 12, borderLeft: "2px solid #E5E7EB" }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#8A94A6", textTransform: "uppercase", marginBottom: 6 }}>
              Pozicija
            </div>
            <EditableField
              value={exp.title}
              mode={`exp-${expIdx}-title` as EditMode}
              onChange={(v) => {
                const newExps = [...data.experiences];
                newExps[expIdx].title = v;
                setData({ ...data, experiences: newExps });
              }}
            />
          </div>

          {/* Bullets */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#8A94A6", textTransform: "uppercase", marginBottom: 8 }}>
              Postignuća
            </div>
            {exp.bullets.map((bullet, bulletIdx) => (
              <div key={bulletIdx} style={{ marginBottom: 8, display: "flex", gap: 8 }}>
                <span style={{ color: "#2563EB", fontWeight: 700, marginTop: 2 }}>▸</span>
                <EditableField
                  value={bullet}
                  mode={`exp-${expIdx}-bullet-${bulletIdx}` as EditMode}
                  onChange={(v) => {
                    const newExps = [...data.experiences];
                    newExps[expIdx].bullets[bulletIdx] = v;
                    setData({ ...data, experiences: newExps });
                  }}
                  multiline
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Action buttons */}
      {!readOnly && (
        <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "1px solid #DDE5F0",
              background: "#fff",
              color: "#2563EB",
              fontWeight: 700,
              fontSize: 13.5,
              cursor: isRegenerating ? "default" : "pointer",
              opacity: isRegenerating ? 0.6 : 1,
            }}
          >
            {isRegenerating ? "Regenerira se..." : "🔄 Regeneriraj CV"}
          </button>
          <div style={{ fontSize: 12, color: "#8A94A6", display: "flex", alignItems: "center" }}>
            Klikni na bilo koji dio da ga edituiraš
          </div>
        </div>
      )}
    </div>
  );
}
