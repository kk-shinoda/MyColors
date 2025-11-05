# Implementation Plan

- [x] 1. Set up project structure and configuration
  - Create package.json with Raycast dependencies and TypeScript configuration
  - Set up TypeScript configuration (tsconfig.json)
  - Create basic project directory structure (src/, assets/)
  - Add Raycast extension manifest configuration in package.json
  - Configure ESLint for code quality
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 2. Implement core data models and types
  - Define ColorEntry interface with index, name and rgb fields
  - Create type definitions for RGB values and color data structures
  - _Requirements: 4.1, 4.2_

- [x] 3. Create color service for file operations
  - [x] 3.1 Implement color file loading functionality
    - Write function to read colors from ~/Library/Application Support/raycast-my-color/colors.json
    - Handle basic file not found scenarios with try/catch
    - _Requirements: 1.3, 4.2, 4.3_

  - [x] 3.2 Implement default color file creation
    - Create function to generate default colors.json with 3-5 sample colors
    - Ensure directory creation if it doesn't exist
    - Write default color data to file system
    - _Requirements: 1.4, 4.3_

- [x] 4. Build copy action functionality
  - [x] 4.1 Implement RGB string formatting
    - Create function to convert ColorEntry RGB values to "rgb(r, g, b)" format
    - Handle numeric value validation and formatting
    - _Requirements: 2.2_

  - [x] 4.2 Implement clipboard copy action
    - Use Raycast API to copy formatted RGB string to clipboard
    - Add user feedback with toast notification
    - Close Raycast interface after successful copy
    - _Requirements: 2.1, 2.3, 2.4_

- [x] 5. Create main Raycast command interface
  - [x] 5.1 Build color list UI component
    - Implement Raycast List component with color entries
    - Display color name and RGB preview for each entry
    - _Requirements: 1.1, 1.2, 3.1, 3.2, 3.3_

  - [x] 5.2 Integrate color service with UI
    - Load colors from file service on command initialization
    - Handle loading states and basic error scenarios
    - Display colors in list with proper formatting
    - _Requirements: 1.3, 1.4, 3.4_

  - [x] 5.3 Wire up copy actions to list items
    - Connect copy action to color selection in list
    - Implement action handlers for each color entry
    - Ensure proper RGB formatting and clipboard integration
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 6. Wire up complete application flow
  - Integrate all components together in main command
  - Test end-to-end color selection and copying workflow
  - Verify proper error handling and user feedback
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4_

- [x] 7. Add project assets and GitHub Actions CI
  - Add color palette icon for extension
  - Verify all Raycast manifest settings are correct
  - Create GitHub Actions workflow for lint/build/type-check
  - Configure ESLint and TypeScript compilation in CI
  - _Requirements: 5.1, 5.5, 6.1, 6.2, 6.3, 6.5_

- [x] 8. Implement color management functionality
  - [x] 8.1 Create color management service
    - Implement function to save colors to colors.json file
    - Add function to add new color entries
    - Add function to edit existing color entries
    - Add function to delete color entries
    - Ensure proper file system operations and error handling

  - [x] 8.2 Build color management UI components
    - Create form component for adding new colors
    - Create form component for editing existing colors
    - Add color picker or RGB input fields
    - Implement validation for color names and RGB values

  - [x] 8.3 Add color management actions to main list
    - Add "Add New Color" action accessible via Cmd+K
    - Add "Edit Color" action for each color item
    - Add "Delete Color" action for each color item
    - Implement proper action panel organization

  - [x] 8.4 Integrate color management with existing functionality
    - Update color service to reload colors after modifications
    - Ensure UI refreshes after color changes
    - Handle edge cases (empty color list, duplicate names)
    - Maintain proper state management

- [x] 9. Add comprehensive unit tests
  - [ ]* 9.1 Write color service tests
    - Test loadColors function with existing file
    - Test loadColors function with missing file (should create default)
    - Test saveColors function with valid data
    - Test saveColors function with invalid data
    - Test addColor function with valid color entry
    - Test addColor function with duplicate name
    - Test editColor function with existing color
    - Test editColor function with non-existent color
    - Test deleteColor function with existing color
    - Test deleteColor function with non-existent color
    - Test file system error handling (permissions, disk space)
    - _Requirements: 4.2, 4.3_

  - [ ]* 9.2 Write copy action tests
    - Test formatRgbString function with valid RGB values
    - Test formatRgbString function with edge case values (0, 255)
    - Test formatRgbString function with invalid values
    - Test copyColorToClipboard function integration
    - _Requirements: 2.2_

  - [ ]* 9.3 Write form validation tests
    - Test color name validation (empty, duplicate, special characters)
    - Test RGB value validation (range 0-255, non-numeric input)
    - Test form submission with valid data
    - Test form submission with invalid data
    - Test form reset functionality
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 9.4 Write UI component tests
    - Test AddColorForm component rendering
    - Test EditColorForm component rendering
    - Test color list rendering with empty data
    - Test color list rendering with multiple colors
    - Test action panel functionality
    - _Requirements: 1.1, 1.2, 3.1, 3.2, 3.3_

  - [ ]* 9.5 Write integration tests
    - Test complete add color workflow
    - Test complete edit color workflow
    - Test complete delete color workflow
    - Test complete copy color workflow
    - Test error handling across components
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4_

- [x] 10. Add hex color input functionality
  - [x] 10.1 Create color format conversion utilities
    - Implement hexToRgb function to convert #RRGGBB format to RGB values
    - Add support for 3-digit hex shorthand (#RGB to #RRGGBB)
    - Create isValidHex function for hex color validation
    - Add normalizeHex function to handle different hex input formats
    - _Requirements: 6.2, 6.3, 6.4, 6.5_

  - [x] 10.2 Update color input components with hex support
    - Add hex color input field to AddColorForm component
    - Add hex color input field to EditColorForm component
    - Implement real-time conversion from hex to RGB values
    - Update color preview to reflect hex input changes
    - _Requirements: 6.1, 6.4, 6.6_

  - [x] 10.3 Add hex input validation and error handling
    - Implement client-side validation for hex color format
    - Display error messages for invalid hex codes
    - Handle edge cases (empty input, partial hex codes)
    - Ensure proper form state management with hex input
    - _Requirements: 6.5_

  - [x] 10.4 Integrate hex input with existing color management
    - Update color service to handle hex-to-RGB conversion
    - Ensure hex input works with add/edit color workflows
    - Test integration with existing RGB input fields
    - Maintain backward compatibility with existing color data
    - _Requirements: 6.1, 6.4_

  - [x] 10.5 Implement real-time color preview in edit forms
    - Create ColorPreview component for displaying current color
    - Add color preview to EditColorForm component
    - Update preview immediately when RGB values change
    - Update preview immediately when hex values change
    - Ensure proper sizing and contrast for visual identification
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 11. Refactor codebase for better maintainability and extensibility
  - [x] 10.1 Reorganize file structure for scalability
    - Create dedicated directories: hooks/, utils/, constants/, validators/
    - Move color service to services/colorService/ directory
    - Create separate files for different service responsibilities
    - Organize components by feature (color-management/, color-display/)
    - Create shared utilities directory for common functions
    - _Requirements: 5.1, 5.2_

  - [x] 10.2 Extract and modularize business logic
    - Create separate validation utilities for color data
    - Extract file system operations into dedicated utility
    - Create color formatting utilities (RGB, hex, HSL support)
    - Implement error handling utilities with consistent error types
    - Create configuration constants file for default values
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 10.3 Implement custom hooks for state management
    - Create useColors hook for color data management
    - Create useColorValidation hook for form validation
    - Create useFileOperations hook for file system operations
    - Implement proper error state management in hooks
    - Add loading states and optimistic updates
    - _Requirements: 1.3, 1.4, 3.4_

  - [x] 10.4 Create reusable component architecture
    - Extract common form components (ColorInput, ValidationMessage)
    - Create reusable ColorPreview component
    - Implement ActionButton component for consistent actions
    - Create Modal/Dialog components for confirmations
    - Build ColorPicker component for better UX
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 10.5 Implement configuration and extensibility features
    - Create settings/preferences system for user customization
    - Add support for different color formats (hex, HSL, CMYK)
    - Implement color palette import/export functionality
    - Add keyboard shortcuts configuration
    - Create plugin architecture for future extensions
    - _Requirements: 2.1, 2.2, 5.3, 5.4_

  - [x] 10.6 Optimize performance and add caching
    - Implement color data caching to reduce file I/O
    - Add debouncing for search and filter operations
    - Optimize component re-renders with React.memo
    - Implement lazy loading for large color collections
    - Add background sync for color data updates
    - _Requirements: 1.1, 1.2, 4.2_

  - [x] 10.7 Enhance error handling and user experience
    - Create comprehensive error boundary components
    - Implement user-friendly error messages and recovery options
    - Add progress indicators for long-running operations
    - Create undo/redo functionality for color operations
    - Implement data backup and recovery mechanisms
    - _Requirements: 1.5, 2.3, 2.4, 3.4_

## Raycast Store Publication Steps

- [ ] 12. Prepare for Raycast Store publication
  - [ ] 12.1 Create Raycast developer account
    - Sign up at https://developers.raycast.com/
    - Complete developer profile setup
    - Verify email and account details

  - [ ] 12.2 Update extension metadata for publication
    - Replace "local-dev" author with actual Raycast username
    - Add proper extension description and keywords
    - Ensure icon meets Raycast Store requirements (512x512 PNG)
    - Add screenshots for store listing (1280x800 recommended)

  - [ ] 12.3 Validate extension for store submission
    - Run `npx ray lint` to ensure all validation passes
    - Test extension thoroughly in development mode
    - Verify all commands work as expected
    - Check extension follows Raycast design guidelines

  - [ ] 12.4 Submit extension to Raycast Store
    - Run `npx ray login` to authenticate with Raycast account
    - Use `npx ray publish` to submit extension for review
    - Fill out store listing information (description, categories, etc.)
    - Submit for Raycast team review

  - [ ] 12.5 Handle store review process
    - Respond to any feedback from Raycast review team
    - Make necessary changes if requested
    - Re-submit updated version if needed
    - Monitor review status and approval

  - [ ] 12.6 Post-publication maintenance
    - Monitor user feedback and ratings
    - Plan future feature updates based on user requests
    - Keep extension updated with latest Raycast API changes
    - Maintain compatibility with new Raycast versions

### Publication Requirements:
- Valid Raycast developer account
- Extension passes all lint checks
- Proper metadata and icon assets
- Thorough testing in development mode
- Compliance with Raycast Store guidelines
- Screenshots and store listing materials

### Useful Commands:
```bash
# Login to Raycast account
npx ray login

# Validate extension before submission
npx ray lint

# Publish to Raycast Store
npx ray publish

# Check current login status
npx ray profile
```