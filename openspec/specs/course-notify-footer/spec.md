# course-notify-footer Specification

## Purpose

TBD - created by archiving change 'add-course-notify-footer'. Update Purpose after archive.

## Requirements

### Requirement: Course sales pages expose a footer notification block

A course sales page SHALL offer a second notification entry at the foot of the page, after the page's closing content, in addition to the secondary entry placed below the enrolment action.

The footer entry SHALL present its form already expanded, without requiring the visitor to activate a link first. The footer entry sits a full page of content away from the enrolment action and therefore SHALL NOT be treated as competing with it.

The footer entry SHALL be mounted by passing only a course slug. All course data the entry needs SHALL be resolved from the `workshops` source, so that a sales page never hard-codes course title, status, or instructor.

#### Scenario: A sales page with seats renders an expanded footer form

- **WHEN** a course sales page renders for a course with status `open` or `filling`
- **THEN** the enrolment action remains the page's only primary action, and a footer block presents the notification form already expanded

#### Scenario: The footer entry resolves course data from the shared source

- **WHEN** the footer entry is mounted with only a course slug
- **THEN** the rendered heading names the course title resolved from the `workshops` source rather than a value supplied by the page

---
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

---
### Requirement: The footer entry is attributable separately from the entry above it

The footer entry SHALL submit a `source_page` that distinguishes it from the entry below the enrolment action on the same page, so that the two entries' capture rates can be compared without inspecting anything other than stored rows.

The footer entry SHALL submit `/courses/<slug>#footer`. The entry below the enrolment action SHALL continue to submit `/courses/<slug>`.

#### Scenario: A footer submission is distinguishable from an above-the-fold submission

- **WHEN** a visitor submits the notification form from the footer block of a course sales page
- **THEN** the stored `source_page` identifies the footer entry and differs from the value stored for a submission made from the entry below the enrolment action on the same page

##### Example: source_page per entry on the ai-academic-writing sales page

| Entry                        | Stored `source_page`                    |
| ---------------------------- | --------------------------------------- |
| Below the enrolment action   | `/courses/ai-academic-writing`          |
| Footer block                 | `/courses/ai-academic-writing#footer`   |

---
### Requirement: An unresolvable course slug fails loudly in development and degrades silently in production

When the footer entry is mounted with a slug that does not resolve to a course, it SHALL raise an error in a development environment, so that a sales page cannot ship an entry that renders nothing.

In a production environment the same condition SHALL render nothing rather than break the page.

#### Scenario: An unknown slug raises in development

- **WHEN** the footer entry is mounted in a development environment with a slug that resolves to no course
- **THEN** an error is raised identifying the unresolvable slug

#### Scenario: An unknown slug degrades in production

- **WHEN** the footer entry is mounted in a production environment with a slug that resolves to no course
- **THEN** the entry renders nothing and the surrounding page renders normally
