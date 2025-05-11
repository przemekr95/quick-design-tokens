import { prPhoto } from './pr-photo.js';
import { prDev } from './pr-dev.js';
import { prIskierka } from './pr-iskierka.js';
import { ThemeMap } from '../../types/tokens.js';

export const themes: ThemeMap = {
  'pr-photo': prPhoto,
  'pr-dev': prDev,
  'pr-iskierka': prIskierka,
};

export { prPhoto, prDev, prIskierka };
