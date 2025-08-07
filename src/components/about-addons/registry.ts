import type { ComponentType } from 'react';
import type { AddonCommonProps } from './types';

// Central registry for About page addons.
// Register new addons by adding an entry mapping the key used in MDX frontmatter
// to a dynamic import of the component implementing that addon.
// Example:
//  export const addonImportMap = {
//    basketball: () => import('./basketball/BasketballAddon'),
//    keyboard: () => import('./keyboard/KeyboardAddon'),
//  };

export const addonImportMap: Record<string, () => Promise<{ default: ComponentType<AddonCommonProps> }>> = {
  // Initially empty; add entries above when addons are created.
  keyboard: () => import('./keyboard/KeyboardAddon'),
  basketball: () => import('./basketball/BasketballAddon'),
};


