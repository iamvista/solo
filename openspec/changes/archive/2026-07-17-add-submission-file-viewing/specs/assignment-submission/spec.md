## ADDED Requirements

### Requirement: Submitted files are readable only through short-lived signed URLs

The system SHALL release a submitted file only through a short-lived signed URL issued by a route handler that verifies authorization first. The private storage bucket carries no access policies, so the signed URL is the sole path to the bytes.

Authorization SHALL grant access to exactly two parties: a teacher of the course the attachment's assignment belongs to, and the student whose verified session email matches the owning submission. Every other request SHALL be denied.

The request SHALL identify the attachment by its database identifier. The storage path MUST NOT appear in any request or response, because ownership is recorded in the database rather than derived from the path, and exposing the path would leak the storage layout to clients.

A denial SHALL return a message and nothing else. The response MUST NOT contain the signed URL, the storage path, the filename, or any other attachment detail.

Clients MUST NOT cache signed URLs. When a signed URL expires, the client SHALL request a fresh one.

#### Scenario: Teacher requests an attachment from their own course

- **GIVEN** a teacher holds teaching permission for the course an assignment belongs to
- **WHEN** the teacher requests an attachment belonging to a submission for that assignment
- **THEN** the system SHALL return a short-lived signed URL
- **AND** the response MUST NOT contain the storage path

#### Scenario: Teacher requests an attachment from a course they do not teach

- **GIVEN** a teacher holds teaching permission for course A but not course B
- **WHEN** that teacher requests an attachment belonging to a submission for a course B assignment
- **THEN** the system SHALL deny the request
- **AND** the response MUST NOT contain a signed URL

#### Scenario: Student requests their own attachment

- **GIVEN** a student holds a verified session and has submitted an assignment with an attachment
- **WHEN** that student requests their own attachment
- **THEN** the system SHALL return a short-lived signed URL

#### Scenario: Student requests another student's attachment by identifier

- **GIVEN** student A holds a verified session and student B has submitted an assignment with an attachment
- **WHEN** student A requests student B's attachment by its identifier
- **THEN** the system SHALL deny the request
- **AND** the response MUST NOT contain a signed URL, the storage path, or the filename

#### Scenario: Request without a session or teaching permission

- **WHEN** a request carrying neither a verified student session nor teaching permission asks for an attachment
- **THEN** the system SHALL deny the request and issue no signed URL

#### Scenario: Signed URL expires

- **GIVEN** a client holds a signed URL for an attachment that has expired
- **WHEN** the client retries the view
- **THEN** the client SHALL request a fresh signed URL rather than reuse the expired one

### Requirement: Attachments are viewable in place

The system SHALL render every submitted attachment as an element the viewer can act on. An attachment MUST NOT be presented as inert text, because a viewer who can see that a file exists but cannot open it has no path to its content short of the storage console.

An attachment whose recorded MIME type is an image SHALL be rendered as an inline thumbnail, and activating it SHALL enlarge it in an overlay without navigating away. This spares a teacher a round trip to a separate viewer for every submission they grade.

An attachment of any other type SHALL be rendered as an activatable link that opens the file in a new tab.

Both the teacher's submission roster and the student's own submission view SHALL apply this requirement identically. The student SHALL see it for their own attachments only, as already required by "Students read only their own submissions".

The filename displayed SHALL be the original filename recorded in the database, not the sanitized storage key.

#### Scenario: Teacher views an image attachment while grading

- **GIVEN** a submission carries an attachment whose MIME type is an image
- **WHEN** a teacher of that course opens the submission roster
- **THEN** the attachment SHALL appear as an inline thumbnail
- **AND** activating the thumbnail SHALL enlarge the image in an overlay
- **AND** the teacher SHALL remain on the roster page with the comment field reachable

#### Scenario: Attachment is not an image

- **GIVEN** a submission carries an attachment whose MIME type is not an image
- **WHEN** an authorized viewer opens the page holding it
- **THEN** the attachment SHALL appear as an activatable link labelled with its original filename
- **AND** activating it SHALL open the file in a new tab

#### Scenario: Student reviews what they submitted

- **GIVEN** a student holds a verified session and has submitted an assignment with an attachment
- **WHEN** that student opens the assignment's submission view
- **THEN** their attachment SHALL be viewable under the same rules applied to the teacher's roster

#### Scenario: Original filename differs from the storage key

- **GIVEN** an attachment whose original filename contains non-ASCII characters and whose storage key was sanitized to ASCII
- **WHEN** an authorized viewer opens the page holding it
- **THEN** the displayed label SHALL be the original filename

##### Example: sanitized key versus displayed label

| Recorded filename | Storage key | Displayed label |
| ----------------- | ----------- | --------------- |
| `定位收斂器-定位卡-方形.png` | `positioning-convergence/<assignment-id>/2223c8612a7ad06e--_-.png` | `定位收斂器-定位卡-方形.png` |
