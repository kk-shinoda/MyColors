import {
  Form,
  ActionPanel,
  Action,
  showToast,
  Toast,
  popToRoot,
} from "@raycast/api";
import { useState } from "react";
import { ColorEntry } from "../../types";
import { useColors, useColorValidation } from "../../hooks";
import { formatErrorMessage } from "../../utils/errorUtils";
import { hexToRgb, formatAsHex } from "../../utils/colorFormatUtils";

interface EditColorFormProps {
  color: ColorEntry;
  onColorEdited: (colors: ColorEntry[]) => void;
}

interface FormValues {
  name: string;
  red: string;
  green: string;
  blue: string;
  hex: string;
}

/**
 * Form component for editing existing colors in the collection
 * Pre-populates form with current color values and includes validation
 */
export default function EditColorForm({
  color,
  onColorEdited,
}: EditColorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [rgbValues, setRgbValues] = useState({
    r: color.rgb.r.toString(),
    g: color.rgb.g.toString(),
    b: color.rgb.b.toString(),
  });
  const [hexValue, setHexValue] = useState(formatAsHex(color.rgb));
  const { updateColor } = useColors();
  const { errors, validateForm, clearError } = useColorValidation();

  /**
   * Handles hex input change and updates RGB values
   */
  const handleHexChange = (value: string) => {
    setHexValue(value);
    clearError("hex");

    // Convert hex to RGB if valid
    const rgb = hexToRgb(value);
    if (rgb) {
      setRgbValues({
        r: rgb.r.toString(),
        g: rgb.g.toString(),
        b: rgb.b.toString(),
      });
      // Clear RGB errors since we have valid values
      clearError("red");
      clearError("green");
      clearError("blue");
    }
  };

  /**
   * Handles RGB input change and updates hex value
   */
  const handleRgbChange = (field: "r" | "g" | "b", value: string) => {
    const newRgbValues = { ...rgbValues, [field]: value };
    setRgbValues(newRgbValues);
    clearError(field === "r" ? "red" : field === "g" ? "green" : "blue");

    // Update hex value if all RGB values are valid
    const r = parseInt(newRgbValues.r, 10);
    const g = parseInt(newRgbValues.g, 10);
    const b = parseInt(newRgbValues.b, 10);

    if (
      !isNaN(r) &&
      !isNaN(g) &&
      !isNaN(b) &&
      r >= 0 &&
      r <= 255 &&
      g >= 0 &&
      g <= 255 &&
      b >= 0 &&
      b <= 255
    ) {
      const newHex = formatAsHex({ r, g, b });
      setHexValue(newHex);
      clearError("hex");
    }
  };

  /**
   * Handles form submission with validation
   */
  const handleSubmit = async (values: FormValues) => {
    // Use current state values instead of form values for RGB
    const formValues = {
      ...values,
      red: rgbValues.r,
      green: rgbValues.g,
      blue: rgbValues.b,
      hex: hexValue,
    };

    // Validate form
    const isValid = validateForm(formValues);

    if (!isValid) {
      return;
    }

    try {
      setIsLoading(true);

      // Edit the color using the hook
      const updatedColors = await updateColor(color.index, values.name.trim(), {
        r: parseInt(rgbValues.r, 10),
        g: parseInt(rgbValues.g, 10),
        b: parseInt(rgbValues.b, 10),
      });

      // Show success message
      await showToast({
        style: Toast.Style.Success,
        title: "Color Updated",
        message: `"${values.name.trim()}" has been updated`,
      });

      // Update parent component and close form
      onColorEdited(updatedColors);
      await popToRoot();
    } catch (error) {
      console.error("Failed to edit color:", error);

      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Update Color",
        message: formatErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Update Color" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="name"
        title="Color Name"
        placeholder="Enter color name (e.g., Primary Blue)"
        defaultValue={color.name}
        error={errors.name}
        onChange={() => clearError("name")}
      />

      <Form.Separator />

      <Form.TextField
        id="hex"
        title="Hex Color Code"
        placeholder="#FF5A5A or #F5A"
        value={hexValue}
        error={errors.hex}
        onChange={handleHexChange}
      />

      <Form.Separator />

      <Form.TextField
        id="red"
        title="Red (0-255)"
        placeholder="255"
        value={rgbValues.r}
        error={errors.red}
        onChange={(value) => handleRgbChange("r", value)}
      />

      <Form.TextField
        id="green"
        title="Green (0-255)"
        placeholder="90"
        value={rgbValues.g}
        error={errors.green}
        onChange={(value) => handleRgbChange("g", value)}
      />

      <Form.TextField
        id="blue"
        title="Blue (0-255)"
        placeholder="90"
        value={rgbValues.b}
        error={errors.blue}
        onChange={(value) => handleRgbChange("b", value)}
      />
    </Form>
  );
}
