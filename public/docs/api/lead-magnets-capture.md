# /api/lead-magnets/capture

Capture an email in exchange for a lead magnet (downloadable resource).

## Request

```
POST https://www.solo.tw/api/lead-magnets/capture
Content-Type: application/json

{
  "magnetId": "<slug-or-uuid>",
  "email": "user@example.com"
}
```

No authentication required.

## Response

```
200 OK
{ "ok": true, "deliveryUrl": "<signed-url>" }
```

The `deliveryUrl` may be single-use and time-limited; send it to the user promptly.

## Errors
- 400 — invalid email or unknown magnet.
- 429 — rate limit exceeded.

## Consent policy
Only capture a lead with explicit user consent. The captured email may be added to a lead-nurture list per solo.tw's privacy policy.
