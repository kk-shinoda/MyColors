import { useState, useCallback } from "react";
import {
  validateColorName,
  validateRgbValue,
  validateHexColor,
} from "../validators/colorValidators";

interface ValidationErrors {
  name?: string;
  red?: string;
  green?: string;
  blue?: string;
  hex?: string;
}

interface FormValues {
  name: string;
  red: string;
  green: string;
  blue: string;
  hex?: string;
}

interface UseColorValidationReturn {
  errors: ValidationErrors;
  isValid: boolean;
  validateForm: (values: FormValues) => boolean;
  validateField: (
    field: keyof ValidationErrors,
    value: string,
  ) => string | undefined;
  clearError: (field: keyof ValidationErrors) => void;
  clearAllErrors: () => void;
  setError: (field: keyof ValidationErrors, error: string) => void;
}

/**
 * Custom hook for color form validation
 * Provides validation state management and validation functions
 * Requirements: 3.1, 3.2, 3.3
 */
export function useColorValidation(): UseColorValidationReturn {
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Validate individual field
  const validateField = useCallback(
    (field: keyof ValidationErrors, value: string): string | undefined => {
      let error: string | undefined;

      switch (field) {
        case "name":
          error = validateColorName(value);
          break;
        case "red":
          error = validateRgbValue(value, "Red");
          break;
        case "green":
          error = validateRgbValue(value, "Green");
          break;
        case "blue":
          error = validateRgbValue(value, "Blue");
          break;
        case "hex":
          error = validateHexColor(value);
          break;
      }

      return error;
    },
    [],
  );

  // Validate entire form
  const validateForm = useCallback(
    (values: FormValues): boolean => {
      const newErrors: ValidationErrors = {};

      // Validate each field
      const nameError = validateField("name", values.name);
      const redError = validateField("red", values.red);
      const greenError = validateField("green", values.green);
      const blueError = validateField("blue", values.blue);
      const hexError = values.hex
        ? validateField("hex", values.hex)
        : undefined;

      // Set errors if validation fails
      if (nameError) newErrors.name = nameError;
      if (redError) newErrors.red = redError;
      if (greenError) newErrors.green = greenError;
      if (blueError) newErrors.blue = blueError;
      if (hexError) newErrors.hex = hexError;

      // Update error state
      setErrors(newErrors);

      // Return true if no errors
      return Object.keys(newErrors).length === 0;
    },
    [validateField],
  );

  // Clear specific error
  const clearError = useCallback((field: keyof ValidationErrors) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Set specific error
  const setError = useCallback(
    (field: keyof ValidationErrors, error: string) => {
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    },
    [],
  );

  // Check if form is valid (no errors)
  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    isValid,
    validateForm,
    validateField,
    clearError,
    clearAllErrors,
    setError,
  };
}
