# /api/newsletter/unsubscribe

Unsubscribe an email address from solo.tw's newsletter.

## Request

```
POST https://www.solo.tw/api/newsletter/unsubscribe
Content-Type: application/json

{ "email": "user@example.com" }
```

No authentication required.

## Response

```
200 OK
{ "ok": true }
```

## Errors
- 400 — invalid email address.
- 404 — email not on the list.

## Consent policy
Only unsubscribe on explicit user request. Do not enumerate or probe the list.
