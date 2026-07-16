## ADDED Requirements

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

### Requirement: Rewards carry one of three kinds

The system SHALL support three reward kinds, distinguished by how their content is reached:

- `video`: a replay hosted externally, reached by URL
- `file`: a handout held in the private storage bucket, reached by a signed URL
- `link`: an external destination such as a booking page, reached by URL

All three kinds SHALL be gated by the same unlock rule and SHALL differ only in rendering and retrieval.

#### Scenario: Student opens an unlocked video reward

- **WHEN** a student with an unlocked `video` reward opens it
- **THEN** the system SHALL present the replay for playback

#### Scenario: Student opens an unlocked file reward

- **WHEN** a student with an unlocked `file` reward requests it
- **THEN** the system SHALL issue a short-lived signed URL for download

#### Scenario: Student opens an unlocked link reward

- **WHEN** a student with an unlocked `link` reward opens it
- **THEN** the system SHALL present the external destination URL

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
