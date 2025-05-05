// Nie importujemy pełnego interfejsu ColorTokens - używamy częściowego nadpisania
// Pełny obiekt będzie połączony z globalTokens w pliku index.ts

export const colors = {
  primary: '#0066cc', // Nadpisuje globalny token
  secondary: '#ff9900', // Nadpisuje globalny token
  accent: '#ff5500', // Dodatkowy kolor specyficzny dla projektu
};