import {
  Form,
  ActionPanel,
  Action,
  showToast,
  Toast,
  popToRoot,
} from "@raycast/api";
import { useState } from "react";
import { editColor } from "../services/colorService";
import { ColorEntry } from "../types";

interface EditColorFormProps {
  color: ColorEntry;
  onColorEdited: (colors: ColorEntry[]) => void;
}

interface FormValues {
  name: string;
  red: string;
  green: string;
  blue: string;
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
  const [nameError, setNameError] = useState<string | undefined>();
  const [redError, setRedError] = useState<string | undefined>();
  const [greenError, setGreenError] = useState<string | undefined>();
  const [blueError, setBlueError] = useState<string | undefined>();

  /**
   * Validates RGB value input (0-255)
   */
  const validateRgbValue = (
    value: string,
    colorName: string,
  ): string | undefined => {
    if (!value.trim()) {
      return `${colorName} value is required`;
    }

    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      return `${colorName} must be a number`;
    }

    if (numValue < 0 || numValue > 255) {
      return `${colorName} must be between 0 and 255`;
    }

    return undefined;
  };

  /**
   * Validates color name input
   */
  const validateName = (name: string): string | undefined => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return "Color name is required";
    }

    if (trimmedName.length > 50) {
      return "Color name must be 50 characters or less";
    }

    return undefined;
  };

  /**
   * Handles form submission with validation
   */
  const handleSubmit = async (values: FormValues) => {
    // Clear previous errors
    setNameError(undefined);
    setRedError(undefined);
    setGreenError(undefined);
    setBlueError(undefined);

    // Validate inputs
    const nameValidation = validateName(values.name);
    const redValidation = validateRgbValue(values.red, "Red");
    const greenValidation = validateRgbValue(values.green, "Green");
    const blueValidation = validateRgbValue(values.blue, "Blue");

    // Set errors if validation fails
    if (nameValidation) setNameError(nameValidation);
    if (redValidation) setRedError(redValidation);
    if (greenValidation) setGreenError(greenValidation);
    if (blueValidation) setBlueError(blueValidation);

    // Stop if there are validation errors
    if (nameValidation || redValidation || greenValidation || blueValidation) {
      return;
    }

    try {
      setIsLoading(true);

      // Edit the color
      const updatedColors = await editColor(color.index, values.name.trim(), {
        r: parseInt(values.red, 10),
        g: parseInt(values.green, 10),
        b: parseInt(values.blue, 10),
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
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
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
        error={nameError}
        onChange={() => setNameError(undefined)}
      />

      <Form.Separator />

      <Form.TextField
        id="red"
        title="Red (0-255)"
        placeholder="255"
        defaultValue={color.rgb.r.toString()}
        error={redError}
        onChange={() => setRedError(undefined)}
      />

      <Form.TextField
        id="green"
        title="Green (0-255)"
        placeholder="90"
        defaultValue={color.rgb.g.toString()}
        error={greenError}
        onChange={() => setGreenError(undefined)}
      />

      <Form.TextField
        id="blue"
        title="Blue (0-255)"
        placeholder="90"
        defaultValue={color.rgb.b.toString()}
        error={blueError}
        onChange={() => setBlueError(undefined)}
      />
    </Form>
  );
}
