## ADDED Requirements

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
)