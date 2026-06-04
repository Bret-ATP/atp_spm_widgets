# Tactical Objectives Widget Pack (Targetprocess)

This pack provides dashboard widgets for tactical objectives in Targetprocess / Apptio Targetprocess.

## Included Widgets

- **Tactical Objectives Status** — aggregate progress/status gauge and RAG distribution.
- **Tactical Objectives Summary** — card grid with objective progress, calculated status, and state.
- **Tactical OKR Summary** — objective card grid with nested Key Results.

## Key Capabilities

- Uses native **Tactical Objectives** data from `/api/v1/TacticalObjectives`.
- Uses native `EntityState` data for state filtering.
- Calculates visual status from progress:
  - `>= 70%` → **On Track**
  - `40–69%` → **At Risk**
  - `< 40%` → **Critical**
- Provides click-through modal navigation for objectives and Key Results.
- Hides the Targetprocess left/folder navigation inside modal entity views.
- Applies a small modal content inset so entity details are not clipped at the left edge.
- Removes duplicate internal widget title headers so the Targetprocess dashboard block title is the only visible widget title.

## State Filtering

Each widget includes a shared **State** filter bar at the top of the widget body.

Example:

```text
State: Total: 12  [All] [Draft (9)] [In Progress (3)]
```

### How Filtering Works

- Filter options are discovered from the `Tactical Objectives` returned by the API.
- Counts appear in parentheses, for example `Draft (9)`.
- Selecting one or more state pills filters the widget client-side.
- Selecting **All** clears the state filter.
- Filters are synchronized across widgets in the same pack:
  - filtering in **Tactical Objectives Status** updates **Tactical Objectives Summary** and **Tactical OKR Summary**;
  - filtering in **Tactical Objectives Summary** updates the other widgets;
  - filtering in **Tactical OKR Summary** updates the other widgets.
- The Status widget recalculates its percentage and RAG distribution using only the filtered objective set.

### Filtering Persistence

Filtering is currently **session-only** and **client-side**.

- Filters reset to the default **All** state when the dashboard page is reloaded.
- Filters are not written back to Targetprocess.
- Filters are not persisted in browser storage.
- Filters are scoped to this widget pack only and do not currently read Targetprocess dashboard-level filters.

## Installation

1. Open **Settings → Mashups** in Targetprocess.
2. Create or edit the mashup for this widget pack.
3. Paste the full JavaScript file for this pack.
4. Set the placeholder to:

```text
restui_board
```

5. Save the mashup.
6. Refresh the dashboard.
7. Add the widgets from the dashboard widget picker.

## Notes and Limitations

- Filtering is based on `EntityState.Id` internally and displays `EntityState.Name` to users.
- If no objectives exist for a state, that state will not appear as a filter option.
- Key Results are loaded per objective for the OKR Summary widget.
- Large datasets may impact initial load time because filtering is currently client-side.
- State filter selections intentionally reset on page reload.
