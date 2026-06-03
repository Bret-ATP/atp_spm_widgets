# Strategic OKR Widget Pack (Targetprocess)

This repository contains 3 custom widgets for visualizing Strategic Objectives and Key Results (OKRs) in Targetprocess dashboards.

---

## 📦 Included Widgets

- Strategic Objectives Status  
- Strategic Objectives Summary  
- Strategic OKR Summary (Objectives + Key Results)

All widgets:
- Use native Strategic Objectives and Key Results data
- Automatically calculate status from progress (no Status field required)
- Include preview images (no setup required)

---

## ⚠️ Prerequisites (IMPORTANT)

Before installing these widgets, your Targetprocess instance must have the OKR Solution enabled.

These widgets rely on:
- Strategic Objectives
- Key Results
- Progress tracking

### ✅ How to Check

1. Click the **gear icon (Settings)**
2. Go to **Solutions / Installed Solutions**
3. Confirm you see:
   - Strategic Objectives
   - Key Results

### ❌ If Not Installed

Contact your Targetprocess administrator to enable the OKR Solution.

---

## ✅ Installation (Step-by-Step)

### Step 1 — Copy the Widget Code

1. Open this file in GitHub:

   js/tp-widget-pack.js

2. Click **Raw**

3. Select all the code (Ctrl+A or Cmd+A)

4. Copy it

---

### Step 2 — Open Mashups in Targetprocess

1. Click the **gear icon (Settings)**
2. Select **Mashups**

---

### Step 3 — Add a New Mashup

1. Click **+ Add Mashup**
2. Enter a name:

   Strategic OKR Widgets

3. Paste the copied code

---

### Step 4 — Set Placeholder (CRITICAL STEP)

Find the **Placeholder** field and enter:

restui_board

---

### Step 5 — Save

Click **Save**

✅ Installation is complete

---

## ✅ Add Widgets to a Dashboard

1. Go to a dashboard
2. Click **+ Add Widget**
3. Search for:

   Strategic

4. Add any of the following:

- Strategic Objectives Status  
- Strategic Objectives Summary  
- Strategic OKR Summary  

---

## 🎯 What You Will See

- Visual status based on progress
- Objective-level summaries
- Key Results nested under each Objective
- Preview images in the widget picker

---

## 🧠 Notes

Status thresholds:
- 70% and above → On Track
- 40–69% → At Risk
- Below 40% → Critical

No custom Status field is required.

Key Results display automatically if they exist.

---

## ⚠️ Known Limitations

- Key Results are loaded separately for each Objective  
- Performance may slow in environments with large numbers of Objectives

---

## 🔧 Troubleshooting

### Widgets do not appear
- Refresh the page
- Confirm mashup was saved
- Confirm placeholder = restui_board

### No data showing
- Confirm OKR Solution is installed
- Confirm Strategic Objectives exist

### Preview images not loading
- Ensure access to GitHub is not blocked

---

## 📁 Repository Structure

/js → mashup install file  
/img → preview images (used automatically)

---

## ✅ Summary

This widget pack provides:

- Plug-and-play installation  
- No configuration required  
- Works across environments  
- Visual OKR reporting out of the box
