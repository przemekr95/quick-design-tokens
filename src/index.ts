import { tokens, globalTokens, projectTokens, coreTokens } from './tokens/index.js';
import { colors, typography, spacing, borderRadius, boxShadow } from './tokens/core/index.js';
import { prPhoto, prDev } from './tokens/themes/index.js';

// Eksport domyślny - pełen zestaw tokenów
export default tokens;

// Eksport nazwany - poszczególne elementy
export {
  // Tokeny rdzeniowe
  coreTokens,
  
  // Globalne tokeny
  globalTokens,
  colors,
  typography,
  spacing,
  borderRadius,
  boxShadow,
  
  // Tokeny projektów
  projectTokens,
  prPhoto,
  prDev
};
