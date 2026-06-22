import { useWindowDimensions } from 'react-native';

// Below this width the data tables would overflow their fixed min-width and force
// horizontal scrolling, so the table/row components render stacked cards instead.
// 768px (Tailwind md) keeps the widest table (~660px) fitting above the breakpoint.
export function useNarrow(breakpoint = 768) {
  return useWindowDimensions().width < breakpoint;
}
