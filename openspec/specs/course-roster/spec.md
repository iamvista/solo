# course-roster Specification

## Purpose

TBD - created by archiving change 'add-roster-and-notify'. Update Purpose after archive.

## Requirements

### Requirement: Teachers admit non-paying people to their own course

The system SHALL let a course teacher add a person to their course's guest roster by email, optionally with a name and a note recording why. A guest SHALL gain the same access a paying student has.

The roster SHALL record who added each guest and when, so an unexplained entry can be traced.

Each email SHALL appear at most once per course.

#### Scenario: Teacher adds a guest

- **WHEN** a teacher of the course adds `guest@example.com` to that course's roster
- **THEN** the guest SHALL be stored against that course with the adding teacher recorded
- **AND** that email SHALL immediately be able to request a magic link for the course

#### Scenario: Teacher adds a duplicate email

- **WHEN** a teacher adds an email already on that course's roster
- **THEN** the system SHALL reject it
- **AND** exactly one entry SHALL remain

#### Scenario: Teacher adds someone who already paid

- **WHEN** a teacher adds an email that already holds a `paid` enrollment for that course
- **THEN** the system SHALL reject it and say the person already has access
- **AND** no guest entry SHALL be created

#### Scenario: Teacher removes a guest

- **WHEN** a teacher removes a guest from their course's roster
- **THEN** that email SHALL lose access
- **AND** any submission it already made SHALL remain, because the work was really done

#### Scenario: Non-teacher manages a roster

- **WHEN** an account that does not teach the course adds or removes a guest on it
- **THEN** the system SHALL reject the request
- **AND** the roster SHALL remain unchanged

---
### Requirement: A guest entry is never a payment record

The system SHALL store guests in a table of their own. It MUST NOT represent a guest as an enrollment, with any status, flag, or zero amount.

`course_enrollments` answers "who paid". A person who did not pay has no answer to give there, and a fabricated row would corrupt everything derived from that table.

#### Scenario: Guest is admitted

- **WHEN** a guest is added to a course
- **THEN** no row SHALL be created or modified in `course_enrollments`

---
### Requirement: Only platform administrators assign teachers

The system SHALL let a platform administrator map an account to a course as a teacher, and remove that mapping, through an interface rather than by editing the database.

Teachers MUST NOT be able to assign teachers, including themselves or others. Granting teaching access reaches another course's student work, so it is a platform-level trust decision rather than one a course teacher can make.

Teaching assignment SHALL continue to use the existing platform administration authorization, and the guest roster SHALL continue to use course teaching authorization. Neither SHALL inherit from the other.

#### Scenario: Administrator assigns a teacher

- **WHEN** a platform administrator maps an account to a course
- **THEN** that account SHALL gain teaching permission for that course
- **AND** SHALL see it listed on the teaching home page

#### Scenario: Teacher attempts to assign a teacher

- **WHEN** a course teacher who is not a platform administrator requests the teacher assignment endpoint
- **THEN** the system SHALL reject the request
- **AND** no mapping SHALL be created

#### Scenario: Administrator removes a teacher

- **WHEN** a platform administrator removes a teaching mapping
- **THEN** that account SHALL lose access to the course
- **AND** the course's assignments, submissions, and rewards SHALL remain untouched

##### Example: who may do what

| Actor | Add a guest to course X | Assign a teacher to course X |
| ----- | ----------------------- | ---------------------------- |
| platform administrator, teaches X | yes | yes |
| platform administrator, teaches nothing | no | yes |
| teacher of X, not an administrator | yes | no |
| teacher of Y only | no | no |
| unauthenticated | no | no |

---
### Requirement: Assistants are teachers

The system SHALL admit a teaching assistant by mapping them as a teacher of the course. It SHALL NOT define a separate assistant role or permission tier.

An assistant therefore holds the same powers as the course's teacher, including creating and deleting assignments and rewards. This is a deliberate trade: role tiers would add a permission check to every teaching route and raise questions this system has no answer for yet, and assistants are people the teacher already trusts.

#### Scenario: Assistant reviews submissions

- **GIVEN** an assistant mapped as a teacher of course X
- **WHEN** they open course X's teaching pages
- **THEN** they SHALL be able to read submissions and record comments

#### Scenario: Assistant reaches a course they are not mapped to

- **GIVEN** an assistant mapped to course X only
- **WHEN** they request course Y's teaching pages
- **THEN** the system SHALL deny access
