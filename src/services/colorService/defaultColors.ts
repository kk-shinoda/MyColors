import { ColorEntry } from "../../types";

/**
 * Default colors to create when no file exists (requirement 1.4)
 */
export const DEFAULT_COLORS: ColorEntry[] = [
  {
    index: 0,
    name: "Primary Red",
    rgb: { r: 255, g: 90, b: 90 },
  },
  {
    index: 1,
    name: "Ocean Blue",
    rgb: { r: 52, g: 152, b: 219 },
  },
  {
    index: 2,
    name: "Forest Green",
    rgb: { r: 46, g: 204, b: 113 },
  },
  {
    index: 3,
    name: "Sunset Orange",
    rgb: { r: 255, g: 165, b: 0 },
  },
  {
    index: 4,
    name: "Purple Accent",
    rgb: { r: 155, g: 89, b: 182 },
  },
];
