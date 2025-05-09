import { prPhoto } from './pr-photo.js';
import { prDev } from './pr-dev.js';
import { ThemeMap } from '../../types/tokens.js';

// Mapa wszystkich motywów
export const themes: ThemeMap = {
  'pr-photo': prPhoto, // Zmienione klucze zgodnie z konwencją nazewnictwa
  'pr-dev': prDev,
};

// Eksport poszczególnych motywów
export { prPhoto, prDev };