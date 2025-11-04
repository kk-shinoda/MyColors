import { ColorEntry, RGB } from "../types";
import { ColorFormat } from "../constants/appConstants";

/**
 * Plugin interface for extending color functionality
 */
export interface ColorPlugin {
  name: string;
  version: string;
  description: string;
  
  // Color transformation functions
  transformColor?: (color: ColorEntry) => ColorEntry;
  formatColor?: (color: ColorEntry, format: ColorFormat) => string;
  
  // Custom actions
  customActions?: ColorAction[];
  
  // Validation functions
  validateColor?: (color: ColorEntry) => boolean;
  
  // Import/Export functions
  importColors?: (data: string) => ColorEntry[];
  exportColors?: (colors: ColorEntry[]) => string;
}

/**
 * Custom action interface for plugins
 */
export interface ColorAction {
  id: string;
  title: string;
  icon?: string;
  shortcut?: { modifiers: string[]; key: string };
  handler: (color: ColorEntry) => Promise<void> | void;
}

/**
 * Plugin registry for managing loaded plugins
 */
class PluginRegistry {
  private plugins: Map<string, ColorPlugin> = new Map();

  /**
   * Registers a plugin
   */
  register(plugin: ColorPlugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} is already registered`);
      return;
    }

    this.plugins.set(plugin.name, plugin);
    console.log(`Registered plugin: ${plugin.name} v${plugin.version}`);
  }

  /**
   * Unregisters a plugin
   */
  unregister(pluginName: string): void {
    if (this.plugins.delete(pluginName)) {
      console.log(`Unregistered plugin: ${pluginName}`);
    }
  }

  /**
   * Gets a registered plugin
   */
  getPlugin(pluginName: string): ColorPlugin | undefined {
    return this.plugins.get(pluginName);
  }

  /**
   * Gets all registered plugins
   */
  getAllPlugins(): ColorPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Gets all custom actions from all plugins
   */
  getAllCustomActions(): ColorAction[] {
    const actions: ColorAction[] = [];
    
    for (const plugin of this.plugins.values()) {
      if (plugin.customActions) {
        actions.push(...plugin.customActions);
      }
    }
    
    return actions;
  }

  /**
   * Applies color transformations from all plugins
   */
  transformColor(color: ColorEntry): ColorEntry {
    let transformedColor = color;
    
    for (const plugin of this.plugins.values()) {
      if (plugin.transformColor) {
        transformedColor = plugin.transformColor(transformedColor);
      }
    }
    
    return transformedColor;
  }

  /**
   * Validates color using all plugin validators
   */
  validateColor(color: ColorEntry): boolean {
    for (const plugin of this.plugins.values()) {
      if (plugin.validateColor && !plugin.validateColor(color)) {
        return false;
      }
    }
    
    return true;
  }
}

// Global plugin registry instance
export const pluginRegistry = new PluginRegistry();

/**
 * Example plugin: Color harmony generator
 */
export const colorHarmonyPlugin: ColorPlugin = {
  name: "color-harmony",
  version: "1.0.0",
  description: "Generates color harmonies (complementary, triadic, etc.)",
  
  customActions: [
    {
      id: "generate-complementary",
      title: "Generate Complementary Color",
      handler: async (color: ColorEntry) => {
        const { r, g, b } = color.rgb;
        const complementary: RGB = {
          r: 255 - r,
          g: 255 - g,
          b: 255 - b,
        };
        
        console.log(`Complementary color for ${color.name}:`, complementary);
        // Implementation would add the complementary color to the collection
      },
    },
  ],
};

/**
 * Example plugin: Color accessibility checker
 */
export const accessibilityPlugin: ColorPlugin = {
  name: "accessibility-checker",
  version: "1.0.0",
  description: "Checks color accessibility and contrast ratios",
  
  validateColor: (color: ColorEntry): boolean => {
    // Simple brightness check (real implementation would be more sophisticated)
    const { r, g, b } = color.rgb;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Warn if color is too dark or too light for accessibility
    if (brightness < 50 || brightness > 200) {
      console.warn(`Color ${color.name} may have accessibility issues`);
    }
    
    return true; // Don't block the color, just warn
  },
  
  customActions: [
    {
      id: "check-contrast",
      title: "Check Contrast Ratio",
      handler: async (color: ColorEntry) => {
        // Implementation would check contrast against common backgrounds
        console.log(`Checking contrast for ${color.name}`);
      },
    },
  ],
};

// Register example plugins
pluginRegistry.register(colorHarmonyPlugin);
pluginRegistry.register(accessibilityPlugin);