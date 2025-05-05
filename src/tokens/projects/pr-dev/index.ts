import { colors } from './colors';
import { globalTokens } from '../../global';
import { DesignTokens } from '../../../types/tokens';

// Głębokie łączenie obiektów
import merge from 'lodash.merge';

// Tworzymy tokeny projektu, nadpisując globalne wartości
export const prDevTokens: DesignTokens = merge({}, globalTokens, {
  colors,
  // Można dodać inne nadpisane tokeny specyficzne dla projektu
});