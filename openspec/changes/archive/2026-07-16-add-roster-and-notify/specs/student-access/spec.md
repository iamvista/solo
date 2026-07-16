## MODIFIED Requirements

### Requirement: Students reach the assignment area without an account

The system SHALL let a student reach the assignment area by proving control of the email address they are known by, without registering an account and without a password. The system MUST NOT require a student to hold an authentication account, and MUST NOT alter the existing enrollment records to establish identity.

An email SHALL be eligible for a course's assignment area when EITHER of the following holds:

- an enrollment exists for that course, with that email, whose status is `paid`; or
- that email appears on the course's guest roster.

Email comparison SHALL be case-insensitive in both cases. Eligibility SHALL be decided in one place, and the notification recipient list SHALL be derived from that same place rather than from a second query.

Guests SHALL be indistinguishable from paying students once inside: same pages, same submissions, same rewards.

Because the student never registers, the system SHALL greet the student using the name already held on whichever record granted eligibility.

#### Scenario: Eligible paying student reaches the assignment area

- **GIVEN** an enrollment for course X with email `student@example.com` and status `paid`
- **WHEN** that email is verified through a magic link
- **THEN** the system SHALL grant access to course X's assignment area
- **AND** the student SHALL be greeted with the name held on the enrollment record

#### Scenario: Guest reaches the assignment area

- **GIVEN** no enrollment for course X with email `guest@example.com`
- **AND** `guest@example.com` on course X's guest roster
- **WHEN** that email is verified through a magic link
- **THEN** the system SHALL grant access to course X's assignment area
- **AND** the student SHALL be greeted with the name held on the guest record

#### Scenario: Enrollment is not paid and no guest entry exists

- **GIVEN** an enrollment for course X with email `pending@example.com` and status `pending`
- **AND** no guest entry for that email
- **WHEN** that email requests access to course X's assignment area
- **THEN** the system SHALL NOT grant access

#### Scenario: Refunded student who is also a guest keeps access

- **GIVEN** an enrollment for course X with email `both@example.com` and status `refunded`
- **AND** `both@example.com` on course X's guest roster
- **WHEN** that email requests access
- **THEN** the system SHALL grant access, because the guest roster is an independent grant

##### Example: eligibility by enrollment state and guest roster

| Enrollment for course X | On guest roster | Eligible |
| ----------------------- | --------------- | -------- |
| `paid` | no | yes |
| `paid` | yes | yes |
| `pending` | no | no |
| `pending` | yes | yes |
| `refunded` | no | no |
| `refunded` | yes | yes |
| none | yes | yes |
| none | no | no |

### Requirement: Enrollment records are read but never modified

This change SHALL read `course_enrollments` to check eligibility and to retrieve the student's name. It MUST NOT add columns to that table, backfill it, or write to it in any way, because it holds payment records and lies on the checkout path.

Granting access to someone who did not pay SHALL be recorded on the guest roster, never as a payment record. A person who never paid MUST NOT appear in `course_enrollments`, because that table answers "who paid", and a fabricated row there would corrupt every answer derived from it: revenue totals, attendee exports, and the admin roster.

#### Scenario: Student access is granted

- **WHEN** any part of the student access flow runs
- **THEN** no write SHALL be issued against `course_enrollments`

#### Scenario: Teacher admits someone who did not pay

- **WHEN** a teacher grants course access to a person with no payment
- **THEN** the grant SHALL be recorded on the guest roster
- **AND** no row SHALL be created in `course_enrollments`
