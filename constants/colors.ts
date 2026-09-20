/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#241521',
    tint: '#ec6f68',
    background: '#fff8f3',
    foreground: '#241521',
    card: '#ffffff',
    cardForeground: '#241521',
    primary: '#ec6f68',
    primaryForeground: '#ffffff',
    secondary: '#f7e4dc',
    secondaryForeground: '#5c3040',
    muted: '#f3e7e1',
    mutedForeground: '#8f7379',
    accent: '#f2b35f',
    accentForeground: '#4a2a19',
    destructive: '#c94e5c',
    destructiveForeground: '#ffffff',
    border: '#ead8d2',
    input: '#e3ccc6',
    plum: '#482538',
    cream: '#fff8f3',
    blush: '#fde1db',
    mint: '#d8eee4',
  },
  dark: {
    text: '#fff8f3',
    tint: '#ff8c82',
    background: '#241521',
    foreground: '#fff8f3',
    card: '#382332',
    cardForeground: '#fff8f3',
    primary: '#ff8c82',
    primaryForeground: '#241521',
    secondary: '#593447',
    secondaryForeground: '#fff1e9',
    muted: '#432b3b',
    mutedForeground: '#d1aeb2',
    accent: '#f7bd70',
    accentForeground: '#382332',
    destructive: '#ff7b87',
    destructiveForeground: '#241521',
    border: '#634052',
    input: '#634052',
    plum: '#fff8f3',
    cream: '#241521',
    blush: '#593447',
    mint: '#31584f',
  },
  radius: 18,
};

export default colors;
