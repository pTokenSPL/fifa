export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  private static instance: Logger;
  private level: LogLevel = 'info';

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const order: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return order.indexOf(level) >= order.indexOf(this.level);
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      console.log(`[DEBUG][wc2026-sdk] ${new Date().toISOString()} ${message}`, data ?? '');
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog('info')) {
      console.log(`[INFO][wc2026-sdk] ${new Date().toISOString()} ${message}`, data ?? '');
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN][wc2026-sdk] ${new Date().toISOString()} ${message}`, data ?? '');
    }
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR][wc2026-sdk] ${new Date().toISOString()} ${message}`, error ?? '');
    }
  }
}
