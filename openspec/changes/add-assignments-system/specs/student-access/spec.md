## ADDED Requirements

### Requirement: Students reach the assignment area without an account

The system SHALL let a student reach the assignment area by proving control of the email address used to enrol, without registering an account and without a password. The system MUST NOT require a student to hold an authentication account, and MUST NOT alter the existing enrollment records to establish identity.

The system SHALL treat enrollment as the authority on eligibility: an email SHALL be eligible for a course's assignment area when an enrollment exists for that course, with that email, whose status is `paid`. Email comparison SHALL be case-insensitive.

Because the student never registers, the system SHALL greet the student using the name already held on the enrollment record rather than asking for it.

#### Scenario: Eligible student reaches the assignment area

- **GIVEN** an enrollment for course X with email `student@example.com` and status `paid`
- **WHEN** that email is verified through a magic link
- **THEN** the system SHALL grant access to course X's assignment area
- **AND** the student SHALL be greeted with the name held on the enrollment record

#### Scenario: Enrollment is not paid

- **GIVEN** an enrollment for course X with email `pending@example.com` and status `pending`
- **WHEN** that email requests access to course X's assignment area
- **THEN** the system SHALL NOT grant access

##### Example: eligibility by enrollment state

| Enrollment for course X | Status | Eligible |
| ----------------------- | ------ | -------- |
| exists, `student@example.com` | `paid` | yes |
| exists, `STUDENT@Example.com` | `paid` | yes (case-insensitive) |
| exists, `student@example.com` | `pending` | no |
| exists, `student@example.com` | `refunded` | no |
| none | n/a | no |

### Requirement: Access requests do not disclose enrollment membership

The system SHALL return an identical response to every magic link request for a given course, whether or not the submitted email is enrolled. The response MUST NOT reveal whether that email appears on the course roster.

The system SHALL send a magic link only to an eligible email. An ineligible email SHALL receive no mail, while its sender still sees the same confirmation message.

#### Scenario: Eligible email requests access

- **WHEN** an email with a `paid` enrollment requests a magic link for that course
- **THEN** the system SHALL send a magic link to that address
- **AND** SHALL display a message stating that mail has been sent if the address is enrolled

#### Scenario: Ineligible email requests access

- **WHEN** an email with no enrollment requests a magic link for a course
- **THEN** the system SHALL send no mail
- **AND** SHALL display a message identical to the eligible case
- **AND** the response status and body MUST NOT differ from the eligible case

### Requirement: Access requests are rate limited

The system SHALL limit magic link requests both per client address and per submitted email address.

Per-email limiting SHALL exist independently of per-client limiting, because a per-client limit alone does not stop an attacker from flooding one student's inbox from many clients.

Both limits SHALL be evaluated on every request before eligibility is checked, and SHALL be applied whether or not the submitted address is enrolled. A limit evaluated only for enrolled addresses would make a throttled response a roster oracle, defeating the identical-response requirement.

#### Scenario: Client exceeds the per-client limit

- **WHEN** one client sends more magic link requests than the per-client limit allows within the window
- **THEN** the system SHALL reject the excess requests
- **AND** SHALL send no mail for them

#### Scenario: One address is flooded from many clients

- **WHEN** requests for a single email address exceed the per-email limit within the window, each from a different client
- **THEN** the system SHALL reject the excess requests
- **AND** SHALL send no mail for them

#### Scenario: Throttling does not reveal enrollment

- **GIVEN** an enrolled address and an unenrolled address
- **WHEN** each is throttled
- **THEN** both SHALL receive an identical response

### Requirement: Magic link tokens are single-use and short-lived

The system SHALL issue each magic link as a random token bound to one email and one course, expiring 30 minutes after issue. A token SHALL be accepted at most once; the system SHALL record its use at verification.

The system SHALL reject a token that is expired, already used, or unknown, and SHALL offer a path to request a fresh link.

#### Scenario: Token is used once

- **GIVEN** a valid unexpired token
- **WHEN** the student follows the magic link
- **THEN** the system SHALL grant a session and mark the token used

#### Scenario: Token is reused

- **GIVEN** a token that has already been used
- **WHEN** anyone follows that magic link again
- **THEN** the system SHALL reject it
- **AND** SHALL offer a path to request a fresh link

##### Example: token verification outcomes

| Token state | Outcome |
| ----------- | ------- |
| valid, unexpired, unused | session granted, token marked used |
| valid, unexpired, already used | rejected |
| valid, expired | rejected |
| unknown | rejected |

### Requirement: Student sessions are signed and revalidated on every request

The system SHALL represent a verified student session as an httpOnly, Secure, SameSite=Lax cookie holding the student's email and the course identifier, signed with a secret held in an environment variable. The cookie SHALL expire 30 days after issue.

The system MUST NOT trust the cookie's contents on their own. On every request the system SHALL verify the signature and SHALL re-check that the email still holds a `paid` enrollment for that course. A session whose signature fails or whose enrollment is no longer `paid` SHALL be treated as absent.

A session SHALL authorize its own course only.

#### Scenario: Cookie contents are tampered with

- **GIVEN** a student session cookie whose email has been edited to another student's address
- **WHEN** that cookie is presented
- **THEN** the signature check SHALL fail
- **AND** the request SHALL be treated as unauthenticated

#### Scenario: Enrollment is refunded after the session was issued

- **GIVEN** a valid session cookie for course X issued while the enrollment was `paid`
- **WHEN** that enrollment's status becomes `refunded` and the cookie is presented
- **THEN** the request SHALL be treated as unauthenticated

#### Scenario: Session is presented to a different course

- **GIVEN** a valid session cookie for course X
- **WHEN** it is presented to course Y's assignment area
- **THEN** the system SHALL deny access
- **AND** the response MUST NOT contain any assignment or submission from course Y

### Requirement: Enrollment records are read but never modified

This change SHALL read `course_enrollments` to check eligibility and to retrieve the student's name. It MUST NOT add columns to that table, backfill it, or write to it in any way, because it holds payment records and lies on the checkout path.

#### Scenario: Student access is granted

- **WHEN** any part of the student access flow runs
- **THEN** no write SHALL be issued against `course_enrollments`
