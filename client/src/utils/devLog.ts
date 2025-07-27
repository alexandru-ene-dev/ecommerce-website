type LogLevel = 'info' | 'warn' | 'error';

const logStyles: Record<LogLevel, string> = {
  info: 'color: blue',
  warn: 'color: orange',
  error: 'color: red; font-weight: bold'
};

export const devLog = (level: LogLevel, label: string, ...args: unknown[]) => {
  if (import.meta.env.MODE !== 'development') return;
  
  const style = logStyles[level];

  console.log(`%c[${level}]`, style, `[${label}]`, ...args);
};