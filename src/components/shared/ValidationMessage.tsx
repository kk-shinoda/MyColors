import React from "react";

interface ValidationMessageProps {
  message?: string;
  type?: "error" | "warning" | "info";
}

/**
 * Reusable validation message component
 * Provides consistent error message display
 */
export default function ValidationMessage({
  message,
  type = "error",
}: ValidationMessageProps) {
  if (!message) {
    return null;
  }

  const getColor = () => {
    switch (type) {
      case "error":
        return "#ff4757";
      case "warning":
        return "#ffa502";
      case "info":
        return "#3742fa";
      default:
        return "#ff4757";
    }
  };

  return (
    <div style={{ color: getColor(), fontSize: 12, marginTop: 4 }}>
      {message}
    </div>
  );
}
