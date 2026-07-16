## ADDED Requirements

### Requirement: Notifying students is an explicit action, never a side effect

The system SHALL send an assignment notification only when a teacher explicitly asks for it.

Publishing an assignment, editing it, or saving it in any way MUST NOT send mail. Mail cannot be recalled, and a teacher fixing a typo would otherwise mail the whole class again. Saving is not an outward-facing act, and the system SHALL keep it that way.

The notification control SHALL be separate from the publish control in the interface, and SHALL require a second confirmation before sending.

#### Scenario: Teacher publishes an assignment

- **WHEN** a teacher marks an assignment published
- **THEN** no mail SHALL be sent

#### Scenario: Teacher edits a published assignment

- **WHEN** a teacher saves changes to an already-published assignment
- **THEN** no mail SHALL be sent

#### Scenario: Teacher asks for a notification

- **WHEN** a teacher of the course confirms the notification action on a published assignment
- **THEN** the system SHALL mail every eligible student of that course
- **AND** SHALL report how many were sent

### Requirement: Only published assignments can be notified

The system SHALL refuse to notify students about an unpublished assignment, because the mail would lead to a page they cannot open.

#### Scenario: Teacher notifies about an unpublished assignment

- **WHEN** a teacher requests a notification for an assignment that is not published
- **THEN** the system SHALL reject the request
- **AND** SHALL send no mail

#### Scenario: Notification control on an unpublished assignment

- **WHEN** a teacher views an unpublished assignment
- **THEN** the notification control SHALL be unavailable
- **AND** SHALL state that the assignment must be published first

### Requirement: Recipients are exactly the students who can see the assignment

The system SHALL address the notification to every email eligible for the course, and to no one else. The recipient list SHALL be derived from the same eligibility rule the assignment area itself uses, so that nobody is mailed about a page they cannot open, and no eligible student is missed.

Eligible means a `paid` enrollment or an entry on the guest roster.

#### Scenario: Course has paying students and guests

- **GIVEN** a course with two `paid` enrollments and one guest
- **WHEN** a teacher notifies about a published assignment
- **THEN** all three SHALL be mailed

#### Scenario: Course has a refunded student

- **GIVEN** a course with one `paid` enrollment and one `refunded` enrollment that is not on the guest roster
- **WHEN** a teacher notifies
- **THEN** only the paying student SHALL be mailed

#### Scenario: Course has no eligible students

- **WHEN** a teacher notifies a course with no eligible students
- **THEN** no mail SHALL be sent
- **AND** the system SHALL report zero recipients
- **AND** no send SHALL be recorded

### Requirement: Every send is recorded and shown to the teacher

The system SHALL record each notification with the assignment, the sending account, the time, and the number of recipients.

The interface SHALL show when the assignment was last notified, or that it never has been, so a teacher can answer "did I already send this?" without guessing.

The system SHALL NOT block a repeat send: a teacher may legitimately want to remind the class. The protection against accidents is visibility and confirmation, not prohibition.

#### Scenario: Teacher sends a notification

- **WHEN** a notification is sent to 5 recipients
- **THEN** a record SHALL store the assignment, the sender, the time, and the count 5

#### Scenario: Teacher returns to an already-notified assignment

- **WHEN** a teacher views an assignment that was notified before
- **THEN** the interface SHALL show when it was last notified

#### Scenario: Teacher deliberately notifies again

- **WHEN** a teacher confirms a second notification for the same assignment
- **THEN** the system SHALL send it
- **AND** SHALL record a second send

### Requirement: Notification is authorized against the assignment's own course

The system SHALL permit a notification only from a teacher of the course that owns the assignment. The course SHALL be read from the assignment, never taken from the request.

#### Scenario: Non-teacher requests a notification

- **WHEN** an account that does not teach the assignment's course requests a notification
- **THEN** the system SHALL reject the request
- **AND** SHALL send no mail

#### Scenario: Partial send failure

- **GIVEN** a notification where some messages fail to send
- **WHEN** the send completes
- **THEN** the system SHALL record the number that actually succeeded
- **AND** SHALL show the teacher how many failed
