# MyColor Raycast Extension Design Document

## Overview

MyColor is a minimal Raycast extension built with Node.js and TypeScript that provides quick access to favorite RGB colors. The extension follows Raycast's standard architecture patterns with a single command interface that displays a list of colors and enables one-click copying of RGB values to the clipboard.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Raycast UI    │◄──►│  MyColor Command │◄──►│  Color Service  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Action Handler │    │  File Storage   │
                       └──────────────────┘    └─────────────────┘
```

### Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Raycast API (@raycast/api)
- **Build Tool**: TypeScript Compiler (tsc)
- **Package Manager**: npm
- **CI/CD**: GitHub Actions

## Components and Interfaces

### 1. Main Command Component (`src/index.tsx`)

**Purpose**: Primary Raycast command entry point that renders the color list interface.

**Key Responsibilities**:
- Initialize and render the List component (requirement 1.1)
- Display color previews and labels (requirement 3.1, 3.2)
- Manage loading states during file operations
- Coordinate between UI and services
- Handle color selection and copy actions (requirement 2.1)
- Ensure English language display (requirement 1.5)

**Design Rationale**: Single command component keeps the extension simple while providing all required functionality through Raycast's List interface.

**Interface**:
```typescript
export default function Command(): JSX.Element
```

### 2. Color Service (`src/services/colorService.ts`)

**Purpose**: Manages color data operations including file I/O and data validation.

**Key Responsibilities**:
- Load colors from local JSON file (requirement 1.3, 4.2)
- Create default color file if missing (requirement 1.4, 4.3)
- Validate color data structure and handle corrupted files (requirement 4.3)
- Handle file system errors gracefully
- Ensure maximum 15 color entries (requirement 1.2)

**Design Rationale**: Centralized color management provides clean separation of concerns and enables consistent error handling across the application.

**Interface**:
```typescript
interface ColorService {
  loadColors(): Promise<ColorEntry[]>
  ensureColorFile(): Promise<void>
}

interface ColorEntry {
  index: number        // For ordering (requirement 3.2)
  name: string         // Display label (requirement 3.2)
  rgb: {
    r: number         // Red value 0-255
    g: number         // Green value 0-255
    b: number         // Blue value 0-255
  }
}
```

### 3. Action Handlers (`src/actions/copyAction.ts`)

**Purpose**: Handle user interactions with color entries.

**Key Responsibilities**:
- Format RGB values as "rgb(red, green, blue)" strings (requirement 2.2)
- Copy formatted RGB to system clipboard (requirement 2.1)
- Provide user feedback via toast notifications (requirement 2.3)
- Close Raycast interface after successful copy (requirement 2.4)

**Design Rationale**: Dedicated action handlers provide reusable clipboard functionality and consistent user feedback patterns.

**Interface**:
```typescript
interface CopyAction {
  copyRgbToClipboard(color: ColorEntry): Promise<void>
  formatRgbString(color: ColorEntry): string
}
```

### 4. Color Format Utilities (`src/utils/colorFormatUtils.ts`)

**Purpose**: Handle conversion between different color formats (hex, RGB).

**Key Responsibilities**:
- Convert hex color codes to RGB values (requirement 6.4)
- Support both 6-digit (#RRGGBB) and 3-digit (#RGB) hex formats (requirement 6.2, 6.3)
- Validate hex color code format (requirement 6.5)
- Provide real-time color conversion for UI updates (requirement 6.6)

**Design Rationale**: Dedicated utility functions for color format conversion ensure consistent behavior across the application and enable easy testing of conversion logic.

**Interface**:
```typescript
interface ColorFormatUtils {
  hexToRgb(hex: string): { r: number; g: number; b: number } | null
  isValidHex(hex: string): boolean
  normalizeHex(hex: string): string
}
```

### 5. Color Preview Component (`src/components/shared/ColorPreview.tsx`)

**Purpose**: Display real-time color preview during color editing operations.

**Key Responsibilities**:
- Render color preview with RGB values (requirement 7.1, 7.2)
- Update preview immediately when hex values change (requirement 7.3)
- Provide sufficient preview size for visual identification (requirement 7.4)
- Maintain proper contrast with interface elements (requirement 7.5)
- Handle invalid color states gracefully

**Design Rationale**: Dedicated preview component enables consistent color visualization across different forms and provides immediate visual feedback during color editing.

**Interface**:
```typescript
interface ColorPreviewProps {
  rgb: { r: number; g: number; b: number }
  size?: 'small' | 'medium' | 'large'
  showBorder?: boolean
  className?: string
}

export function ColorPreview(props: ColorPreviewProps): JSX.Element
```

### 5. Configuration Files

#### Extension Configuration (`package.json`)
- Standard npm package configuration with Raycast dependencies
- TypeScript build scripts and development dependencies
- ESLint configuration for code quality
- Raycast-specific metadata and command definitions

**Design Rationale**: Following Raycast's standard extension structure ensures compatibility and enables proper tooling integration.

#### Raycast Manifest (`package.json` - raycast section)
```json
{
  "name": "mycolor",
  "title": "MyColor",
  "description": "Quick access to your favorite RGB colors",
  "icon": "color-palette.png",
  "author": "developer",
  "categories": ["Design Tools"],
  "license": "MIT",
  "commands": [
    {
      "name": "list-colors",
      "title": "List Colors",
      "description": "Browse and copy your favorite RGB colors",
      "mode": "view"
    }
  ]
}
```

#### TypeScript Configuration (`tsconfig.json`)
- Strict type checking enabled for code safety
- ES2020 target for Node.js compatibility
- Module resolution configured for Raycast API imports

**Design Rationale**: TypeScript provides compile-time type safety and better developer experience, addressing requirement 5.4.

#### GitHub Actions Workflow (`.github/workflows/ci.yml`)
- Automated linting with ESLint (requirement 6.2)
- TypeScript compilation and type checking (requirement 6.3)
- Build verification for extension bundling (requirement 6.3)
- Optional test execution when tests are present (requirement 6.4)
- Pipeline failure on any linting or build errors (requirement 6.5)

**Design Rationale**: Automated CI/CD ensures code quality and prevents deployment of broken builds, meeting all developer requirements in Requirement 6.

## Data Models

### ColorEntry Model

```typescript
interface ColorEntry {
  index: number        // Index for ordering (0-based)
  name: string         // Display name (e.g., "Primary Red")
  rgb: {
    r: number         // Red value (0-255)
    g: number         // Green value (0-255)  
    b: number         // Blue value (0-255)
  }
}
```

### Default Color Data

The extension will create a default `colors.json` file with these entries:

```json
[
  {
    "index": 0,
    "name": "Primary Red",
    "rgb": { "r": 255, "g": 90, "b": 90 }
  },
  {
    "index": 1,
    "name": "Ocean Blue", 
    "rgb": { "r": 52, "g": 152, "b": 219 }
  },
  {
    "index": 2,
    "name": "Forest Green",
    "rgb": { "r": 46, "g": 204, "b": 113 }
  }
]
```

### File Storage Location

- **Path**: `~/Library/Application Support/raycast-my-color/colors.json` (requirement 4.2)
- **Format**: JSON array of ColorEntry objects
- **Max Entries**: 15 colors (requirement 1.2)
- **Encoding**: UTF-8
- **Access**: Local file system only, no network dependencies (requirement 4.4, 4.5)

**Design Rationale**: Using macOS standard Application Support directory ensures proper file organization while maintaining local-only storage as required.

## Error Handling

### File System Errors

1. **Missing Directory**: Create directory structure if it doesn't exist
2. **Missing File**: Generate default colors.json file with sample colors
3. **Corrupted File**: Log error and fall back to default colors (requirement 4.3)
4. **Permission Errors**: Display user-friendly error message

**Design Rationale**: Graceful degradation ensures the extension remains functional even when file system issues occur, meeting requirement 4.3.

### Data Validation Errors

1. **Invalid JSON**: Basic try/catch with fallback to default colors
2. **Empty Color List**: Show message indicating no colors available
3. **Invalid Color Format**: Skip malformed entries and continue with valid ones
4. **Invalid Hex Color**: Display validation error message for malformed hex codes (requirement 6.5)
5. **Hex Conversion Errors**: Handle edge cases in hex-to-RGB conversion gracefully

### Runtime Errors

1. **UI Rendering**: Basic error boundaries for React components
2. **Clipboard Operations**: Handle clipboard access failures gracefully

**Design Rationale**: Robust error handling prevents extension crashes and provides consistent user experience.

## Testing Strategy

### Minimal Unit Tests (Optional)

- **Color Service**: Basic file loading and default creation
- **Copy Action**: RGB string formatting validation

**Design Rationale**: Minimal testing approach focuses on core functionality while keeping development overhead low for this MVP.

### CI/CD Pipeline

- **GitHub Actions**: Automated workflow for code quality assurance (requirement 6.1)
- **Linting**: ESLint with TypeScript rules for code consistency (requirement 6.2)
- **Type Checking**: TypeScript compiler validation for type safety (requirement 6.3)
- **Build Verification**: Successful compilation and bundling (requirement 6.3)
- **Test Execution**: Run unit tests when present (requirement 6.4)
- **Build Failure**: Fail pipeline on linting or build errors (requirement 6.5)

**Design Rationale**: Automated CI/CD ensures code quality and prevents regressions, addressing all requirements in Requirement 6.

## Implementation Notes

### Raycast API Usage

- Use `@raycast/api` List and List.Item components for color display (requirement 1.1)
- Implement Action.CopyToClipboard for clipboard operations (requirement 2.1)
- Use showToast for user feedback after copy actions (requirement 2.3)
- Close Raycast interface after successful color selection (requirement 2.4)
- Display color previews using List.Item accessories (requirement 3.1, 3.3)
- Follow Raycast's design guidelines for consistent UX

**Design Rationale**: Leveraging Raycast's native components ensures consistent user experience and proper integration with the platform.

### Performance Considerations

- Load color data directly from file when command is invoked
- Limit color list to 15 entries maximum (requirement 1.2)
- Use synchronous file operations for simplicity given small data size

**Design Rationale**: Simple file loading approach is sufficient for the limited dataset and provides predictable performance.

### Security Considerations

- Use Node.js built-in path utilities for safe file operations
- Hardcoded file path prevents directory traversal attacks
- No network operations eliminate external security vectors (requirement 4.4, 4.5)

**Design Rationale**: Local-only storage approach minimizes security surface area and aligns with requirement 4.