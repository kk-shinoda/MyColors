import { Form } from "@raycast/api";
import { useState } from "react";
import { RGB } from "../../types";
import { validateRgbValue } from "../../validators/colorValidators";
import ColorInput from "./ColorInput";

interface ColorPickerProps {
  initialColor?: RGB;
  onColorChange?: (rgb: RGB) => void;
  errors?: {
    red?: string;
    green?: string;
    blue?: string;
  };
  onErrorChange?: (field: "red" | "green" | "blue", error?: string) => void;
}

/**
 * Reusable color picker component
 * Provides RGB input fields with validation and preview
 * Requirements: 3.1, 3.2, 3.3
 */
export default function ColorPicker({
  initialColor = { r: 255, g: 90, b: 90 },
  onColorChange,
  errors = {},
  onErrorChange,
}: ColorPickerProps) {
  const [rgb, setRgb] = useState<RGB>(initialColor);

  const handleValueChange = (
    component: "r" | "g" | "b",
    value: string,
    fieldName: "red" | "green" | "blue"
  ) => {
    // Clear error when user starts typing
    onErrorChange?.(fieldName, undefined);

    // Validate the input
    const error = validateRgbValue(value, fieldName);
    if (error) {
      onErrorChange?.(fieldName, error);
      return;
    }

    // Update RGB value if valid
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 255) {
      const newRgb = { ...rgb, [component]: numValue };
      setRgb(newRgb);
      onColorChange?.(newRgb);
    }
  };

  return (
    <>
      <ColorInput
        id="red"
        title="Red (0-255)"
        placeholder="255"
        defaultValue={initialColor.r.toString()}
        error={errors.red}
        onChange={() => onErrorChange?.("red", undefined)}
      />

      <ColorInput
        id="green"
        title="Green (0-255)"
        placeholder="90"
        defaultValue={initialColor.g.toString()}
        error={errors.green}
        onChange={() => onErrorChange?.("green", undefined)}
      />

      <ColorInput
        id="blue"
        title="Blue (0-255)"
        placeholder="90"
        defaultValue={initialColor.b.toString()}
        error={errors.blue}
        onChange={() => onErrorChange?.("blue", undefined)}
      />
    </>
  );
}