## MODIFIED Requirements

### Requirement: Rewards carry one of three kinds

The system SHALL support four reward kinds, distinguished by where their content lives and how it is reached:

- `video`: a replay hosted externally, reached by URL
- `file`: a handout held in the private storage bucket, reached by a signed URL
- `link`: an external destination such as a booking page, reached by URL
- `text`: a passage written by the teacher, held in the database and read directly

All four kinds SHALL be gated by the same unlock rule and SHALL differ only in rendering and retrieval.

`text` content SHALL be stored and rendered as plain text with line breaks preserved. The system SHALL NOT parse it as markdown or HTML, because a teacher's input rendered as markup would become an injection point on the student's page.

#### Scenario: Student opens an unlocked video reward

- **WHEN** a student with an unlocked `video` reward opens it
- **THEN** the system SHALL present the replay for playback

#### Scenario: Student opens an unlocked file reward

- **WHEN** a student with an unlocked `file` reward requests it
- **THEN** the system SHALL issue a short-lived signed URL for download

#### Scenario: Student opens an unlocked link reward

- **WHEN** a student with an unlocked `link` reward opens it
- **THEN** the system SHALL present the external destination URL

#### Scenario: Student reads an unlocked text reward

- **WHEN** a student with an unlocked `text` reward views the assignment page
- **THEN** the passage SHALL be shown with its line breaks preserved
- **AND** no request for a URL SHALL be needed, because the content is already in the page

#### Scenario: Teacher writes markup into a text reward

- **GIVEN** a `text` reward whose body contains `<b>bold</b>`
- **WHEN** a student with that reward unlocked reads it
- **THEN** the characters SHALL be shown literally
- **AND** the markup SHALL NOT be rendered

#### Scenario: Text reward is saved without a body

- **WHEN** a teacher creates a `text` reward whose body is empty or only whitespace
- **THEN** the system SHALL reject it
- **AND** no reward SHALL be created

## ADDED Requirements

### Requirement: Teachers upload handouts from the browser

The system SHALL let a course teacher attach a handout by choosing a file in the browser. The teacher MUST NOT be required to know, supply, or see a storage path: the system SHALL derive the path itself.

Uploads SHALL follow the mechanism already used for student submissions: the server verifies permission and issues a signed upload URL, and the browser transfers the file directly to storage. The bytes MUST NOT pass through a route handler, because the hosting platform caps request bodies at 4.5MB.

Handout uploads SHALL be authorized against the course that owns the target assignment, and SHALL be keyed under a prefix separate from student submissions.

#### Scenario: Teacher attaches a handout

- **WHEN** a teacher of the course chooses a file for a `file` reward on an assignment in that course
- **THEN** the system SHALL issue a signed upload URL
- **AND** the browser SHALL transfer the file directly to storage
- **AND** the created reward SHALL reference the path the system derived

#### Scenario: Teacher never sees a storage path

- **WHEN** a teacher adds a handout through the resource manager
- **THEN** the interface SHALL NOT ask for a storage path
- **AND** SHALL NOT display one

#### Scenario: Non-teacher requests an upload URL

- **WHEN** an account that does not teach the assignment's course requests a handout upload URL
- **THEN** the system SHALL reject the request
- **AND** issue no signed URL

#### Scenario: Upload succeeds but the reward is not created

- **GIVEN** a teacher has transferred a handout to storage
- **WHEN** the subsequent create-reward request fails
- **THEN** the interface SHALL surface the error and retain the form
- **AND** no reward SHALL be created
- **AND** the orphaned object SHALL remain in storage without a cleanup job

##### Example: upload authorization

| Requesting identity | Assignment's course | Signed URL issued |
| ------------------- | ------------------- | ----------------- |
| teacher of course X | X | yes |
| teacher of course X | Y | no |
| authenticated, teaches nothing | X | no |
| unauthenticated | X | no |
