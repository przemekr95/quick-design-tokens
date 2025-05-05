import tokens, { colors, prPhotoTokens } from './dist/esm/index.js';
import { generateCSSVariables } from './dist/esm/css/index.js';

// Wyświetl globalne tokeny
console.log('Globalne tokeny kolorów:', colors);

// Wyświetl tokeny projektu fotograficznego
console.log('Projekt Photo - kolory:', prPhotoTokens.colors);

// Wygeneruj CSS ze zmiennymi
const cssVariables = generateCSSVariables();
console.log('Wygenerowane zmienne CSS:');
console.log(cssVariables);

// Sprawdź, czy nadpisanie tokenów działa poprawnie
console.log('Globalny kolor primary:', colors.primary);
console.log('Kolor primary w projekcie Photo:', prPhotoTokens.colors.primary);
