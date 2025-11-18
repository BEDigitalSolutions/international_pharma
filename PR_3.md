# Solutions - Application Structure Definition (v3)

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

- Data matrix structure with **grouped rows** and **nested columns**:
  - **Column structure**:
    - **Main columns**: Months (January, February, March, April, ...)
    - **Subcolumns** (within each month):
      - Patients
      - Dose
      - Vol. (Volume)
  - **Row structure**:
    - **Groups** (Grup1, Grup2, Grup3, ...) - expandable/collapsible
      - **Products** (nested under each group):
        - Prod 1.1, Prod 1.2, ... (under Grup1)
        - Prod 2.1, Prod 2.2, Prod 2.3, ... (under Grup2)
        - ... (under Grup3, etc.)

**Table structure example**:

```
                    January                    February                   March
            Patients    Dose    Vol.    Patients    Dose    Vol.    Patients    Dose    Vol.
Grup1
  Prod 1.1
  Prod 1.2
Grup2
  Prod 2.1
  Prod 2.2
  Prod 2.3
Grup3
  ...
```

**Editing behavior**:

- Click directly on cell → inline text field for editing
- Calculated fields (if any): Read-only (gray, non-editable)
- Groups can be expanded/collapsed to show/hide products

---

#### ## Sales Data

**Layout**: Special layout - No center panel (1/6 - 0 - 5/6)

**Right Panel (H4)**:

- Data matrix structure with **grouped rows** and **nested columns**:
  - **Column structure**:
    - **Main columns**: Months (January, February, March, April, ...)
    - **Subcolumns** (within each month):
      - Vol. (Volume)
      - Price
      - Turnover
  - **Row structure**:
    - **Groups** (Grup1, Grup2, Grup3, ...) - expandable/collapsible
      - **Products** (nested under each group):
        - Prod 1.1, Prod 1.2, ... (under Grup1)
        - Prod 2.1, Prod 2.2, Prod 2.3, ... (under Grup2)
        - ... (under Grup3, etc.)

**Table structure example**:

```
                    January                    February                   March
            Vol.    Price    Turnover    Vol.    Price    Turnover    Vol.    Price    Turnover
Grup1
  Prod 1.1
  Prod 1.2
Grup2
  Prod 2.1
  Prod 2.2
  Prod 2.3
Grup3
  ...
```

**Editing behavior**:

- Click directly on cell → inline text field for editing
- Calculated fields (if any): Read-only (gray, non-editable)
- Groups can be expanded/collapsed to show/hide products

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
  - Multiple product groups with nested products
  - Several users and groups
  - Sample data for matrices (Patients, Sales, Market Insights)
- For the current HTML mockup implementation, a **concrete list of example values** is defined (see *Appendix: Values used in `mockup.html`*).

---

## Implementation Notes

- No data persistence (static mockup)
- All interactions are UI-only (no backend)
- Click interactions log to console for tracking
- Modified/edited items can be flagged visually
- Placeholder modules show "Not yet defined" message
- **Table structure**: Nested columns (months with subcolumns) and grouped rows (groups with nested products) require hierarchical table rendering

---

## Appendix: Values used in `mockup.html`

This appendix lists the concrete example values used in the current `mockup.html` prototype.
They are **implementation examples** and can be extended or modified in future iterations.

### Countries (`countries`)

Countries are grouped by **continent/region**.The initial mockup uses a subset of these values; additional countries are provided for future extension and testing.

- **Europe**

  - Spain
  - France
  - Germany
  - Italy
  - United Kingdom
  - Portugal
  - Netherlands
  - Belgium
  - Switzerland
  - Austria
  - Sweden
  - Norway
  - Denmark
  - Finland
  - Ireland
  - Poland
  - Czech Republic
  - Hungary
  - Greece
  - Romania
  - Bulgaria
- **North America**

  - United States
  - Canada
  - Mexico
  - Guatemala
  - Costa Rica
  - Panama
  - Cuba
  - Dominican Republic
- **South America**

  - Brazil
  - Argentina
  - Chile
  - Peru
  - Colombia
  - Ecuador
  - Uruguay
  - Paraguay
  - Bolivia
  - Venezuela
- **Asia**

  - Japan
  - China
  - India
  - South Korea
  - Singapore
  - Thailand
  - Malaysia
  - Vietnam
  - Philippines
  - Indonesia
  - Saudi Arabia
  - United Arab Emirates
- **Africa**

  - South Africa
  - Egypt
  - Morocco
  - Algeria
  - Nigeria
  - Kenya
  - Tanzania
  - Ghana
- **Oceania**

  - Australia
  - New Zealand
  - Fiji
  - Papua New Guinea

### Products (`products`)

- Albumin 20%
- Albumin 25%
- IVIG
- Factor VIII
- Factor IX
- Fibrinogen
- Prothrombin Complex
- Antithrombin III

### Companies (`companies`)

- Grifols
- CSL Behring
- Octapharma
- Takeda
- Baxalta
- Kedrion
- LFB
- Bio Products Laboratory

### Months (`months`)

- January
- February
- March
- April
- May
- June
- July
- August
- September
- October
- November
- December

### User Groups (`groups`)

- Data Entry Managers
- Country Users
- Supervisors
- Read-Only Users

### Users (`users`)

- John Smith – `john.smith@grifols.com` – group: Data Entry Managers
- Maria Garcia – `maria.garcia@grifols.com` – group: Data Entry Managers
- Pierre Dubois – `pierre.dubois@grifols.com` – group: Country Users
- Anna Müller – `anna.muller@grifols.com` – group: Country Users
- David Johnson – `david.johnson@grifols.com` – group: Supervisors

### Currencies (`currencies`)

- € (EUR)
- $ (USD)
- £ (GBP)
- ¥ (JPY)
- Peso (MXN)
- Real (BRL)
- Yuan (CNY)
