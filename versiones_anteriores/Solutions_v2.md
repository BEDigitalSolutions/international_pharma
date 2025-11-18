# Solutions - Application Structure Definition (v2)

## Layout Structure

The application uses a **three-panel layout** with the following default proportions:

- **Left Panel (Menu)**: 1/6 of screen width
- **Center Panel (Selection)**: 2/6 of screen width  
- **Right Panel (Editing)**: 3/6 of screen width

### Layout Exceptions

Some modules may use different layouts:
- **Sales Data**: No center panel (1/6 - 0 - 5/6)
- All other modules: Standard 3-panel layout

### Panel Resizing

- Panels are **resizable by dragging borders** between panels
- Resize memory: Widths are remembered per session/module
- Minimum widths: Left panel ≥ 200px, Right panel ≥ 400px

---

## Markdown Structure Rules

The content structure follows these rules:

- **H1 / H2**: Menu levels (H1 = main section, H2 = submenu item)
- **H3**: Defines content for the **Center Panel** (lists, selectors, etc.)
- **H4**: Defines content for the **Right Panel** (forms, matrices, detail views)
- **No heading (plain text/bullets)**: Describes specific content within H3/H4 blocks

---

## Visual Style

- **Corporate colors**: Blue and gray palette
  - Primary blue: #1e40af
  - Gray: #64748b
  - Background: #f1f5f9
  - Accent colors as needed

---

## Module Definitions

### # DataEntry

#### ## ProcessVisibility

*Status: Not yet defined - placeholder*

#### ## Patients News/Dropouts

**Layout**: Standard 3 panels (1/6 - 2/6 - 3/6)

**Center Panel (H3)**:
- List of Countries (selectable)

**Right Panel (H4)**:
- Data matrix structure:
  - **Rows**: Products (Product1, Product2, Product3, Product4, ...)
  - **Columns**: Months (January, February, March, April, ...)
  - **Intersection fields**:
    - Patients
    - Dose
    - Vol. (Volume)

**Editing behavior**:
- Click directly on cell → inline text field for editing
- Calculated fields (if any): Read-only (gray, non-editable)

---

#### ## Sales Data

**Layout**: Special layout - No center panel (1/6 - 0 - 5/6)

**Right Panel (H4)**:
- Data matrix structure:
  - **Rows**: Products (Product1, Product2, Product3, Product4, ...)
  - **Columns**: Months (January, February, March, April, ...)
  - **Intersection fields**:
    - Vol. (Volume)
    - Price
    - TurnOver

**Editing behavior**:
- Click directly on cell → inline text field for editing
- Calculated fields (if any): Read-only (gray, non-editable)

---

#### ## Market Insights

**Layout**: Standard 3 panels (1/6 - 2/6 - 3/6)

**Center Panel (H3)**:
- List of Products (Product1, Product2, ...) - selectable

**Right Panel (H4)**:
- Data matrix structure:
  - **Rows**: Companies (Company1, Company2, Company3, Company4, ...)
  - **Columns**:
    - Units
    - Units (000)
    - Sales Market $ (MM)
    - ASP $/vial
    - Change '23/20 (calculated - read-only)
  - **Intersection**: Value

**Editing behavior**:
- Click directly on cell → inline text field for editing
- Calculated fields ("Change '23/20"): Read-only (gray, non-editable)

---

### # Master data

#### ## Countries setup

**Layout**: Standard 3 panels (1/6 - 2/6 - 3/6)

**Center Panel (H3)**:
- List of Countries (Country1, Country2, Country3, ...) - selectable

**Right Panel (H4)**:
- Form structure: "Title : Data : Entry Type : (Available Values)"
  - **Currency**: Dropdown (€, $, YEN, Peso, ... [full list])
  - **Prices Types**: Dropdown (ASP, Maquila, Ex-Factory)

**Optional**: Search/filter field in center panel (not critical for initial mockup)

---

#### ## Products/Families

*Status: Not yet defined - placeholder*

---

#### ## Pricing

*Status: Not yet defined - placeholder*

---

### # Supervisor

#### ## Users

**Layout**: Standard 3 panels (1/6 - 2/6 - 3/6)

**Center Panel (H3)**:
- **Top buttons**:
  - New ADGroup or User
  - Delete
- **Tabs structure**:
  - Tab 1: Groups (list)
  - Tab 2: Users (list)

**Right Panel (H4)**:
- **Two-column layout** (side by side):
  - **Left column**: Countries assignment
    - Field: "Cumulative Selected countries" - Dropdown (full list of countries)
  - **Right column**: Functions assignment
    - Field: "Cumulative Selected Functions" - Dropdown (DataEntry, MasterData, Supervisor)

**Optional**: Search/filter field in center panel (not critical for initial mockup)

---

#### ## Scenarios

*Status: Not yet defined - placeholder*

---

## Data Requirements for Mockup

- **Realistic example data**:
  - 10+ countries
  - Multiple products (product families)
  - Several users and groups
  - Sample data for matrices (Patients, Sales, Market Insights)

---

## Implementation Notes

- No data persistence (static mockup)
- All interactions are UI-only (no backend)
- Click interactions log to console for tracking
- Modified/edited items can be flagged visually
- Placeholder modules show "Not yet defined" message

