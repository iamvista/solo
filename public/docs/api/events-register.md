# /api/events/register

Register a user for a published solo.tw event.

## Request

```
POST https://www.solo.tw/api/events/register
Content-Type: application/json

{
  "eventId": "<uuid>",
  "email": "user@example.com",
  "name": "User Name"
}
```

No authentication required.

## Response

```
200 OK
{ "ok": true, "registrationId": "<uuid>" }
```

## Errors
- 400 — missing fields or invalid email.
- 404 — event not found or not open.
- 409 — already registered.
- 410 — registration closed or event full.

## Consent policy
Only register with explicit user consent. Forwarding a confirmation email and calendar invite is the event owner's responsibility.

## Discovery
List published events at https://www.solo.tw/events.
