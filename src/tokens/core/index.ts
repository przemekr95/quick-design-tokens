import { colors } from './colors.js';
import { typography } from './typography.js';
import { spacing, borderRadius, boxShadow } from './spacing.js';
import { DesignTokens, CoreTokens } from '../../types/tokens.js';

// Tworzymy obiekt globalnych tokenów
export const globalTokens: DesignTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  boxShadow,
};

// Export głównego obiektu coreTokens
export const coreTokens: CoreTokens = globalTokens;

// Eksportujemy poszczególne elementy
export { colors, typography, spacing, borderRadius, boxShadow };
