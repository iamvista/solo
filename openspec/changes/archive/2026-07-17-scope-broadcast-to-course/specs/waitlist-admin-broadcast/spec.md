## MODIFIED Requirements

### Requirement: The admin waitlist view supports segmentation

The admin waitlist page SHALL let an operator filter entries by course slug, by `intent`, and by `utm_campaign`, and SHALL display the distribution of `preferred_timeslot` across the filtered set. The existing CSV export SHALL remain available and SHALL respect the active filters.

The course filter SHALL be offered as a control on the page itself. A filter reachable only by hand-editing the query string is not available to the operator in any practical sense, and the course filter gates the broadcast's blast radius.

The page SHALL show, for every listed entry, which entry point the visitor submitted from, derived from `source_page`. A surface may carry several entries whose capture rates the operator needs to compare, and an attribution the operator can only reach by downloading a file does not inform the decisions the page exists to support. The value SHALL be rendered as a human-readable label rather than the raw `source_page` string.

#### Scenario: Operator segments by intent

- **WHEN** the operator filters a course by `intent = 'date_conflict'`
- **THEN** only entries with that intent are listed, and the timeslot distribution reflects only those entries

#### Scenario: Operator segments by course from the page

- **WHEN** the operator picks a course from the page's course control
- **THEN** only that course's entries are listed, and the CSV export returns exactly those entries

#### Scenario: Export honours the active filters

- **WHEN** the operator exports CSV while a filter is active
- **THEN** the exported rows are exactly the rows currently listed

#### Scenario: The originating entry is visible without exporting

- **WHEN** the operator views entries captured from a course sales page's footer block and from the link below its enrolment action
- **THEN** each row states which of the two it came from, without the operator exporting CSV or querying the database

##### Example: source_page rendered as a label

| Stored `source_page`                  | Label shown          |
| ------------------------------------- | -------------------- |
| `/courses/ai-academic-writing#footer` | 頁尾               |
| `/courses/ai-academic-writing`        | 報名按鈕下方       |
| `/courses/ai-content/notify`          | 廣告落地頁         |
| `/teachers/vista`                     | 講師頁             |

### Requirement: Cohort announcements are broadcast manually

The system SHALL let an operator select a filtered set of waitlist entries, supply the new cohort date and its enrolment link, and dispatch an announcement email to that set. The system SHALL NOT schedule, automate, or otherwise trigger this broadcast without an operator action. The cohort date and enrolment link SHALL be supplied at broadcast time and SHALL NOT be read from the workshop catalogue.

A broadcast SHALL be confined to exactly one course. The system SHALL reject a broadcast request whose filters do not name a course, and SHALL NOT offer the operator a way to dispatch one. An announcement carries a single cohort date and a single enrolment link, while each recipient's email is titled with that recipient's own course: dispatched across courses, every recipient outside the intended course receives their own course's name attached to another course's date and link. The rejection is the guard; a course control alone would leave the unfiltered dispatch one click away.

#### Scenario: Operator broadcasts to one course's segment

- **WHEN** the operator selects a single course, supplies a cohort date and enrolment link, and confirms the send
- **THEN** an announcement email carrying that date and link is dispatched to each recipient in that course's filtered set

#### Scenario: A broadcast without a course is refused

- **WHEN** a broadcast request arrives whose filters name no course
- **THEN** the request is rejected, no email is dispatched, and the operator is told the course must be chosen first

#### Scenario: The interface offers no unscoped dispatch

- **WHEN** the operator views the broadcast control with no course selected
- **THEN** dispatch is unavailable and the reason is stated

#### Scenario: No automated trigger exists

- **WHEN** a new cohort is added to the workshop catalogue
- **THEN** no announcement is dispatched until an operator explicitly broadcasts one
