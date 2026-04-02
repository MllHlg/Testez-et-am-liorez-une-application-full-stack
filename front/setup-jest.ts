import {setupZoneTestEnv} from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

/* global mocks for jsdom */
const mock = () => {
  let storage: { [key: string]: string } = {};
  return {
    getItem: (key: string) => (key in storage ? storage[key] : null),
    setItem: (key: string, value: string) => (storage[key] = value || ''),
    removeItem: (key: string) => delete storage[key],
    clear: () => (storage = {}),
  };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance'],
});

Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

const originalConsoleError = console.error;
console.error = function (...args) {
  const isCssError = args.some((arg) => {
    if (!arg) return false;
    
    const argStr = arg.toString();
    const msgStr = arg.message || '';
    
    return (
      argStr.includes('Could not parse CSS stylesheet') ||
      msgStr.includes('Could not parse CSS stylesheet')
    );
  });

  if (isCssError) {
    return;
  }

  originalConsoleError(...args);
};

/* output shorter and more meaningful Zone error stack traces */
// Error.stackTraceLimit = 2;
