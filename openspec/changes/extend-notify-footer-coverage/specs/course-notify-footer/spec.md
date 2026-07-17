## MODIFIED Requirements

### Requirement: The footer entry derives its intent from course status

The footer entry SHALL derive the submitted `intent` from the course status, using the same mapping as the entry below the enrolment action: status `full` SHALL derive `full_waitlist`, and every other status SHALL derive `date_conflict`.

The form's heading and submit label SHALL reflect the derived intent.

The block's own prompt SHALL reflect the course status more finely than the intent does, because one prompt cannot honestly serve every status the `date_conflict` intent covers. A course whose date is not yet announced SHALL NOT be described as having a date the visitor cannot attend. Three prompts SHALL therefore be distinguished: a full course, a course whose date is unannounced, and a course whose date is set but does not suit the visitor.

#### Scenario: A full course derives waitlist intent

- **WHEN** the footer entry renders for a course with status `full`
- **THEN** the submitted `intent` is `full_waitlist`, the form is headed and labelled as joining the waitlist, and the block's prompt asks whether the cohort is already full

#### Scenario: A course with a date the visitor cannot attend derives conflict intent

- **WHEN** the footer entry renders for a course with status `open`, `filling`, or `ended`
- **THEN** the submitted `intent` is `date_conflict`, the form is headed and labelled as a next-cohort notification, and the block's prompt asks whether the cohort's date does not suit the visitor

#### Scenario: A course with no announced date is not described as a date conflict

- **WHEN** the footer entry renders for a course with status `coming_soon`
- **THEN** the submitted `intent` is `date_conflict`, and the block's prompt offers to notify the visitor once a date is announced rather than asking whether the date suits them

##### Example: intent and prompt derived per status

| Course status | Derived intent  | Form framing             | Block prompt        |
| ------------- | --------------- | ------------------------ | ------------------- |
| `full`        | `full_waitlist` | joining the waitlist     | cohort already full |
| `open`        | `date_conflict` | next-cohort notification | date does not suit  |
| `filling`     | `date_conflict` | next-cohort notification | date does not suit  |
| `coming_soon` | `date_conflict` | next-cohort notification | date unannounced    |
| `ended`       | `date_conflict` | next-cohort notification | date does not suit  |
