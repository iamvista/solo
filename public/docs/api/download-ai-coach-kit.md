# /api/download/ai-coach-kit

Request a download of the AI Coach Kit starter bundle.

## Request

```
POST https://www.solo.tw/api/download/ai-coach-kit
Content-Type: application/json

{ "email": "user@example.com" }
```

No authentication required. Email required for download delivery.

## Response

```
200 OK
{ "ok": true }
```

A download link is emailed to the provided address.

## Errors
- 400 — invalid email.
- 429 — rate limit exceeded.

## Consent policy
Only trigger this on explicit user request. The email may be added to a related newsletter or nurture list per solo.tw's privacy policy.

## Product page
https://www.solo.tw/products/ai-coach-kit
