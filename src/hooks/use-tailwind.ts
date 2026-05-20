import { useColorScheme } from 'react-native';

export function useTailwindColors() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return {
    isDark,
    bg: isDark ? 'bg-dark-bg' : 'bg-light-bg',
    text: isDark ? 'text-dark-text' : 'text-light-text',
    element: isDark ? 'bg-dark-element' : 'bg-light-element',
    border: isDark ? 'border-dark-element' : 'border-light-element',
    input: isDark
      ? 'bg-dark-element text-dark-text border-primary-500'
      : 'bg-light-element text-light-text border-primary-500',
  };
}
