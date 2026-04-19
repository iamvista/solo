# /api/username/check

Check whether a requested username is available for sign-up.

## Request

```
GET https://www.solo.tw/api/username/check?username=<candidate>
```

No authentication required.

## Response

```
200 OK
{ "available": true, "username": "candidate" }
```

## Errors
- 400 — missing or malformed `username` parameter.
- 429 — rate limit exceeded.

## Usage notes
- Names are validated against a reserved-word list and format rules.
- Do not use this endpoint to enumerate existing accounts.
