import 'react';
import '@types/react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// react-dom 타입 정의
declare module 'react-dom' {
  function flushSync<R>(fn: () => R): R;
}

// next-themes 타입 정의
declare module 'next-themes' {
  export interface ThemeProviderProps {
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    children?: React.ReactNode;
  }
  
  export function useTheme(): {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    resolvedTheme: string | undefined;
    themes: string[];
  };
  
  export const ThemeProvider: React.FC<ThemeProviderProps>;
}

interface Window {
  gtag: (command: string, targetId: string, config?: Record<string, any>) => void
}

