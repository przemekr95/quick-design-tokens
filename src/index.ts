import { tokens, globalTokens, projectTokens } from './tokens';
import { colors, typography, spacing, borderRadius, boxShadow } from './tokens/global';
import { prPhotoTokens, prDevTokens } from './tokens/projects/index';

// Eksport domyślny - pełen zestaw tokenów
export default tokens;

// Eksport nazwany - poszczególne elementy
export {
  // Globalne tokeny
  globalTokens,
  colors,
  typography,
  spacing,
  borderRadius,
  boxShadow,
  
  // Tokeny projektów
  projectTokens,
  prPhotoTokens,
  prDevTokens,
};