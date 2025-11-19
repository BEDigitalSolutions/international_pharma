# Solutions - Application Structure Definition (v3)

## Layout Structure

The application uses a **three-panel layout** with the following default proportions:

- **Left Panel (Menu)**: 1/8 of screen width (approximately 200px, resizable between 160px-400px)
  - Background: Light (bg-slate-100)
  - Selected menu item: Highlighted with blue background (bg-blue-100) and left border (border-l-4 border-blue-500)
  - H1 menu levels (Reports, Data Entry, Master Data, Supervisor): Highlighted with background (bg-slate-200), border, and bold font
- **Center Panel (Selection)**: 2/6 of screen width (resizable)
- **Right Panel (Editing)**: 3/6 of screen width (resizable)

### Layout Exceptions

Some modules may use different layouts:

- **Sales Data**: No center panel (1/8 - 0 - 7/8)
- **Reports** (Sales Trends, Sales Analysis): Full-screen iframe layout (1/8 - 0 - 7/8, iframe takes full remaining space)
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

## Power BI Integration Configuration

The application integrates with Power BI Services to display reports in iframes. Configuration is managed through environment variables.

### Environment Variables

Create a `.env` file in the `Mockup_Folder` directory with the following variables:

```env
# Power BI Workspace/Organization
VITE_POWERBI_WORKSPACE=powerbi://api.powerbi.com/v1.0/myorg/Demos

# Power BI Report IDs - Sales Trends Report
VITE_POWERBI_REPORT_SALES_TRENDS_GROUP_ID=bb2b36c4-8e79-48c3-8e0e-beeffcbcd6bc
VITE_POWERBI_REPORT_SALES_TRENDS_ID=374c879d-18c6-4eb8-96e8-5b1ad102369d
VITE_POWERBI_REPORT_SALES_TRENDS_SECTION=ReportSection6d07f950286975e21292

# Power BI Report IDs - Sales Analysis Report
VITE_POWERBI_REPORT_SALES_ANALYSIS_GROUP_ID=ca1ac1fe-67ba-4206-835d-c1eca37a3e53
VITE_POWERBI_REPORT_SALES_ANALYSIS_ID=703b9b8b-737c-4969-bade-6679da8c6e82
VITE_POWERBI_REPORT_SALES_ANALYSIS_SECTION=ReportSection3202ee6d4de9c00a3480
```

### Configuration Details

- **Workspace**: The Power BI workspace identifier using the format `powerbi://api.powerbi.com/v1.0/myorg/{WORKSPACE_NAME}`
- **Group ID**: The workspace/group ID where the report is located
- **Report ID**: The unique identifier for the Power BI report
- **Section**: Optional section identifier for specific report sections

### Implementation Notes

- Environment variables are read at build time by Vite (prefixed with `VITE_`)
- The Power BI embed URLs are constructed dynamically from these variables
- For production deployments, ensure proper authentication is configured
- The `.env` file should not be committed to version control (see `.gitignore`)
- A `.env.example` file is provided as a template

### Access Requirements

To embed Power BI reports via iframe, ensure:

1. **Report Sharing**: The Power BI reports must be shared with appropriate permissions
2. **Workspace Access**: Users must have access to the Power BI workspace
3. **Authentication**: For authenticated embedding, Azure AD app registration may be required
4. **CORS**: Power BI Services must allow embedding from your application domain

### Content Security Policy (CSP) Limitations

**Important:** Power BI has strict Content Security Policy (CSP) restrictions that prevent direct iframe embedding from `localhost` or custom domains. The `frame-ancestors` directive only allows embedding from specific Microsoft domains (Teams, Office, etc.).

**Development Environment:**
- Direct iframe embedding from `localhost:5173` will be blocked by CSP
- The application displays an informational message explaining the limitation
- URLs are correctly constructed and logged to console for verification

**Production Solutions:**

1. **Power BI Embedded (Azure)** - Recommended for production:
   - Register an Azure AD application
   - Use Power BI REST API to get embed tokens
   - Use Power BI JavaScript SDK (`powerbi-client`) for authenticated embedding
   - Requires Azure subscription and Power BI Pro/Premium licenses

2. **Publish Report with Embed Token**:
   - Configure report sharing settings
   - Generate embed tokens via Power BI REST API
   - Use tokens for authenticated iframe embedding

3. **Proxy Server**:
   - Create a backend service that handles Power BI authentication
   - Proxy requests to Power BI from your domain
   - Serve the embedded content through your domain

**Current Implementation:**
- Environment variables are correctly configured
- URLs are dynamically constructed from configuration
- Placeholder UI shows configuration status and production requirements
- Ready for production implementation with proper authentication setup

### Files

- Configuration utility: `src/lib/powerbi.ts`
- Environment template: `.env.example`
- Environment file: `.env` (not in version control)

---

## Module Definitions

### # Reports

#### ## Sales Trends

**Layout**: Full-screen iframe (1/8 - 0 - 7/8)

**Right Panel (H4)**:

- Full-screen Power BI iframe displaying Sales Trends report
- URL configured via environment variables
- Note: In development (localhost), CSP restrictions prevent direct embedding; informational message is displayed instead

#### ## Sales Analysis

**Layout**: Full-screen iframe (1/8 - 0 - 7/8)

**Right Panel (H4)**:

- Full-screen Power BI iframe displaying Sales Analysis report
- URL configured via environment variables
- Note: In development (localhost), CSP restrictions prevent direct embedding; informational message is displayed instead

---

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

**Layout**: Special layout - No center panel (1/8 - 0 - 7/8)

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
- **Group headers (Grup1, Grup2, etc.)**: Left-aligned (not centered), read-only, displayed with background highlight
- **Turnover columns**: Calculated automatically as `Vol. × Price`
  - Formula: `Turnover = Vol. × Price` (only calculates if both Vol. and Price have values)
  - Read-only (gray, non-editable)
  - Auto-updates when Vol. or Price changes
- **Volume highlighting**: If Vol. for a month is 100% or more higher than the previous month, the cell background is highlighted in orange (bg-orange-200)
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
    - Units (editable)
    - ASP $/vial (editable)
    - Market Sales (calculated - read-only)
    - MarketShare (calculated - read-only)
  - **Intersection**: Value

**Calculation definitions**:

- **Market Sales**: Calculated automatically as `Units × ASP $/vial`
  - Formula: `Market Sales = Units × ASP $/vial`
  - Only calculates if both Units and ASP $/vial have values
  - Read-only (gray, non-editable)
  - Auto-updates when Units or ASP $/vial changes

- **MarketShare**: Calculated automatically as `Market Sales / Total Market Sales`
  - Formula: For each company row, `MarketShare = (Company's Market Sales) / (Sum of all Companies' Market Sales)`
  - Result displayed as percentage (e.g., "25.5%")
  - Read-only (gray, non-editable)
  - Auto-updates when any Market Sales value changes

**Editing behavior**:

- Click directly on cell → inline text field for editing
- Calculated fields (Market Sales, MarketShare): Read-only (gray, non-editable), auto-updated when source values change

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
  - **Tipo de cambio €**: Table with the following structure:
    - **Title**: "Tipo de cambio €"
    - **Columns**:
      - Contravalor (text input, editable)
      - Fecha inicial (date input with calendar selector or direct entry with short date format DD/MM/YYYY)
      - Fecha Final (date input with calendar selector or direct entry with short date format DD/MM/YYYY)
      - Acción (delete button for each row)
    - **Behavior**:
      - Multiple rows supported (add/remove rows dynamically)
      - "+ Agregar fila" button to add new rows
      - Delete button (✕) appears for each row when there is more than one row
      - Date fields support both calendar picker and direct text entry
      - Date format: DD/MM/YYYY (short date format)

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
    - Field: "Cumulative Selected countries"
    - Checkboxes to the left of each country name for multiple selection
    - Scrollable list with all countries
  - **Right column**: Functions assignment
    - Field: "Cumulative Selected Functions"
    - Functions are automatically assigned based on selected group/user:
      - **Data Entry Managers**: Reports, Data Entry
      - **Country Users**: Reports, Data Entry, MasterData
      - **Supervisors**: Reports, Data Entry, MasterData, Users, Supervisor
      - **Read-Only Users**: Reports
    - Functions are displayed as read-only list (not editable dropdown)

**Center Panel - Users Tab**:

- User cards display only:
  - Name (font-semibold)
  - Email (text-slate-500)
  - Profile/group information is not displayed in the card

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
  - Countries: Spain, France, Germany, Italy, United Kingdom
- Maria Garcia – `maria.garcia@grifols.com` – group: Data Entry Managers
  - Countries: Portugal, Netherlands, Belgium, Switzerland
- Pierre Dubois – `pierre.dubois@grifols.com` – group: Country Users
  - Countries: France, Belgium, Switzerland, Austria, Sweden
- Anna Müller – `anna.muller@grifols.com` – group: Country Users
  - Countries: Germany, Austria, Netherlands, Denmark
- David Johnson – `david.johnson@grifols.com` – group: Supervisors
  - Countries: United States, Canada, Mexico, Brazil, Argentina

### Currencies (`currencies`)

- € (EUR)
- $ (USD)
- £ (GBP)
- ¥ (JPY)
- Peso (MXN)
- Real (BRL)
- Yuan (CNY)
