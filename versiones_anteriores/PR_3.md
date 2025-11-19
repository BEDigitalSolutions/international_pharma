# Solutions - Application Structure Definition (v3)

## Layout Structure

The application uses a **three-panel layout** with the following default proportions:

- **Left Panel (Menu)**: 1/8 of screen width (approximately 200px, resizable between 160px-400px)
  - Background: Light (bg-slate-100)
  - Selected menu item: Highlighted with blue background (bg-blue-100) and left border (border-l-4 border-blue-500)
  - H1 menu levels (Reports, Data Entry, Master Data, Supervisor): No specific background, displayed with bold font, uppercase, and tracking-wide styling
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

The application integrates with Power BI Services using **Power BI Embedded with Azure AD authentication**. This implementation uses the Power BI JavaScript SDK to securely embed reports with token-based authentication.

### Architecture Overview

```
Frontend (React + PowerBI JavaScript SDK)
    ↓ Request embed token
Backend API (Node.js/Python/.NET)
    ↓ Authenticate with Azure AD
Azure AD (MSAL)
    ↓ Get access token
Power BI REST API
    ↓ Generate embed token
Frontend
    ↓ Embed report with token
Power BI Service (Report displayed)
```

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

# Azure AD Configuration (for reference, actual auth happens in backend)
VITE_AZURE_AD_CLIENT_ID=your-client-id
VITE_AZURE_AD_TENANT_ID=your-tenant-id

# Backend API URL (for embed token generation)
VITE_BACKEND_API_URL=http://localhost:3000/api
```

### Implementation Components

#### 1. Frontend Components

- **`PowerBIEmbed.tsx`**: React component that uses Power BI JavaScript SDK
  - Fetches embed tokens from backend API
  - Handles report lifecycle (loading, loaded, error events)
  - Displays informative UI when backend is not configured
  
- **`lib/powerbi.ts`**: Power BI configuration and utilities
  - `getPowerBIConfig()`: Reads report configuration from environment variables
  - `getAzureADConfig()`: Reads Azure AD configuration
  - `getEmbedToken()`: Calls backend API to obtain embed tokens
  - `isAzureADConfigured()`: Validates configuration

#### 2. Backend API (Required for Production)

A backend API is **required** to securely generate embed tokens. The frontend cannot do this directly for security reasons (client secrets must never be exposed in frontend code).

**Backend responsibilities:**
1. Authenticate with Azure AD using MSAL (Microsoft Authentication Library)
2. Call Power BI REST API to generate embed tokens
3. Return embed token to frontend

**Example endpoint:**
```
POST /api/powerbi/embed-token
Body: { groupId: "...", reportId: "..." }
Response: { token: "...", tokenId: "...", expiration: "..." }
```

See `POWERBI_EMBEDDED_SETUP.md` for complete backend implementation examples in:
- Node.js + Express + MSAL
- .NET Core + MSAL
- Python + Flask + MSAL

### Configuration Details

- **Workspace**: The Power BI workspace identifier
- **Group ID**: The workspace/group ID where the report is located (UUID format)
- **Report ID**: The unique identifier for the Power BI report (UUID format)
- **Section**: Optional section identifier for specific report pages
- **Client ID**: Azure AD application (client) ID
- **Tenant ID**: Azure AD directory (tenant) ID

### Setup Requirements

To enable Power BI Embedded, you must complete the following setup steps:

#### 1. Azure AD App Registration

1. Register application in Azure Active Directory
2. Obtain Client ID and Tenant ID
3. Create client secret (for backend use only)
4. Configure API permissions:
   - `Report.Read.All` (Delegated + Application)
   - `Dataset.Read.All` (Delegated + Application)
   - `Workspace.Read.All` (Delegated)
5. Grant admin consent for your organization

#### 2. Power BI Configuration

1. Enable service principal in Power BI Admin Portal:
   - Go to **Tenant Settings** → **Developer settings**
   - Enable "Allow service principals to use Power BI APIs"
2. Add service principal to Power BI workspace:
   - Open your workspace (e.g., "Demos")
   - Add the Azure AD application as **Member** or **Admin**

#### 3. Backend API Deployment

Deploy a backend API that:
- Authenticates with Azure AD using client credentials flow
- Calls Power BI REST API to generate embed tokens
- Exposes an endpoint for the frontend to request tokens

#### 4. Licenses

**Required licenses:**
- **Development**: Power BI Pro licenses
- **Production**: 
  - Power BI Premium (capacity-based, ~$5,000/month for P1)
  - OR Power BI Embedded (Azure, pay-per-use, ~$1/hour for A1 SKU)

**Recommendation for this project:**
- Power BI Embedded (A2 or A3 SKU) with auto-pause for cost optimization
- Estimated cost: $200-400/month with nocturnal pauses

### Current Implementation Status

**✅ Implemented:**
- Power BI JavaScript SDK integration (`powerbi-client` package)
- `PowerBIEmbed` component with full report lifecycle management
- Environment variable configuration
- Error handling and user-friendly messaging
- Documentation for Azure AD setup (`POWERBI_EMBEDDED_SETUP.md`)

**⚠️ Pending (Requires Infrastructure):**
- Azure AD app registration
- Backend API deployment for embed token generation
- Power BI workspace configuration with service principal
- Power BI Premium or Embedded license acquisition

**Current Behavior:**
- Application displays informative UI explaining backend API requirement
- Shows implementation steps and configuration guide
- Links to official Microsoft documentation
- Ready to integrate once backend API is deployed

### Development Workflow

**Without Backend (Current State):**
```
1. Frontend loads PowerBIEmbed component
2. Component attempts to fetch embed token
3. getEmbedToken() returns null (backend not configured)
4. Component displays setup instructions UI
```

**With Backend (Production):**
```
1. Frontend loads PowerBIEmbed component
2. Component calls getEmbedToken(groupId, reportId)
3. Backend authenticates with Azure AD
4. Backend generates embed token via Power BI REST API
5. Frontend receives token and embeds report using SDK
6. Report loads and displays in full-screen
```

### Security Considerations

1. **Never expose client secrets in frontend**
   - All authentication must happen in backend
   - Use environment variables only for non-sensitive configuration
   
2. **Token management**
   - Embed tokens expire after 1 hour by default
   - Implement token refresh logic in production
   - Use `report.on('tokenExpired')` event to refresh tokens

3. **CORS configuration**
   - Configure backend to allow requests only from trusted domains
   - Use appropriate CORS headers in production

4. **Row-Level Security (RLS)**
   - Implement RLS in Power BI datasets for multi-tenant scenarios
   - Pass user identity when generating embed tokens

### Troubleshooting

**Issue**: "Embed token not available. Backend API not configured."
- **Solution**: Deploy backend API and configure `VITE_BACKEND_API_URL`

**Issue**: "Service principal not found"
- **Solution**: Add Azure AD application to Power BI workspace

**Issue**: "Insufficient privileges"
- **Solution**: Grant admin consent for API permissions in Azure AD

**Issue**: Reports not loading
- **Solution**: Check browser console for errors, verify token validity, ensure licenses are active

### Additional Resources

**Documentation:**
- `POWERBI_EMBEDDED_SETUP.md`: Complete step-by-step configuration guide
- [Power BI Embedded Documentation](https://learn.microsoft.com/en-us/power-bi/developer/embedded/)
- [Power BI JavaScript SDK](https://github.com/microsoft/PowerBI-JavaScript)
- [MSAL for Node.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node)
- [Azure AD App Registration](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

**Implementation Files:**
- Frontend component: `src/components/PowerBIEmbed.tsx`
- Configuration utility: `src/lib/powerbi.ts`
- Environment template: `.env.example`
- Environment file: `.env` (not in version control)
- Setup guide: `POWERBI_EMBEDDED_SETUP.md`

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
  - Only displays: Norway, Finland, Denmark

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

- Continent dropdown selector
  - Options: Europe, North America, South America
  - When a continent is selected, displays a list of countries for that continent
  - Countries are selectable buttons
  - Changing continent clears the selected country

**Right Panel (H4)**:

- Form structure: "Title : Data : Entry Type : (Available Values)"
  - **Currency**: Dropdown (€, $, YEN, Peso, ... [full list])
  - **Prices Types**: Multiple selection dropdown with checkboxes
    - Values: ASP, Maquila, Ex-Factory
    - Selection method: Checkboxes to the left of each option for multiple selection
    - Display: Scrollable list in a bordered container
    - Behavior: Users can select multiple price types simultaneously
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
