# /api/diagnosis/pdf

Generate a PDF copy of a completed solo.tw business diagnosis.

## Request

```
POST https://www.solo.tw/api/diagnosis/pdf
Content-Type: application/json

{ "resultId": "<uuid-from-diagnosis-submission>" }
```

No authentication required, but the `resultId` must have been issued by a prior diagnosis submission at https://www.solo.tw/diagnose.

## Response

```
200 OK
Content-Type: application/pdf
```

Binary PDF stream.

## Errors
- 400 — missing or malformed `resultId`.
- 404 — diagnosis not found or expired.
- 429 — rate limit exceeded.

## Usage notes
Always obtain explicit user consent before generating and forwarding a report on their behalf.
