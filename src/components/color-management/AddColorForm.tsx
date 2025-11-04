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

interface AddColorFormProps {
  onColorAdded: (colors: ColorEntry[]) => void;
}

interface FormValues {
  name: string;
  red: string;
  green: string;
  blue: string;
}

/**
 * Form component for adding new colors to the collection
 * Includes validation for color names and RGB values
 */
export default function AddColorForm({ onColorAdded }: AddColorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addNewColor } = useColors();
  const { errors, validateForm, clearError } = useColorValidation();

  /**
   * Handles form submission with validation
   */
  const handleSubmit = async (values: FormValues) => {
    // Validate form
    const isValid = validateForm(values);
    
    if (!isValid) {
      return;
    }

    try {
      setIsLoading(true);

      // Add the color using the hook
      const updatedColors = await addNewColor(values.name.trim(), {
        r: parseInt(values.red, 10),
        g: parseInt(values.green, 10),
        b: parseInt(values.blue, 10),
      });

      // Show success message
      await showToast({
        style: Toast.Style.Success,
        title: "Color Added",
        message: `"${values.name.trim()}" has been added to your collection`,
      });

      // Update parent component and close form
      onColorAdded(updatedColors);
      await popToRoot();
    } catch (error) {
      console.error("Failed to add color:", error);

      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Add Color",
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
          <Action.SubmitForm title="Add Color" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="name"
        title="Color Name"
        placeholder="Enter color name (e.g., Primary Blue)"
        error={errors.name}
        onChange={() => clearError("name")}
      />

      <Form.Separator />

      <Form.TextField
        id="red"
        title="Red (0-255)"
        placeholder="255"
        error={errors.red}
        onChange={() => clearError("red")}
      />

      <Form.TextField
        id="green"
        title="Green (0-255)"
        placeholder="90"
        error={errors.green}
        onChange={() => clearError("green")}
      />

      <Form.TextField
        id="blue"
        title="Blue (0-255)"
        placeholder="90"
        error={errors.blue}
        onChange={() => clearError("blue")}
      />
    </Form>
  );
}