# submission-rewards Specification

## Purpose

TBD - created by archiving change 'add-assignments-system'. Update Purpose after archive.

## Requirements

### Requirement: Rewards attach to exactly one assignment

The system SHALL attach every reward to exactly one assignment. The system SHALL NOT support course-level rewards, because a course-level reward would require a completion rule and its attendant edge cases, such as completion regressing when a teacher adds an assignment.

A teacher who wants a reward granted only after all assignments are done SHALL attach it to the final assignment.

#### Scenario: Teacher creates a reward

- **WHEN** a teacher of a course creates a reward against an assignment in that course
- **THEN** the reward SHALL be stored against that assignment

#### Scenario: Assignment is deleted

- **GIVEN** an assignment carrying rewards
- **WHEN** that assignment is deleted
- **THEN** its rewards SHALL be deleted with it

---
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

---
### Requirement: Unlock is derived from submission existence

The system SHALL determine reward access by whether a submission exists for that reward's assignment and the email held on the requesting student's verified session. The system SHALL NOT persist unlock state in a separate table, because unlock state is derivable and a stored copy would drift from the submissions it describes.

Submitting SHALL unlock the assignment's rewards immediately, with no teacher action required. Teacher review SHALL NOT gate unlocking.

#### Scenario: Student submits an assignment

- **GIVEN** an assignment carrying a replay, a handout, and a booking link
- **WHEN** a student with a verified session submits that assignment
- **THEN** all three rewards SHALL unlock immediately
- **AND** they SHALL be presented on the same page as the submission form

#### Scenario: Student has not submitted

- **GIVEN** an assignment carrying rewards
- **WHEN** a student with a verified session who has not submitted requests one of its rewards
- **THEN** the system SHALL deny access
- **AND** the response MUST NOT contain the reward's URL or storage path

#### Scenario: Teacher has not reviewed the submission

- **GIVEN** a student's submission that carries no teacher comment
- **WHEN** that student requests the assignment's rewards
- **THEN** the rewards SHALL be accessible, because review does not gate unlocking

##### Example: reward access outcomes

| Session state | Submission exists | Reviewed | Reward access |
| ------------- | ----------------- | -------- | ------------- |
| verified, this course | yes | yes | granted |
| verified, this course | yes | no | granted |
| verified, this course | no | n/a | denied |
| verified, another course | yes | yes | denied |
| none | n/a | n/a | denied |

---
### Requirement: Reward content is reachable only through server authorization

The system SHALL verify submission existence on the server before releasing any reward's URL or signed URL. Handout files SHALL be held in the private storage bucket that carries no access policies, and SHALL be reachable only through short-lived signed URLs issued after that verification.

Clients MUST NOT cache signed URLs. When a signed URL expires, the client SHALL request a fresh one.

#### Scenario: Signed URL expires

- **GIVEN** a student holds a signed URL for a handout that has expired
- **WHEN** the student retries the download
- **THEN** the client SHALL request a fresh signed URL rather than reuse the expired one

#### Scenario: Student requests a reward unlocked by another student

- **GIVEN** student A has submitted an assignment and student B has not
- **WHEN** student B, holding a verified session, requests that assignment's rewards
- **THEN** the system SHALL deny access, because no submission exists for student B's email

---
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
