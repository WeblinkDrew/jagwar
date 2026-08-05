# Dashboard Experience Specification

## Purpose

Define Jagwar dashboard routing, dashboard-only navigation, additive settings, inherited Projects preservation, and locale parity. This capability depends on authenticated workspace and entitlement state but MUST NOT become an authorization boundary.

## Requirements

### Requirement: Dashboard routing has a safe default

An active subscriber without a valid authorized return route MUST land on the Jagwar dashboard. A valid authorized return route MAY be honored. Route selection MUST NOT bypass server authorization.

#### Scenario: Active subscriber has no valid return route

- GIVEN an authenticated active subscriber has no valid authorized return route
- WHEN post-authentication routing completes
- THEN the user MUST land on the Jagwar dashboard

#### Scenario: Return route is unauthorized

- GIVEN a return route points to a resource the user cannot access
- WHEN routing is resolved
- THEN the route MUST NOT be opened
- AND the dashboard MUST be used as the safe destination

### Requirement: Navigation is isolated from the editor

The system MUST provide a compact left sidebar only on Jagwar dashboard surfaces with primary destinations Dashboard/Projects, Leads, Inbox, and Settings. Leads MUST expose Pipeline, Discover, and Recent Searches. The sidebar MUST use inherited Onlook UI and MUST NOT wrap, restructure, or alter editor or authenticated project routes.

#### Scenario: User navigates dashboard surfaces

- GIVEN a user is on a Jagwar dashboard surface
- WHEN the sidebar is rendered
- THEN all required primary destinations MUST be available

#### Scenario: User opens the editor

- GIVEN a user opens an inherited editor or project route
- WHEN the route renders
- THEN the Jagwar dashboard sidebar MUST NOT wrap or restructure that experience

### Requirement: Projects and settings remain inherited and additive

The dashboard MUST primarily preserve the current Projects experience. Settings MUST open the inherited settings modal, and Jagwar settings MUST extend it additively rather than replace it.

#### Scenario: Existing project workflow is used

- GIVEN an inherited project is available
- WHEN a user accesses it through Dashboard/Projects
- THEN existing Projects behavior MUST remain available except for separately specified additive gates

### Requirement: New UI maintains five-locale parity

Every new user-visible Jagwar key, state, error, notification, and guidance message in this capability MUST have matching keys in English, Spanish, Japanese, Korean, and Chinese catalogs. Missing translations MUST fail the applicable locale-parity acceptance gate rather than silently shipping incomplete catalogs.

#### Scenario: New entitlement error is added

- GIVEN a dashboard change introduces a user-visible entitlement error key
- WHEN locale parity is checked
- THEN the key MUST exist in all five inherited locale catalogs
