## ADDED Requirements

### Requirement: Teachers define assignments per course

The system SHALL allow a course teacher to create and edit assignments belonging to a course they teach. Each assignment SHALL carry a title, an optional markdown description, a sort order, an optional due date, a published flag, and three independent flags declaring which submission forms are accepted: file, text, and link.

Every assignment MUST accept at least one submission form. The system SHALL reject an assignment whose file, text, and link flags are all disabled.

The due date SHALL be displayed to students but SHALL NOT be enforced. Submissions after the due date SHALL be accepted and SHALL NOT be marked late.

#### Scenario: Teacher creates an assignment

- **WHEN** a teacher of a course creates an assignment with a title and at least one submission form enabled
- **THEN** the assignment SHALL be created against that course
- **AND** it SHALL be unpublished until the teacher publishes it

#### Scenario: Teacher disables every submission form

- **WHEN** a teacher creates or edits an assignment with file, text, and link all disabled
- **THEN** the system SHALL reject the request
- **AND** the assignment SHALL NOT be created or modified

#### Scenario: Student submits after the due date

- **GIVEN** an assignment whose due date has passed
- **WHEN** an enrolled student submits it
- **THEN** the submission SHALL be accepted
- **AND** it SHALL NOT be flagged as late

### Requirement: Assignment visibility requires paid enrollment and publication

The system SHALL show an assignment to a student only when that student has an enrollment in the assignment's course with status `paid` and the assignment is published. A request that fails either condition MUST NOT disclose the assignment's title, description, or any submission by any student.

#### Scenario: Unauthenticated visitor requests an assignment

- **WHEN** a visitor with no session requests an assignment page
- **THEN** the system SHALL redirect to the sign-in page carrying a return URL

#### Scenario: Authenticated account without paid enrollment

- **GIVEN** an account with no `paid` enrollment for a course
- **WHEN** that account requests an assignment page for that course
- **THEN** the system SHALL present a not-enrolled notice linking to the course page
- **AND** the response MUST NOT contain the assignment's title, description, or content

#### Scenario: Enrolled student requests an unpublished assignment

- **GIVEN** a student with a `paid` enrollment for a course
- **WHEN** that student requests an unpublished assignment in that course
- **THEN** the system SHALL deny access
- **AND** the assignment MUST NOT appear in that student's assignment list

##### Example: assignment list visibility

| Enrollment status | Assignment published | Appears in student's list |
| ----------------- | -------------------- | ------------------------- |
| `paid` | yes | yes |
| `paid` | no | no |
| `pending` | yes | no |
| none | yes | no |

### Requirement: Students submit assignments in the enabled forms

The system SHALL allow an enrolled student to submit an assignment with any combination of the forms that assignment enables: uploaded files, text content, and an external link. The system SHALL reject content submitted in a form the assignment does not enable.

Each student SHALL hold at most one submission per assignment, enforced by a unique constraint on the assignment and account pair.

#### Scenario: Student submits text and a link

- **GIVEN** an assignment that enables text and link but not file
- **WHEN** an enrolled student submits text content and a link URL
- **THEN** the submission SHALL be stored against that student and assignment

#### Scenario: Student submits in a disabled form

- **GIVEN** an assignment that disables file submission
- **WHEN** a student requests an upload URL for that assignment
- **THEN** the system SHALL reject the request

#### Scenario: Non-enrolled account submits

- **WHEN** an account without a `paid` enrollment submits an assignment
- **THEN** the system SHALL reject the request
- **AND** no submission record SHALL be created

### Requirement: Resubmission overwrites the previous submission

The system SHALL let a student resubmit an assignment at any time. A resubmission SHALL update the existing submission record in place and refresh its updated timestamp. The system SHALL NOT retain version history of prior submissions.

#### Scenario: Student resubmits an assignment

- **GIVEN** a student has already submitted an assignment with text content "first draft"
- **WHEN** that student submits again with text content "second draft"
- **THEN** the submission's text content SHALL read "second draft"
- **AND** the submission's updated timestamp SHALL advance
- **AND** exactly one submission record SHALL exist for that student and assignment

### Requirement: File uploads bypass the application server

The system SHALL store submitted files in a private storage bucket that carries no access policies. A client SHALL obtain a signed upload URL from the server, which SHALL verify paid enrollment before issuing it, and SHALL then transfer the file directly to storage.

Files MUST NOT be routed through application route handlers, because the hosting platform imposes a 4.5MB request body limit that would cap attachment size.

Uploaded files SHALL be keyed by course, assignment, and account so that ownership is derivable from the path.

#### Scenario: Enrolled student uploads a file

- **WHEN** an enrolled student requests an upload URL for a file-enabled assignment
- **THEN** the system SHALL return a signed upload URL and the storage path
- **AND** the client SHALL transfer the file directly to storage without traversing a route handler

#### Scenario: Non-enrolled account requests an upload URL

- **WHEN** an account without a `paid` enrollment requests an upload URL
- **THEN** the system SHALL reject the request and issue no signed URL

#### Scenario: Upload succeeds but submission fails

- **GIVEN** a student has transferred a file to storage
- **WHEN** the subsequent submission request fails
- **THEN** the client SHALL surface the error and retain the form content
- **AND** no submission record SHALL be created
- **AND** the orphaned file SHALL remain in storage without a cleanup job

### Requirement: Writes to submission data pass through authorized route handlers

Because the storage backend's anonymous key is public and reaches the database directly, the system SHALL define no write policies on assignment or submission tables. Every write SHALL pass through an application route handler that verifies authorization explicitly.

This SHALL prevent a student from writing fields reserved for teachers, such as review comments, by calling the database directly.

#### Scenario: Student writes directly to the database

- **WHEN** a student uses the public anonymous key to write a submission record directly
- **THEN** the write SHALL be rejected, because no write policy grants it
