/**
 * Locale-safe formatting — fixes hydration mismatch
 * Server (Node) uses en-US by default, client in India uses en-IN (8,60,000 vs 860,000)
 * Always format with explicit 'en-US' to keep SSR === CSR
 */
export const fmtNumber = (n: number) => n.toLocaleString('en-US');
export const fmtCurrency = (n: number) => n.toLocaleString('en-US');
