## ADDED Requirements

### Requirement: Waitlist entries record the visitor's intent

The system SHALL store an `intent` value on every `course_waitlist` row, constrained to `full_waitlist`, `date_conflict`, or `ad_lead`. The column SHALL default to `full_waitlist` so that rows created before this change are classified correctly without a backfill script.

The `intent` SHALL be derived from context by the server, never chosen by the visitor.

#### Scenario: Intent is derived from course status

- **WHEN** a visitor submits the waitlist form from a course card
- **THEN** the system stores `full_waitlist` if the course status is `full`, and `date_conflict` for any other course status

##### Example: status to intent mapping

| Course status | Stored intent   | Notes                          |
| ------------- | --------------- | ------------------------------ |
| `full`        | `full_waitlist` | no seats left, classic waitlist |
| `open`        | `date_conflict` | seats left, date does not suit  |
| `filling`     | `date_conflict` | seats left, date does not suit  |
| `coming_soon` | `date_conflict` | not yet schedulable             |
| `ended`       | `date_conflict` | wants the next cohort           |

#### Scenario: Existing rows are classified on migration

- **WHEN** the migration adding `intent` is applied to a table containing rows created before this change
- **THEN** every pre-existing row has `intent = 'full_waitlist'` and the total row count is unchanged

#### Scenario: Landing page submissions are marked as ad leads

- **WHEN** a visitor submits the form on the course notify landing page
- **THEN** the system stores `intent = 'ad_lead'`

### Requirement: Waitlist entries preserve advertising attribution

The system SHALL persist `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content` on the waitlist row when those parameters are present in the submitting page's query string. Each column SHALL be nullable.

#### Scenario: UTM parameters are captured

- **WHEN** a visitor arrives at a notify landing page carrying `utm_source=facebook&utm_medium=paid&utm_campaign=aiaw-phase1&utm_content=variant-b` and submits the form
- **THEN** those four values are stored on the created row

#### Scenario: Missing UTM parameters are tolerated

- **WHEN** a visitor submits the form from a page with no UTM parameters
- **THEN** the row is created with all four UTM columns set to NULL and no error is raised

### Requirement: Repeat submissions preserve the earliest intent and first-touch attribution

The table SHALL retain its `UNIQUE (course_slug, email)` constraint. On conflict the system SHALL NOT overwrite `intent`. It SHALL write each `utm_*` column only when the stored value is NULL. It SHALL overwrite `name` and `phone` with the newly submitted values, and SHALL set `updated_at` to the current timestamp.

#### Scenario: A known person arriving via an ad keeps their original intent

- **WHEN** an email already stored for a course with `intent = 'date_conflict'` is submitted again with `intent = 'ad_lead'`
- **THEN** the stored `intent` remains `date_conflict`

##### Example: conflict resolution field by field

- **GIVEN** an existing row with `intent='date_conflict'`, `name='王小明'`, `phone=NULL`, `utm_campaign=NULL`
- **WHEN** the same `(course_slug, email)` is submitted with `intent='ad_lead'`, `name='王小明 '`, `phone='+886912345678'`, `utm_campaign='aiaw-phase1'`
- **THEN** the row holds `intent='date_conflict'`, `name='王小明'`, `phone='+886912345678'`, `utm_campaign='aiaw-phase1'`, and a refreshed `updated_at`

#### Scenario: First-touch attribution is not overwritten

- **GIVEN** an existing row with `utm_campaign='spring-launch'`
- **WHEN** the same `(course_slug, email)` is submitted with `utm_campaign='summer-launch'`
- **THEN** the stored `utm_campaign` remains `spring-launch`

### Requirement: Waitlist rows carry scheduling preference and lifecycle timestamps

The system SHALL provide nullable `preferred_timeslot`, `notified_at`, and `unsubscribed_at` columns, plus a non-null `updated_at` defaulting to the current timestamp. `preferred_timeslot` SHALL be constrained to `weekday_evening`, `saturday`, `sunday`, or `any`.

#### Scenario: A new row starts with empty lifecycle state

- **WHEN** a waitlist row is created
- **THEN** `preferred_timeslot`, `notified_at`, and `unsubscribed_at` are NULL and `updated_at` is set

### Requirement: Every course surface exposes an entry to the notification list

Every surface that presents a course to a visitor SHALL offer a way to join the notification list, in every course status, not only when the course is full. Those surfaces are the course sales pages and the course cards on instructor pages.

The entry SHALL be provided by a single shared component so that its behaviour cannot diverge between surfaces. When the course is full the entry SHALL be the surface's primary action. When the course still has seats the entry SHALL be a secondary text link placed below the enrolment action, and the form SHALL appear only after that link is activated, so that the enrolment action remains the sole primary action.

The form's heading and submit label SHALL reflect the derived intent. The submitted `source_page` SHALL identify the surface the visitor came from.

#### Scenario: A sales page with seats offers a secondary entry

- **WHEN** a course sales page renders for a course with status `open` or `filling`
- **THEN** the enrolment action remains the only primary action, and a secondary text link offers to notify the visitor about the next cohort

#### Scenario: The form is revealed on demand

- **WHEN** a visitor activates the secondary link on a course that still has seats
- **THEN** the waitlist form is revealed, headed and labelled as a next-cohort notification rather than as a waitlist

#### Scenario: A full course promotes the entry

- **WHEN** a course surface renders with status `full`
- **THEN** the waitlist form is the surface's primary action, headed and labelled as joining the waitlist

#### Scenario: The originating surface is recorded

- **WHEN** a visitor submits the form from a course sales page
- **THEN** the stored `source_page` identifies that sales page rather than an instructor page

### Requirement: The capture endpoint rejects bot submissions silently

The waitlist capture endpoint SHALL accept a honeypot field that legitimate forms leave empty. When that field is non-empty the endpoint SHALL return the same success response shape as a real submission and SHALL NOT write any row.

#### Scenario: Bot fills the hidden field

- **WHEN** a request arrives with a non-empty honeypot field
- **THEN** the endpoint returns HTTP 200 with the normal success body and no row is inserted

#### Scenario: Human leaves the hidden field empty

- **WHEN** a request arrives with an absent or empty honeypot field and otherwise valid data
- **THEN** the row is written normally

### Requirement: The capture endpoint retains its existing protections and side effects

The endpoint SHALL keep its current IP-based rate limit and payload validation. It SHALL continue to synchronise an entry into `newsletter_subscribers` on a best-effort basis, tagged `waitlist:<course_slug>`, and a failure of that synchronisation SHALL NOT fail the request.

#### Scenario: Rate limit is exceeded

- **WHEN** a single IP exceeds the configured request rate
- **THEN** the endpoint returns HTTP 429 and no row is written

#### Scenario: Newsletter synchronisation fails

- **WHEN** the waitlist row is written successfully but the newsletter synchronisation raises an error
- **THEN** the endpoint returns success and the waitlist row remains persisted
