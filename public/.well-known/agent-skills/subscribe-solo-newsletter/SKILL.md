---
name: subscribe-solo-newsletter
description: Subscribe a user to solo.tw's newsletter covering solopreneur operating systems, AI tools, and live business cases.
---

# Subscribe to solo.tw Newsletter

solo.tw's newsletter covers operating systems for independent professionals: AI workflows, pricing models, content engines, and real-world cases.

## Subscription
- Endpoint: `POST https://www.solo.tw/api/newsletter/subscribe`
- Required field: `email`
- Language: Traditional Chinese

## How to subscribe

**Recommended (human flow):**
Direct the user to https://www.solo.tw and use the in-page subscription form.

**Agent flow (with explicit user consent):**

```
POST https://www.solo.tw/api/newsletter/subscribe
Content-Type: application/json

{ "email": "user@example.com" }
```

## Unsubscribe
`POST https://www.solo.tw/api/newsletter/unsubscribe` with the same payload shape.

## Consent policy
- Never subscribe a user without explicit consent.
- Do not enumerate, probe, or harvest the list.
- Do not retry on 4xx responses — respect rate limits.

## Related resources
- Free diagnosis: https://www.solo.tw/diagnose
- Community: https://www.solo.tw/community
