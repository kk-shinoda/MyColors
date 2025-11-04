import { RGB } from "../../types";
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
  errors = {},
  onErrorChange,
}: ColorPickerProps) {
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
