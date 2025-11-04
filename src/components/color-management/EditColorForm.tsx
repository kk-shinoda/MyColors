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
  const { updateColor } = useColors();
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

      // Edit the color using the hook
      const updatedColors = await updateColor(color.index, values.name.trim(), {
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
        id="red"
        title="Red (0-255)"
        placeholder="255"
        defaultValue={color.rgb.r.toString()}
        error={errors.red}
        onChange={() => clearError("red")}
      />

      <Form.TextField
        id="green"
        title="Green (0-255)"
        placeholder="90"
        defaultValue={color.rgb.g.toString()}
        error={errors.green}
        onChange={() => clearError("green")}
      />

      <Form.TextField
        id="blue"
        title="Blue (0-255)"
        placeholder="90"
        defaultValue={color.rgb.b.toString()}
        error={errors.blue}
        onChange={() => clearError("blue")}
      />
    </Form>
  );
}