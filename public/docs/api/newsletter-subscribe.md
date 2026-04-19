# /api/newsletter/subscribe

Subscribe an email address to solo.tw's newsletter.

## Request

```
POST https://www.solo.tw/api/newsletter/subscribe
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
- 409 — already subscribed.
- 429 — rate limit exceeded.

## Consent policy
- Never subscribe on behalf of a user without explicit, logged consent.
- A confirmation email may be sent; completion requires the user's action.
