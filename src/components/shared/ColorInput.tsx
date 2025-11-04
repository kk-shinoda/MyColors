import { Form } from "@raycast/api";

interface ColorInputProps {
  id: string;
  title: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
  onChange?: () => void;
}

/**
 * Reusable color input component for RGB values
 * Provides consistent styling and validation display
 */
export default function ColorInput({
  id,
  title,
  placeholder,
  defaultValue,
  error,
  onChange,
}: ColorInputProps) {
  return (
    <Form.TextField
      id={id}
      title={title}
      placeholder={placeholder}
      defaultValue={defaultValue}
      error={error}
      onChange={onChange}
    />
  );
}
