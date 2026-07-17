## MODIFIED Requirements

### Requirement: Every course surface exposes an entry to the notification list

Every surface that presents a course to a visitor SHALL offer a way to join the notification list, in every course status, not only when the course is full. Those surfaces are the course sales pages and the course cards on instructor pages.

This requirement SHALL apply only to courses present in the `workshops` source. A page for a course absent from that source SHALL NOT carry an entry: the system cannot resolve such a course's title or status, so any entry there could not function, and an entry that cannot function is worse than none: it renders nothing while the page appears to offer the feature, and the visitors it loses leave no trace.

A surface MAY carry more than one entry. Every entry SHALL be composed from the same shared form component and SHALL resolve its course data from the same shared course lookup, so that entry behaviour cannot diverge between surfaces or between entries on one surface.

The entry placed below the enrolment action SHALL behave as follows: when the course is full it SHALL be the surface's primary action; when the course still has seats it SHALL be a secondary text link, and its form SHALL appear only after that link is activated, so that the enrolment action remains the sole primary action.

An entry separated from the enrolment action by the surface's own content, such as an entry at the foot of a sales page, SHALL NOT be treated as competing with the enrolment action, and MAY present its form already expanded.

The form's heading and submit label SHALL reflect the derived intent. The submitted `source_page` SHALL identify the surface the visitor came from, and where a surface carries more than one entry it SHALL further identify which entry was used.

#### Scenario: A sales page with seats offers a secondary entry

- **WHEN** a course sales page renders for a course with status `open` or `filling`
- **THEN** the enrolment action remains the only primary action, and a secondary text link offers to notify the visitor about the next cohort

#### Scenario: The form is revealed on demand

- **WHEN** a visitor activates the secondary link on a course that still has seats
- **THEN** the waitlist form is revealed, headed and labelled as a next-cohort notification rather than as a waitlist

#### Scenario: A full course promotes the entry

- **WHEN** a course surface renders with status `full`
- **THEN** the waitlist form is the surface's primary action, headed and labelled as joining the waitlist

#### Scenario: An entry separated from the enrolment action may render expanded

- **WHEN** a course sales page renders an entry at the foot of the page, separated from the enrolment action by the page's own content
- **THEN** that entry presents its form already expanded, and the enrolment action remains the page's only primary action

#### Scenario: A page for a course outside the workshops source carries no entry

- **WHEN** a sales page exists for a course absent from the `workshops` source
- **THEN** the page carries no notification entry at all, rather than one that renders nothing

#### Scenario: The originating surface is recorded

- **WHEN** a visitor submits the form from a course sales page
- **THEN** the stored `source_page` identifies that sales page rather than an instructor page

#### Scenario: The originating entry is recorded when a surface carries several

- **WHEN** a visitor submits the form from one of several entries on a single course sales page
- **THEN** the stored `source_page` identifies which entry was used, so that the entries' capture rates can be compared from stored rows alone
