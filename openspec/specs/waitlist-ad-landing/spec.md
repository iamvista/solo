# waitlist-ad-landing Specification

## Purpose

TBD - created by archiving change 'course-waitlist-notify'. Update Purpose after archive.

## Requirements

### Requirement: Every course exposes a dedicated notify landing page

The system SHALL serve a landing page at `/courses/<course>/notify` for each course defined in the workshop catalogue, through a dynamic route requiring no per-course maintenance. Requesting the route for an unknown course slug SHALL return HTTP 404.

#### Scenario: A known course renders its landing page

- **WHEN** a visitor requests the notify route for a course slug present in the catalogue
- **THEN** the page renders with that course's title and value proposition

#### Scenario: An unknown course returns not found

- **WHEN** a visitor requests the notify route for a slug absent from the catalogue
- **THEN** the server responds with HTTP 404

---
### Requirement: The landing page pursues email capture as its only conversion goal

The landing page SHALL NOT display a price, an enrolment button, or bank transfer instructions. Its sole call to action SHALL be the email capture form.

#### Scenario: No competing call to action is present

- **WHEN** the notify landing page is rendered for any course
- **THEN** the response contains no price, no enrolment control, and no payment instructions

---
### Requirement: The landing page form carries advertising attribution and intent

The landing page SHALL read `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content` from its query string and submit them with the form. It SHALL submit `intent = 'ad_lead'`.

#### Scenario: Attribution survives the form submission

- **WHEN** a visitor reaches the landing page with UTM parameters in the query string and submits the form
- **THEN** the created waitlist row carries those UTM values and `intent = 'ad_lead'`

#### Scenario: A direct visit without parameters still converts

- **WHEN** a visitor reaches the landing page with no UTM parameters and submits the form
- **THEN** the row is created with `intent = 'ad_lead'` and NULL UTM columns

---
### Requirement: The landing page form includes a honeypot field

Because the landing page is a public entry point for paid traffic, its form SHALL include a hidden field that human visitors leave empty, and SHALL submit that field to the capture endpoint.

#### Scenario: The hidden field is present but not visible

- **WHEN** the landing page renders its form
- **THEN** the form contains a honeypot input that is hidden from sighted users and from assistive technology

#### Scenario: A bot completing every field is discarded

- **WHEN** an automated agent fills every input including the honeypot and submits
- **THEN** the response is a normal success response and no waitlist row is created
