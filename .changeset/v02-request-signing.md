---
"@resciencelab/dap": minor
---

feat: AgentWorld HTTP request signing with X-AgentWorld-* headers

Outbound HTTP requests include X-AgentWorld-* headers with method/path/authority/Content-Digest binding for cross-endpoint replay resistance. Header signatures are required — no legacy body-only fallback.
