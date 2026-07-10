## ADDED Requirements

### Requirement: The admin waitlist view supports segmentation

The admin waitlist page SHALL let an operator filter entries by course slug, by `intent`, and by `utm_campaign`, and SHALL display the distribution of `preferred_timeslot` across the filtered set. The existing CSV export SHALL remain available and SHALL respect the active filters.

#### Scenario: Operator segments by intent

- **WHEN** the operator filters a course by `intent = 'date_conflict'`
- **THEN** only entries with that intent are listed, and the timeslot distribution reflects only those entries

#### Scenario: Export honours the active filters

- **WHEN** the operator exports CSV while a filter is active
- **THEN** the exported rows are exactly the rows currently listed

### Requirement: Cohort announcements are broadcast manually

The system SHALL let an operator select a filtered set of waitlist entries, supply the new cohort date and its enrolment link, and dispatch an announcement email to that set. The system SHALL NOT schedule, automate, or otherwise trigger this broadcast without an operator action. The cohort date and enrolment link SHALL be supplied at broadcast time and SHALL NOT be read from the workshop catalogue.

#### Scenario: Operator broadcasts to a segment

- **WHEN** the operator selects a filtered set, supplies a cohort date and enrolment link, and confirms the send
- **THEN** an announcement email carrying that date and link is dispatched to each recipient in the set

#### Scenario: No automated trigger exists

- **WHEN** a new cohort is added to the workshop catalogue
- **THEN** no announcement is dispatched until an operator explicitly broadcasts one

### Requirement: Broadcasts exclude unsubscribed recipients

The recipient set for a broadcast SHALL exclude every entry whose `unsubscribed_at` is not NULL, regardless of the active filters.

#### Scenario: An unsubscribed entry matches the filter

- **GIVEN** an entry matching the active filter whose `unsubscribed_at` is set
- **WHEN** the operator broadcasts to that filter
- **THEN** that entry receives no email and is excluded from the recipient count

### Requirement: A broadcast requires an explicit confirmation of its blast radius

Before dispatching, the system SHALL display the exact number of recipients and SHALL require a second, explicit confirmation from the operator. The displayed count SHALL equal the number of entries matching the active filters with `unsubscribed_at IS NULL`.

#### Scenario: Operator sees the recipient count before sending

- **WHEN** the operator requests a broadcast
- **THEN** the interface states how many people will receive the email and waits for a second confirmation before dispatching

#### Scenario: Operator abandons the confirmation

- **WHEN** the operator requests a broadcast and does not confirm
- **THEN** no email is dispatched and no `notified_at` value is written

### Requirement: Broadcast outcomes are recorded and partial failures are surfaced

The email provider's batch API reports success and failure per batch, not per recipient. The system SHALL therefore dispatch recipients in batches and SHALL write `notified_at` only for the recipients of batches that were dispatched without error. It SHALL report the number of successful and failed deliveries to the operator so that the remaining recipients can be retried.

A batch SHALL contain at most 100 recipients, which is the provider's documented ceiling.

#### Scenario: One batch fails while others succeed

- **GIVEN** a broadcast to 250 recipients, dispatched as batches of 100, 100, and 50, where the second batch fails
- **WHEN** the broadcast completes
- **THEN** the 150 recipients of the first and third batches have a refreshed `notified_at`, the 100 recipients of the failed batch retain their previous `notified_at`, and the operator is shown 150 succeeded and 100 failed

#### Scenario: Operator retries the failed remainder

- **WHEN** the operator broadcasts again to the same filter after a partial failure
- **THEN** the previously failed recipients receive the email and their `notified_at` is written

#### Scenario: A recipient never receives two copies from one broadcast

- **WHEN** a broadcast dispatches
- **THEN** each recipient in the set appears in exactly one batch
