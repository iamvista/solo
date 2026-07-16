## ADDED Requirements

### Requirement: Enrollment records link to authenticated accounts

The system SHALL associate each course enrollment with an authenticated account by storing a `user_id` reference to `auth.users` on `course_enrollments`. The column SHALL be nullable, because enrollments created before this change and enrollments whose payment email does not match any account will have no associated account.

This change SHALL add the column only. It MUST NOT alter, drop, or rewrite any pre-existing column on `course_enrollments`.

#### Scenario: New enrollment created by an authenticated visitor

- **WHEN** a visitor with an active session completes course registration
- **THEN** the created enrollment record SHALL store that account's id in `user_id`

#### Scenario: New enrollment created by an anonymous visitor

- **WHEN** a visitor with no session completes course registration
- **THEN** the enrollment record SHALL be created with `user_id` set to null
- **AND** the checkout flow SHALL complete unchanged

### Requirement: Existing enrollments are backfilled by verified email

The system SHALL backfill `user_id` on existing enrollment records by matching the enrollment email against confirmed account emails, case-insensitively. Only accounts with a confirmed email SHALL be matched, because an unconfirmed email does not prove ownership.

The backfill SHALL run as a migration separate from the migration that adds the column, so that each step can be rolled back independently.

#### Scenario: Enrollment email matches a confirmed account

- **WHEN** the backfill migration runs
- **AND** an enrollment has `user_id` null and an email matching a confirmed account email
- **THEN** that enrollment's `user_id` SHALL be set to the matching account id

#### Scenario: Enrollment email matches no account

- **WHEN** the backfill migration runs
- **AND** an enrollment's email matches no confirmed account
- **THEN** that enrollment's `user_id` SHALL remain null
- **AND** all other columns on that record SHALL remain unchanged

##### Example: backfill outcomes

| Enrollment email | Account state | Resulting `user_id` |
| ---------------- | ------------- | ------------------- |
| `a@example.com` | confirmed account exists | that account's id |
| `A@Example.com` | confirmed account `a@example.com` exists | that account's id (case-insensitive match) |
| `b@example.com` | account exists, email unconfirmed | null |
| `c@example.com` | no account | null |

### Requirement: Accounts claim matching enrollments on sign-in

The system SHALL claim unbound enrollments for an account when that account signs in, by setting `user_id` on every enrollment whose email matches the account's confirmed email and whose `user_id` is null. Because the authentication provider verifies email ownership, this claim SHALL be treated as authorized without further confirmation.

#### Scenario: Account signs in after enrolling anonymously

- **GIVEN** an enrollment exists with email `student@example.com` and `user_id` null
- **WHEN** the account with confirmed email `student@example.com` signs in
- **THEN** that enrollment's `user_id` SHALL be set to that account's id
- **AND** the student SHALL gain access to that course's assignments

#### Scenario: Account signs in with no matching enrollment

- **WHEN** an account signs in and no enrollment matches its email
- **THEN** no enrollment record SHALL be modified

### Requirement: Platform administrators bind mismatched enrollments manually

The system SHALL provide platform administrators an interface to bind an enrollment record to an account when the payment email and the sign-in email differ. This binding SHALL be restricted to platform administrators and MUST NOT be available to course teachers or students.

The system SHALL NOT provide a self-service binding flow for students, because the expected volume does not justify one.

#### Scenario: Administrator binds an enrollment to an account

- **GIVEN** an enrollment paid with `personal@example.com` and an account signed in as `work@example.com`
- **WHEN** a platform administrator binds that enrollment to that account
- **THEN** the enrollment's `user_id` SHALL be set to that account's id
- **AND** the student SHALL gain access to that course's assignments

#### Scenario: Non-administrator attempts manual binding

- **WHEN** a course teacher or student requests the manual binding endpoint
- **THEN** the system SHALL reject the request
- **AND** no enrollment record SHALL be modified
