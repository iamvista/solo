## ADDED Requirements

### Requirement: A confirmation email is sent after a waitlist entry is captured

The system SHALL send a confirmation email to the submitted address once a waitlist row has been written. Delivery SHALL be best-effort: a failure to send SHALL be logged and SHALL NOT change the API response nor roll back the persisted row.

#### Scenario: Successful capture triggers a confirmation email

- **WHEN** a waitlist row is written for a new email address
- **THEN** a confirmation email addressed to that person is dispatched

#### Scenario: The email provider is unavailable

- **WHEN** the waitlist row is written but the email provider returns an error
- **THEN** the endpoint returns success, the row remains persisted, and the failure is logged

#### Scenario: A silently discarded bot submission sends no email

- **WHEN** a submission is discarded because the honeypot field was non-empty
- **THEN** no email is dispatched

### Requirement: Preference and unsubscribe links are authenticated by a signed token

The system SHALL address a waitlist row through a token of the form `base64url(id) + "." + base64url(HMAC_SHA256(WAITLIST_TOKEN_SECRET, id))`. A request SHALL be honoured only after the HMAC is verified against the decoded id. The secret SHALL be a dedicated `WAITLIST_TOKEN_SECRET` and SHALL NOT be the newsletter unsubscribe secret, so that a token issued by one system cannot act on the other.

#### Scenario: A tampered token is rejected

- **WHEN** any character of a token is altered and the token is presented to a preference or unsubscribe route
- **THEN** the route responds with HTTP 400 and renders a human-readable error page, and no row is modified

#### Scenario: A token signed with the newsletter secret is rejected

- **WHEN** a token signed with `NEWSLETTER_UNSUBSCRIBE_SECRET` is presented to a waitlist route
- **THEN** the route responds with HTTP 400 and no row is modified

### Requirement: The confirmation email collects a preferred timeslot through one-click links

The confirmation email SHALL present four links, one per allowed timeslot, each pointing at the preference route with the recipient's token and the corresponding slot. A GET on that route with a valid token and an allowed slot SHALL write `preferred_timeslot` and render a thank-you page. Repeated clicks SHALL overwrite the previously stored value.

The waitlist form itself SHALL NOT ask for the timeslot.

#### Scenario: Recipient picks a timeslot

- **WHEN** the recipient opens the preference link for `saturday` with a valid token
- **THEN** `preferred_timeslot` is set to `saturday` and a thank-you page is rendered

#### Scenario: Recipient changes their mind

- **GIVEN** a row with `preferred_timeslot = 'saturday'`
- **WHEN** the recipient opens the preference link for `sunday` with the same token
- **THEN** `preferred_timeslot` becomes `sunday`

#### Scenario: An unknown slot value is rejected

- **WHEN** the preference route receives a valid token and a slot outside the allowed set
- **THEN** the route responds with HTTP 400 and `preferred_timeslot` is unchanged

### Requirement: Unsubscribing requires an explicit second step

Because corporate mail security gateways prefetch links, a GET on the unsubscribe route SHALL only render a confirmation page and SHALL NOT modify any row. Writing `unsubscribed_at` SHALL happen only on a POST issued from that confirmation page.

#### Scenario: A mail scanner prefetches the unsubscribe link

- **WHEN** the unsubscribe route receives a GET with a valid token
- **THEN** a confirmation page is rendered and `unsubscribed_at` remains NULL

#### Scenario: The recipient confirms the unsubscribe

- **WHEN** the recipient submits the confirmation page and a POST carrying a valid token reaches the unsubscribe route
- **THEN** `unsubscribed_at` is set to the current timestamp and a completion page is rendered
