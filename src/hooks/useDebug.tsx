const Debug = {
  // biome-ignore lint/suspicious/noExplicitAny: 適切
  log: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log("🔍 [DEBUG]", ...args);
    }
  },
};

export default Debug;
