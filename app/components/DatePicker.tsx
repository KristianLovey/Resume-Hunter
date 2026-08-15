"use client";

import { useState, useRef, useEffect } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
}: {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse value to show in input
  const displayValue = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // If value changes externally, update month/year
  useEffect(() => {
    if (value) {
      const d = new Date(value + "T00:00:00");
      setMonth(d.getMonth());
      setYear(d.getFullYear());
    }
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function getDaysInMonth(m: number, y: number) {
    return new Date(y, m + 1, 0).getDate();
  }

  function getFirstDayOfMonth(m: number, y: number) {
    return new Date(y, m, 1).getDay();
  }

  function handleSelectDate(day: number) {
    const selected = new Date(year, month, day);
    const iso = selected.toISOString().split("T")[0];
    onChange(iso);
    setIsOpen(false);
  }

  function handlePrevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  function handleNextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  // For previous month (to show last days)
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        value={displayValue}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        readOnly
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 10,
          border: "1.5px solid var(--rh-border-strong)",
          fontFamily: "inherit",
          fontSize: 15,
          cursor: "pointer",
          backgroundColor: "var(--rh-surface)",
          color: "var(--rh-text)",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            width: 320,
            background: "var(--rh-surface)",
            border: "1px solid var(--rh-border)",
            borderRadius: 14,
            boxShadow: "0 10px 40px rgba(var(--rh-shadow-rgb),.3)",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <button
              onClick={handlePrevMonth}
              style={{
                width: 32,
                height: 32,
                border: "none",
                borderRadius: 8,
                background: "var(--rh-surface-3)",
                cursor: "pointer",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--rh-border)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--rh-surface-3)")}
            >
              ←
            </button>

            <div style={{ textAlign: "center", flex: 1 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--rh-text)",
                  marginBottom: 4,
                }}
              >
                {MONTHS[month]} {year}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <select
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    border: "1px solid var(--rh-border)",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    border: "1px solid var(--rh-border)",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleNextMonth}
              style={{
                width: 32,
                height: 32,
                border: "none",
                borderRadius: 8,
                background: "var(--rh-surface-3)",
                cursor: "pointer",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--rh-border)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--rh-surface-3)")}
            >
              →
            </button>
          </div>

          {/* Day names */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 8 }}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "var(--rh-text-3)",
                  padding: "8px 0",
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {/* Previous month days (grayed out) */}
            {emptyDays.map((_, i) => (
              <div
                key={`prev-${i}`}
                style={{
                  aspectRatio: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  color: "var(--rh-border-strong)",
                  cursor: "default",
                }}
              >
                {daysInPrevMonth - firstDay + i + 1}
              </div>
            ))}

            {/* Current month days */}
            {days.map((day) => {
              const isSelected =
                value &&
                new Date(value + "T00:00:00").toDateString() ===
                  new Date(year, month, day).toDateString();
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

              return (
                <button
                  key={day}
                  onClick={() => handleSelectDate(day)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 8,
                    border: isSelected ? "2px solid var(--rh-accent)" : "1px solid var(--rh-border)",
                    background: isSelected
                      ? "linear-gradient(135deg,var(--rh-accent-2),var(--rh-accent))"
                      : isToday
                        ? "var(--rh-surface-3)"
                        : "#fff",
                    color: isSelected ? "#fff" : "var(--rh-text)",
                    fontWeight: isSelected || isToday ? 700 : 500,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "var(--rh-surface-2)";
                      e.currentTarget.style.borderColor = "var(--rh-border-strong)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.borderColor = "var(--rh-border)";
                    }
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick actions */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 16,
              paddingTop: 12,
              borderTop: "1px solid var(--rh-border)",
            }}
          >
            <button
              onClick={() => {
                const today = new Date().toISOString().split("T")[0];
                onChange(today);
                setIsOpen(false);
              }}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid var(--rh-border)",
                background: "var(--rh-surface)",
                color: "var(--rh-accent)",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Today
            </button>
            <button
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid var(--rh-border)",
                background: "var(--rh-surface)",
                color: "var(--rh-text-3)",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
