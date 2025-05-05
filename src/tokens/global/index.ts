import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, boxShadow } from './spacing';
import { DesignTokens } from '../../types/tokens';

// Tworzymy obiekt globalnych tokenów
export const globalTokens: DesignTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  boxShadow,
};

// Eksportujemy poszczególne elementy
export { colors, typography, spacing, borderRadius, boxShadow };
