export const lightTokens = {
  bg: '#ECE7DA', surface: '#FBF9F2', sidebar: '#0E2E27', ink: '#13352C',
  brand: '#13352C', accent: '#1E6F5C', text: '#23291F', muted: '#71776A',
  border: '#DED8C8', ok: '#1E6F5C', warn: '#C67A1E', bad: '#B5462F',
} as const;

export const darkTokens = {
  bg: '#0E1A16', surface: '#15231E', sidebar: '#0A1310', ink: '#E4EDE7',
  brand: '#16463A', accent: '#2E8B72', text: '#E7EFE9', muted: '#8DA098',
  border: '#2A3A32', ok: '#5FB89F', warn: '#E0A85A', bad: '#E0846A',
} as const;

export type ThemeTokens = typeof lightTokens;
