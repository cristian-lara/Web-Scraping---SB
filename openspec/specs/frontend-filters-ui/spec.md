## Purpose

Defines the React client (Vite) behavior for Milestone 2 end-user exercise of the product vertical: login to obtain a JWT, attach Bearer credentials on subsequent API calls, select Filter A or Filter B, and present filtered entry results in a table with explicit loading, empty, and error states. Client forms MUST validate via `@hookform/resolvers/zod` sharing applicable rules from `@repo/shared-types` (EC-UI-ZOD / backlog F2-4 AC6). The results table MUST be built with Shadcn/ui and Tailwind. TanStack Query MUST drive request lifecycle states (loading/error/success). MVP MUST NOT offer pagination.

## Requirements

### Requirement: Login obtains JWT and attaches Bearer on subsequent API calls
When the user submits valid credentials in the login UI, the client MUST obtain a JWT from the auth API and MUST attach that token as an `Authorization: Bearer` credential on subsequent authenticated API calls (e.g. filter requests). Unauthenticated filter requests MUST NOT be the normal post-login path.

#### Scenario: HP-UI-OK login then Bearer
- **WHEN** the user submits valid credentials in the UI
- **THEN** the client MUST obtain a JWT and MUST send `Authorization: Bearer <token>` on subsequent API calls that require authentication

### Requirement: Filter A/B request shows loading while in flight
When the user selects Filter A or Filter B and requests results, the UI MUST show an explicit loading state while the request is in flight. TanStack Query (or equivalent) MAY drive this state; the requirement is a visible loading outcome, not a blank or frozen screen.

#### Scenario: EC-UI-LOAD request in flight
- **WHEN** the user selects Filter A or Filter B and a results request is in flight
- **THEN** the UI MUST show an explicit loading state until the request settles

### Requirement: Non-empty filtered list renders results table
When the authenticated filter API returns a non-empty list, the UI MUST render a results table that includes at least `rank`, `title`, `points`, and `comments` for each entry so MVP review can verify filter outcomes.

#### Scenario: HP-UI-OK non-empty table
- **WHEN** the API returns a non-empty filtered list after a Filter A or Filter B request
- **THEN** the UI MUST display a table with at least rank, title, points, and comments for the returned entries

### Requirement: Empty filtered list shows explicit empty state
When the authenticated filter API returns an empty list (`[]`), the UI MUST show an explicit empty state. The UI MUST NOT present a blank or broken table as the only feedback.

#### Scenario: EC-UI-EMPTY empty list
- **WHEN** the API returns an empty filtered list
- **THEN** the UI MUST show an explicit empty state and MUST NOT leave the user with a blank or broken table alone

### Requirement: API failure shows error state without white screen
When a filter (or other required) API call fails due to network error, 4xx, or 5xx, the UI MUST show an understandable error state. The failure MUST NOT result in an uncaught white screen or total UI crash for that path.

#### Scenario: EC-UI-ERR network or HTTP failure
- **WHEN** the API call fails with a network error, 4xx, or 5xx
- **THEN** the UI MUST show an understandable error state and MUST NOT present an uncaught white screen

### Requirement: Client form validation via hookform resolvers and shared Zod rules
Login and filter-related forms/inputs MUST be validated on the client with `@hookform/resolvers/zod`. Validation rules MUST share schemas or equivalent constraints from `@repo/shared-types` where applicable so client checks align with shared contracts. Invalid input MUST be rejected on the client before relying on a server `500` (or equivalent unhandled failure) for basic validation.

#### Scenario: EC-UI-ZOD invalid form input
- **WHEN** the user submits invalid login or filter form input
- **THEN** the client MUST reject the input via `@hookform/resolvers/zod` using shared schemas/rules from `@repo/shared-types` where applicable, without relying on a server `500` for that validation

### Requirement: No pagination in MVP UI
The MVP React UI MUST NOT provide pagination controls for filter results and MUST NOT use a paged API contract for those results. The full filtered list returned by the API SHALL be presented without page navigation or infinite-scroll paging in this change.

#### Scenario: EC-UI-NOPAGE no pagination
- **WHEN** the MVP UI is reviewed for filter results presentation
- **THEN** there MUST be no pagination controls and no paged API usage for those results

### Requirement: Unknown client route shows a 404 page
When the user navigates to a client path that is not the login or filter screen, the UI MUST render an explicit 404 page. The page MUST keep the product name visible, MUST state that the route does not exist, and MUST offer a primary action back to the app (filter screen when signed in, login when signed out). The unknown-route path MUST NOT be a blank crash or uncaught white screen.

#### Scenario: EC-UI-404 unknown client route
- **WHEN** the user opens an unknown client route
- **THEN** the UI MUST show a 404 page with a clear not-found message and a primary CTA to the filter screen if authenticated, or to login if unauthenticated

### Requirement: Save results control after successful filter
After an authenticated Filter A or Filter B request returns a successful (settled) result list, the UI MUST offer an explicit control to save those results. Activating the control MUST call the authenticated save API with the applied filter and the returned entries. While the save request is in flight, the UI MUST show a clear busy/disabled state on the control. On save failure, the UI MUST show an understandable error without a white screen.

#### Scenario: Save after successful filter
- **WHEN** the user has a successful Filter A or Filter B result list on screen
- **THEN** the UI MUST show a Save results control
- **AND** activating it MUST send an authenticated save request with that filter and those entries

#### Scenario: Save error is visible
- **WHEN** the save API call fails with a network error, 4xx, or 5xx
- **THEN** the UI MUST show an understandable error state
- **AND** MUST NOT present an uncaught white screen

### Requirement: Saved results list visible in the filters UI
The filters UI MUST present a list of the authenticated user's saved filter results (at least id or label, savedAt, filter_applied, and entryCount). The list MUST refresh after a successful save (or equivalently refetch so the new save appears). Empty list MUST show an explicit empty state, not a broken table.

#### Scenario: List shows user saves
- **WHEN** the authenticated user views the filters UI with one or more saves
- **THEN** the UI MUST list those saves with savedAt, filter_applied, and entryCount (and id or label)

#### Scenario: Empty saved list state
- **WHEN** the authenticated user has zero saved filter results
- **THEN** the UI MUST show an explicit empty state for the saved list

