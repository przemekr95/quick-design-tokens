import { prPhoto } from './pr-photo';
import { prDev } from './pr-dev';
import { ThemeMap } from '../../types/tokens';

// Mapa wszystkich motywów
export const themes: ThemeMap = {
  'pr-photo': prPhoto, // Zmienione klucze zgodnie z konwencją nazewnictwa
  'pr-dev': prDev,
};

// Eksport poszczególnych motywów
export { prPhoto, prDev };
