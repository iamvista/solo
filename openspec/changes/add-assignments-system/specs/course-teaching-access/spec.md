## ADDED Requirements

### Requirement: A mapping table grants teaching permission per course

The system SHALL determine teaching permission from a `course_teachers` mapping between a course identifier and an account. Teaching permission MUST NOT be derived from a hardcoded email list, because that cannot express per-course scope and cannot be changed without a deployment.

A course identifier SHALL reference the existing course configuration file rather than a database table. This change MUST NOT move course configuration into the database, because doing so would alter the registration and checkout rendering paths.

An account SHALL be mappable to any number of courses, and a course SHALL be mappable to any number of accounts. Each pairing SHALL be unique.

#### Scenario: Platform administrator assigns a teacher to a course

- **WHEN** a platform administrator maps an account to a course
- **THEN** that account SHALL gain teaching permission for that course only

#### Scenario: Account is mapped to the same course twice

- **WHEN** a platform administrator maps an account to a course it is already mapped to
- **THEN** the system SHALL reject the duplicate
- **AND** exactly one mapping SHALL remain

#### Scenario: Non-administrator assigns a teacher

- **WHEN** a course teacher or student requests the teacher assignment endpoint
- **THEN** the system SHALL reject the request
- **AND** no mapping SHALL be created

### Requirement: Teachers reach only the courses they teach

The system SHALL scope every teaching surface to the courses the requesting account is mapped to. A teacher requesting a course they are not mapped to SHALL be denied, and the response MUST NOT disclose that course's assignments, submissions, or student identities.

#### Scenario: Teacher lists their courses

- **GIVEN** an account mapped to course X but not course Y
- **WHEN** that account opens the teaching home page
- **THEN** course X SHALL be listed
- **AND** course Y MUST NOT be listed

#### Scenario: Teacher requests a course they do not teach

- **GIVEN** an account mapped to course X but not course Y
- **WHEN** that account requests the teaching page for course Y
- **THEN** the system SHALL deny access
- **AND** the response MUST NOT contain any assignment, submission, or student identity from course Y

### Requirement: Student submissions are isolated between accounts and between teachers

The system SHALL enforce, at the database layer, that a student reads only their own submissions and that a teacher reads only submissions belonging to courses they teach. This isolation SHALL be verified against a real database using distinct authenticated identities, and MUST NOT be accepted on the basis of code review alone.

#### Scenario: Student reads another student's submission

- **GIVEN** student A and student B both enrolled in the same course
- **WHEN** student A queries the database for student B's submission
- **THEN** the query SHALL return no rows

#### Scenario: Teacher reads a submission from a course they do not teach

- **GIVEN** a teacher mapped to course X only, and a submission belonging to course Y
- **WHEN** that teacher queries the database for that submission
- **THEN** the query SHALL return no rows

#### Scenario: Teacher reads a submission from a course they teach

- **GIVEN** a teacher mapped to course X, and a submission belonging to course X
- **WHEN** that teacher queries the database for that submission
- **THEN** the query SHALL return that submission

##### Example: submission read isolation

| Requesting identity | Submission owner | Submission's course | Rows returned |
| ------------------- | ---------------- | ------------------- | ------------- |
| student A | student A | X | 1 |
| student A | student B | X | 0 |
| teacher of X | student A | X | 1 |
| teacher of X | student A | Y | 0 |
| student A | student A | X, unpublished assignment | 1 |

### Requirement: Teachers review submissions without gating rewards

The system SHALL allow a teacher to read submitted content, download attachments, and record a comment against any submission in a course they teach. Recording a comment SHALL store the reviewing account and the review timestamp.

Review state SHALL be derived from the review timestamp rather than a separate status column. A submission SHALL be considered unreviewed when its review timestamp is absent.

Review MUST NOT affect reward access, because rewards unlock on submission.

#### Scenario: Teacher comments on a submission

- **WHEN** a teacher of the course records a comment on a submission in that course
- **THEN** the comment, the reviewing account, and the review timestamp SHALL be stored
- **AND** the student SHALL see the comment on the assignment page

#### Scenario: Teacher comments on a course they do not teach

- **WHEN** an account not mapped to a course records a comment on a submission in that course
- **THEN** the system SHALL reject the request
- **AND** the submission SHALL remain unchanged

#### Scenario: Student writes their own review comment

- **WHEN** a student attempts to write a review comment on their own submission
- **THEN** the write SHALL be rejected, because review writes pass through teacher-authorized route handlers only

### Requirement: Teaching permission is separate from platform administration

The system SHALL keep the teaching surface distinct from the existing platform administration surface. A course teacher SHALL NOT require platform administrator status, and teaching permission SHALL NOT grant platform administration.

The two permission models MUST NOT inherit from one another or share an authorization helper, so that granting a teacher access to their course cannot widen their reach across the platform. The existing administration pages and their authorization helper SHALL remain unchanged by this change.

#### Scenario: Teacher without administrator status reaches their course

- **GIVEN** an account mapped to a course and not listed as a platform administrator
- **WHEN** that account opens the teaching page for that course
- **THEN** access SHALL be granted

#### Scenario: Teacher requests a platform administration page

- **GIVEN** an account mapped to a course and not listed as a platform administrator
- **WHEN** that account requests a platform administration page
- **THEN** access SHALL be denied
