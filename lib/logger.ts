/**
 * Logger Utility for Wardaty App
 * Replaces console.log with proper logging that only works in development
 */

/* eslint-disable no-console */

/**
 * Check if we're in development mode
 */
const isDev = __DEV__;

/**
 * Logger utility with different log levels
 */
export const logger = {
  /**
   * Debug logs - only in development
   * Use for detailed debugging information
   */
  debug: (...args: any[]) => {
    if (isDev) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * Info logs - only in development
   * Use for general information
   */
  info: (...args: any[]) => {
    if (isDev) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * Warning logs - always shown
   * Use for potential issues
   */
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },

  /**
   * Error logs - always shown
   * Use for errors that need attention
   */
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },

  /**
   * Log user actions - only in development
   * Use for tracking user interactions
   */
  action: (action: string, data?: any) => {
    if (isDev) {
      console.log('[ACTION]', action, data || '');
    }
  },

  /**
   * Log API calls - only in development
   * Use for tracking network requests
   */
  api: (method: string, url: string, data?: any) => {
    if (isDev) {
      console.log(`[API] ${method} ${url}`, data || '');
    }
  },

  /**
   * Log navigation - only in development
   * Use for tracking screen navigation
   */
  nav: (screen: string, params?: any) => {
    if (isDev) {
      console.log('[NAV]', screen, params || '');
    }
  },
};

/**
 * Performance logger
 */
export const perfLogger = {
  /**
   * Start a performance timer
   */
  start: (label: string) => {
    if (isDev) {
      console.time(`[PERF] ${label}`);
    }
  },

  /**
   * End a performance timer
   */
  end: (label: string) => {
    if (isDev) {
      console.timeEnd(`[PERF] ${label}`);
    }
  },
};

/**
 * Default export
 */
export default logger;
