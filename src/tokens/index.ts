import { globalTokens } from './global';
import { projectTokens, prPhotoTokens, prDevTokens } from './projects';
import { DesignTokensWithProjects } from '../types/tokens';

// Eksportujemy zarówno globalne tokeny, jak i tokeny projektów
export const tokens: DesignTokensWithProjects = {
  ...globalTokens,
  projects: projectTokens,
};

export { globalTokens, projectTokens, prPhotoTokens, prDevTokens };