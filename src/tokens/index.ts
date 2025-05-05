import { prPhotoTokens } from './pr-photo';
import { prDevTokens } from './pr-dev';

export const projectTokens = {
  prPhoto: prPhotoTokens,
  prDev: prDevTokens,
};

export { prPhotoTokens, prDevTokens };

// 11. Główny index tokenów (src/tokens/index.ts)
import { globalTokens } from './global';
import { projectTokens } from './projects';
import { DesignTokensWithProjects } from '../types/tokens';

// Eksportujemy zarówno globalne tokeny, jak i tokeny projektów
export const tokens: DesignTokensWithProjects = {
  ...globalTokens,
  projects: projectTokens,
};

export { globalTokens, projectTokens };