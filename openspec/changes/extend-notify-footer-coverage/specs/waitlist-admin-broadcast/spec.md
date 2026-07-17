## MODIFIED Requirements

### Requirement: The admin waitlist view supports segmentation

The admin waitlist page SHALL let an operator filter entries by course slug, by `intent`, and by `utm_campaign`, and SHALL display the distribution of `preferred_timeslot` across the filtered set. The existing CSV export SHALL remain available and SHALL respect the active filters.

The page SHALL show, for every listed entry, which entry point the visitor submitted from, derived from `source_page`. A surface may carry several entries whose capture rates the operator needs to compare, and an attribution the operator can only reach by downloading a file does not inform the decisions the page exists to support. The value SHALL be rendered as a human-readable label rather than the raw `source_page` string.

#### Scenario: Operator segments by intent

- **WHEN** the operator filters a course by `intent = 'date_conflict'`
- **THEN** only entries with that intent are listed, and the timeslot distribution reflects only those entries

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
