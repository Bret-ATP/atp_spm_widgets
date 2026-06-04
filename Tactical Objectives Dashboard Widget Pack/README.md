# Tactical OKR Widget Pack (Targetprocess)

This repository provides a set of custom dashboard widgets for visualizing **Tactical Objectives** and related **Key Results** in Targetprocess (Apptio Targetprocess).

The widgets are designed to be **plug-and-play**, require **no configuration**, and include **interactive modal navigation** so you can explore entities directly from dashboards.

> This pack is the Tactical Objective version of the Strategic OKR Widget Pack. It uses the same widget behavior, status logic, layout, modal interaction model, and preview screenshots, but points to the `TacticalObjective` / `TacticalObjectives` entity instead of `StrategicObjective` / `StrategicObjectives`.

---

## 📦 Included Widgets

This pack includes 3 widgets:

- **Tactical Objectives Status**
- **Tactical Objectives Summary**
- **Tactical OKR Summary** — Tactical Objectives + Key Results

---

## ✅ Shared Capabilities

All widgets:

- Use native **Tactical Objectives** and **Key Results** data
- Require no configuration
- Automatically calculate status from progress
- Display Key Results nested under Objectives where applicable
- Include preview images in the widget picker
- Support click-through modal navigation

---

## ✨ Interactive Modal Navigation

You can click directly on:

- Tactical Objectives
- Key Results

This opens the selected entity in a modal overlay:

- Removes left-side navigation/folder sidebar from the dashboard experience
- Preserves native Targetprocess entity behavior
- Supports navigation within the modal, including tabs and relationships
- Maintains breadcrumbs and back navigation where supported by the Targetprocess UI
- Allows scrolling for large entities
- Keeps your place on the dashboard when the modal is closed

---

## ⚠️ Prerequisites

Before installing, your Targetprocess instance must have the OKR-related solution/configuration enabled and must expose the following entities/data:

- Tactical Objectives
- Key Results
- Progress tracking

### How to Verify

- Click **Settings** — gear icon
- Go to **Solutions / Installed Solutions**
- Confirm that the OKR/objective solution is installed and that **Tactical Objectives** and **Key Results** are available

### If Missing

Contact your Targetprocess administrator to enable or expose the required OKR/objective entities.

---

## ✅ Installation

### Step 1 — Copy the Widget Code

Open the JavaScript file for this pack:

```text
js/tp-to-widget-pack.js
```

Then:

- Click **Raw**
- Select all code — Ctrl+A / Cmd+A
- Copy it

### Step 2 — Open Mashups

- Go to **Settings** — gear icon
- Select **Mashups**

### Step 3 — Create Mashup

- Click **+ Add Mashup**
- Enter a name, for example:

```text
Tactical OKR Widget Pack
```

- Paste the copied code

### Step 4 — Set Placeholder

Set the placeholder to:

```text
restui_board
```

### Step 5 — Save

Click **Save**.

Installation is complete.

---

## ✅ Add Widgets to a Dashboard

- Open a dashboard
- Click **+ Add Widget**
- Search or browse under:

```text
OKR
Tactical Objectives
```

- Add any widget:
  - **Tactical Objectives Status**
  - **Tactical Objectives Summary**
  - **Tactical OKR Summary**

---

## 🎯 What You Will See

- Tactical Objective-level summaries
- Key Results nested under each Objective where applicable
- Progress bars and calculated status
- Clear visual hierarchy of OKRs
- Clickable rows/cards that open detailed modal views

---

## 🧠 Status Logic

Status is automatically calculated from progress:

- **≥ 70%** → On Track
- **40–69%** → At Risk
- **< 40%** → Critical

No custom Status field is required.

---

## 🖱️ How to Use

- Click any **Tactical Objective** card or row
- Click any **Key Result** row

This opens a modal where you can:

- View full entity details
- Navigate tabs such as Description, Key Results, Relations, etc.
- Click into related entities
- Use native Targetprocess navigation inside the modal
- Close the modal to return instantly to the dashboard

---

## 🖼️ Preview Images

This Tactical Objective pack intentionally reuses the same preview screenshots as the Strategic Objective widget pack.

The screenshots are representative of the widget layout and behavior. Only the underlying entity reference changes from Strategic Objectives to Tactical Objectives.

---

## ⚠️ Known Limitations

- Key Results are loaded per Objective through API calls
- Large data sets may impact performance
- Modal behavior relies on the Targetprocess UI structure and may vary slightly across versions/configurations
- If Tactical Objectives do not expose Progress or Key Results the same way as Strategic Objectives in your environment, the API include paths may need to be adjusted

---

## 🔧 Troubleshooting

### Widgets do not appear

- Refresh the page
- Confirm the mashup was saved
- Confirm the placeholder is set to:

```text
restui_board
```

### No data showing

- Confirm the OKR/objective solution is installed
- Confirm **Tactical Objectives** exist
- Confirm the user has permission to view Tactical Objectives
- Confirm Progress is available for Tactical Objectives

### Key Results do not appear

- Confirm Key Results are related to Tactical Objectives in your Targetprocess configuration
- Confirm the user has permission to view Key Results
- Confirm the Key Results API relationship is available from Tactical Objectives

### Modal issues

- Hard refresh the browser — Ctrl+Shift+R / Cmd+Shift+R
- Ensure the latest mashup code is deployed
- Confirm modal links use the `tacticalobjective` page reference

### Scroll issues inside modal

- Reload the page
- Ensure no browser extensions interfere with iframe behavior

### Preview images not loading

- Ensure GitHub raw image access is allowed in your environment
- This pack currently reuses the same preview screenshots as the Strategic Objective pack

---

## 📁 Suggested Repository Structure

```text
/tactical-objectives
  README.md
  /js
    tp-to-widget-pack.js
  /img
    reusable preview screenshots
```

If you are keeping Strategic, Ultimate, and Tactical Objective packs separate during experimentation, a structure like this works well:

```text
/strategic-objectives
  README.md
  /js
    tp-so-widget-pack.js

/ultimate-objectives
  README.md
  /js
    tp-uo-widget-pack.js

/tactical-objectives
  README.md
  /js
    tp-to-widget-pack.js
```

---

## ✅ Summary

This widget pack provides:

- Plug-and-play installation
- No configuration required
- Tactical Objective dashboard reporting
- Key Result visibility where applicable
- Progress-based status calculation
- Click-through modal navigation
- Reused screenshots from the Strategic Objective pack
- A clean standalone path for testing Tactical Objectives before merging packs later
