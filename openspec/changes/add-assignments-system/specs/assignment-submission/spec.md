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
- **WHEN** an eligible student submits it
- **THEN** the submission SHALL be accepted
- **AND** it SHALL NOT be flagged as late

### Requirement: Assignment visibility requires a verified session and publication

The system SHALL show an assignment to a student only when that student holds a verified session for the assignment's course and the assignment is published. A request that fails either condition MUST NOT disclose the assignment's title, description, or any submission by any student.

#### Scenario: Visitor without a session requests an assignment

- **WHEN** a visitor with no verified session requests an assignment page
- **THEN** the system SHALL present the email request form
- **AND** the response MUST NOT contain any assignment title, description, or content

#### Scenario: Student requests an unpublished assignment

- **GIVEN** a student holding a verified session for a course
- **WHEN** that student requests an unpublished assignment in that course
- **THEN** the system SHALL deny access
- **AND** the assignment MUST NOT appear in that student's assignment list

##### Example: assignment list visibility

| Session state | Assignment published | Appears in student's list |
| ------------- | -------------------- | ------------------------- |
| verified for this course | yes | yes |
| verified for this course | no | no |
| verified for another course | yes | no |
| none | yes | no |

### Requirement: Students submit assignments in the enabled forms

The system SHALL allow a student holding a verified session to submit an assignment with any combination of the forms that assignment enables: uploaded files, text content, and an external link. The system SHALL reject content submitted in a form the assignment does not enable.

Submissions SHALL be keyed by the assignment and the student's email address, normalized to lower case. Each student SHALL hold at most one submission per assignment, enforced by a unique constraint on that pair.

#### Scenario: Student submits text and a link

- **GIVEN** an assignment that enables text and link but not file
- **WHEN** a student with a verified session submits text content and a link URL
- **THEN** the submission SHALL be stored against that student's email and the assignment

#### Scenario: Student submits in a disabled form

- **GIVEN** an assignment that disables file submission
- **WHEN** a student requests an upload URL for that assignment
- **THEN** the system SHALL reject the request

#### Scenario: Visitor without a session submits

- **WHEN** a request with no verified session submits an assignment
- **THEN** the system SHALL reject the request
- **AND** no submission record SHALL be created

### Requirement: Students read only their own submissions

The system SHALL scope every submission read by a student to the email held on their verified session. A student MUST NOT be able to read another student's submitted content, attachments, or teacher comment, whether by supplying another email, another submission identifier, or a modified cookie.

#### Scenario: Student requests another student's submission by identifier

- **GIVEN** student A holds a verified session and student B has submitted an assignment
- **WHEN** student A requests student B's submission by its identifier
- **THEN** the system SHALL deny the request
- **AND** the response MUST NOT contain student B's content, attachments, or teacher comment

### Requirement: Resubmission overwrites the previous submission

The system SHALL let a student resubmit an assignment at any time. A resubmission SHALL update the existing submission record in place and refresh its updated timestamp. The system SHALL NOT retain version history of prior submissions.

#### Scenario: Student resubmits an assignment

- **GIVEN** a student has already submitted an assignment with text content "first draft"
- **WHEN** that student submits again with text content "second draft"
- **THEN** the submission's text content SHALL read "second draft"
- **AND** the submission's updated timestamp SHALL advance
- **AND** exactly one submission record SHALL exist for that student and assignment

### Requirement: File uploads bypass the application server

The system SHALL store submitted files in a private storage bucket that carries no access policies. A client SHALL obtain a signed upload URL from the server, which SHALL verify the student's session and eligibility before issuing it, and SHALL then transfer the file directly to storage.

Files MUST NOT be routed through application route handlers, because the hosting platform imposes a 4.5MB request body limit that would cap attachment size.

Storage paths MUST NOT embed the student's email address, so that personal data does not leak into storage keys. Ownership SHALL be recorded in the database rather than derived from the path.

#### Scenario: Student with a session uploads a file

- **WHEN** a student holding a verified session requests an upload URL for a file-enabled assignment
- **THEN** the system SHALL return a signed upload URL and the storage path
- **AND** the client SHALL transfer the file directly to storage without traversing a route handler

#### Scenario: Request without a session asks for an upload URL

- **WHEN** a request with no verified session asks for an upload URL
- **THEN** the system SHALL reject it and issue no signed URL

#### Scenario: Upload succeeds but submission fails

- **GIVEN** a student has transferred a file to storage
- **WHEN** the subsequent submission request fails
- **THEN** the client SHALL surface the error and retain the form content
- **AND** no submission record SHALL be created
- **AND** the orphaned file SHALL remain in storage without a cleanup job

### Requirement: New tables carry no access policies and all access passes through route handlers

Because students hold no database session, the database cannot identify a student and row-level policies cannot express student authorization. The system SHALL enable row-level security on every new table and SHALL define no policies on them, restricting direct access to the service role, matching the treatment of the existing enrollment table.

Every read and write SHALL pass through an application route handler that verifies authorization explicitly before using the service role. Authorization SHALL be concentrated in a single shared helper so that no student route can omit it.

#### Scenario: Client reaches the database directly

- **WHEN** a client uses the public anonymous key to read or write any new table
- **THEN** the request SHALL return no rows and perform no write, because no policy grants access
