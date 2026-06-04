# Strategic OKR Widget Pack (Targetprocess)

This repository provides a set of custom dashboard widgets for visualizing Strategic Objectives and Key Results (OKRs) in Targetprocess (Apptio Targetprocess).

The widgets are designed to be **plug-and-play**, require **no configuration**, and include **interactive modal navigation** so you can explore entities directly from dashboards.

---

## 📦 Included Widgets

This pack includes 3 widgets:

- Strategic Objectives Status
- Strategic Objectives Summary
- Strategic OKR Summary (Objectives + Key Results)

### ✅ Shared Capabilities

All widgets:

- Use native Strategic Objectives and Key Results data
- Require no configuration
- Automatically calculate status from progress
- Display Key Results nested under Objectives
- Include preview images in the widget picker
- Support click-through modal navigation

---

## ✨ Interactive Modal Navigation

You can now click directly on:

- Strategic Objectives
- Key Results

This opens the entity in a modal overlay:

- Removes left-side navigation (folders/sidebar)
- Preserves full Targetprocess entity behavior
- Supports navigation within the modal (tabs, relationships, etc.)
- Maintains breadcrumbs and back navigation
- Allows scrolling for large entities
- Keeps your place on the dashboard when closed

---

## ⚠️ Prerequisites (IMPORTANT)

Before installing, your Targetprocess instance must have the OKR Solution enabled.

These widgets depend on:

- Strategic Objectives
- Key Results
- Progress tracking

### ✅ How to Verify

1. Click **Settings (gear icon)**
2. Go to **Solutions / Installed Solutions**
3. Confirm you see:
   - Strategic Objectives
   - Key Results

### ❌ If Missing

Contact your Targetprocess administrator to enable the OKR Solution.

---

## ✅ Installation (Step-by-Step)

### Step 1 — Copy the Widget Code

1. Open:
   js/tp-widget-pack.js

2. Click **Raw**

3. Select all code (Ctrl+A / Cmd+A)

4. Copy it

---

### Step 2 — Open Mashups

1. Go to **Settings (gear icon)**
2. Select **Mashups**

---

### Step 3 — Create Mashup

1. Click **+ Add Mashup**
2. Enter a name (example):
   Strategic OKR Widget Pack

3. Paste the copied code

---

### Step 4 — Set Placeholder (CRITICAL)

Set:

restui_board

---

### Step 5 — Save

Click **Save**

✅ Installation complete

---

## ✅ Add Widgets to a Dashboard

1. Open a dashboard
2. Click **+ Add Widget**
3. Search or browse under:
   OKR or Strategic Objectives

4. Add any widget:

- Strategic Objectives Status  
- Strategic Objectives Summary  
- Strategic OKR Summary  

---

## 🎯 What You Will See

- Objective-level summaries
- Key Results nested under each Objective
- Progress bars and calculated status
- Clear visual hierarchy of OKRs
- Clickable rows that open detailed modal views

---

## 🧠 Status Logic

Status is automatically calculated from progress:

- ≥ 70% → On Track
- 40–69% → At Risk
- < 40% → Critical

No custom Status field is required.

---

## 🖱️ How to Use

- Click any Strategic Objective card
- Click any Key Result row

This opens a modal where you can:

- View full entity details
- Navigate tabs (Description, Key Results, Relations, etc.)
- Click into related entities
- Use native navigation inside the modal
- Close to return instantly to the dashboard

---

## ⚠️ Known Limitations

- Key Results are loaded per Objective (API-based)
- Large data sets may impact performance
- Modal relies on Targetprocess UI structure (may vary slightly across versions)

---

## 🔧 Troubleshooting

### Widgets do not appear

- Refresh the page
- Confirm mashup was saved
- Confirm placeholder = restui_board

---

### No data showing

- Confirm OKR Solution is installed
- Confirm Strategic Objectives exist
- Confirm user has permission to view data

---

### Modal issues

- Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Ensure latest mashup code is deployed

---

### Scroll issues inside modal

- Reload the page
- Ensure no browser extensions interfere with iframe behavior

---

### Preview images not loading

- Ensure GitHub access is allowed in your environment

---

## 📁 Repository Structure

/js → mashup install file  
/img → widget preview images  

---

## ✅ Summary

This widget pack provides:

- Plug-and-play installation  
- No configuration required  
- Works across environments  
- Visual OKR reporting  
