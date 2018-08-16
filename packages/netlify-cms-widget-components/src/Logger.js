class Logger {
  constructor({ enabled, name, color }) {
    this.name = name;
    this.enabled = enabled;
    this.color = color;
  }

  log(...messages) {
    if (this.enabled) {
      console.log(`%c [DEBUG] ${this.name}`, `color: ${this.color}`, ...messages);
    }
  }
}

export const getLogger = (name, color = 'inherit') => {
  // @TODO need a better way of setting the debug value outside of modifying the root package.json scripts.
  const enabled = typeof process.env.DEBUG === 'undefined';
  return new Logger({
    name,
    enabled,
    color,
  });
};
