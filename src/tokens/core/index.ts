import { colors } from './colors.js';
import { typography } from './typography.js';
import { spacing, borderRadius, boxShadow } from './spacing.js';
import { DesignTokens, CoreTokens } from '../../types/tokens.js';

export const globalTokens: DesignTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  boxShadow,
};

export const coreTokens: CoreTokens = globalTokens;

export { colors, typography, spacing, borderRadius, boxShadow };
