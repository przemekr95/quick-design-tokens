import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, boxShadow } from './spacing';
import { DesignTokens, CoreTokens } from '../../types/tokens';

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
