# Power BI Embedded - Guía de Configuración Azure AD

## Índice
1. [Requisitos Previos](#requisitos-previos)
2. [Registro de Aplicación en Azure AD](#registro-de-aplicación-en-azure-ad)
3. [Configuración de Power BI](#configuración-de-power-bi)
4. [Variables de Entorno](#variables-de-entorno)
5. [Implementación del Backend](#implementación-del-backend)
6. [Licencias y Costes](#licencias-y-costes)
7. [Solución de Problemas](#solución-de-problemas)

---

## Requisitos Previos

Antes de comenzar, necesitarás:

- **Suscripción de Azure** activa
- **Licencias Power BI**:
  - Power BI Pro (para desarrollo/testing)
  - Power BI Premium o Power BI Embedded (para producción)
- **Permisos de administrador** en Azure AD y Power BI
- **Workspace de Power BI** con los informes que deseas incrustar
- **Backend API** para generar tokens (Node.js, .NET, Python, etc.)

---

## Registro de Aplicación en Azure AD

### Paso 1: Crear App Registration

1. Accede al [Azure Portal](https://portal.azure.com)
2. Navega a **Azure Active Directory** → **App registrations**
3. Haz clic en **New registration**
4. Rellena los datos:
   - **Name**: `PowerBI-Embedded-GrifolsPharma` (o el nombre que prefieras)
   - **Supported account types**: 
     - Selecciona "Accounts in this organizational directory only" (single tenant)
   - **Redirect URI**: 
     - Tipo: `Web`
     - URL: `http://localhost:5173/auth/callback` (para desarrollo)
     - Añadir también la URL de producción cuando esté disponible
5. Haz clic en **Register**

### Paso 2: Obtener Credenciales

Después de crear la aplicación, anota:

1. **Application (client) ID**: Se encuentra en la página Overview
   ```
   Ejemplo: 12345678-1234-1234-1234-123456789012
   ```

2. **Directory (tenant) ID**: También en la página Overview
   ```
   Ejemplo: 87654321-4321-4321-4321-210987654321
   ```

### Paso 3: Crear Client Secret

1. En tu App Registration, ve a **Certificates & secrets**
2. Haz clic en **New client secret**
3. Añade una descripción: `PowerBI Backend Secret`
4. Selecciona la expiración (recomendado: 12 o 24 meses)
5. Haz clic en **Add**
6. **IMPORTANTE**: Copia el **Value** del secreto INMEDIATAMENTE
   - Este valor solo se muestra una vez
   - Guárdalo de forma segura (Azure Key Vault, variables de entorno seguras)
   ```
   Ejemplo: abc123~XYZ789_muy-secreto-no-compartir
   ```

### Paso 4: Configurar Permisos API

1. Ve a **API permissions**
2. Haz clic en **Add a permission**
3. Selecciona **Power BI Service**
4. Selecciona **Delegated permissions** y añade:
   - `Report.Read.All`
   - `Dataset.Read.All`
   - `Workspace.Read.All`
5. Selecciona **Application permissions** y añade:
   - `Report.Read.All`
   - `Dataset.Read.All`
6. Haz clic en **Grant admin consent for [Your Organization]**
   - Esto requiere permisos de administrador
   - Confirma haciendo clic en **Yes**

---

## Configuración de Power BI

### Paso 1: Habilitar Service Principal

1. Accede al [Power BI Admin Portal](https://app.powerbi.com/admin-portal/tenantSettings)
2. Ve a **Developer settings**
3. Habilita **Allow service principals to use Power BI APIs**
4. Añade tu App Registration:
   - Opción A: Añade un grupo de seguridad que contenga tu service principal
   - Opción B: Añade directamente tu Application ID
5. Guarda los cambios

### Paso 2: Añadir Service Principal al Workspace

1. Ve a tu Power BI Workspace (ej: "Demos")
2. Haz clic en **Access** (icono de personas en la parte superior)
3. Añade tu aplicación:
   - En el campo de búsqueda, pega tu **Application (client) ID**
   - O busca por el nombre de la aplicación
4. Asigna el rol:
   - **Member** (recomendado para embed tokens)
   - o **Admin** (si necesitas más permisos)
5. Haz clic en **Add**

### Paso 3: Obtener IDs de Informes

Para cada informe que desees incrustar:

1. Abre el informe en Power BI Service
2. La URL tendrá este formato:
   ```
   https://app.powerbi.com/groups/{groupId}/reports/{reportId}/{sectionId}
   ```
3. Anota:
   - `groupId`: ID del workspace
   - `reportId`: ID del informe
   - `sectionId`: ID de la página/sección (opcional)

---

## Variables de Entorno

### Frontend (.env en Mockup_Folder)

```env
# Power BI Report Configuration
VITE_POWERBI_WORKSPACE=powerbi://api.powerbi.com/v1.0/myorg/Demos

# Sales Trends Report
VITE_POWERBI_REPORT_SALES_TRENDS_GROUP_ID=bb2b36c4-8e79-48c3-8e0e-beeffcbcd6bc
VITE_POWERBI_REPORT_SALES_TRENDS_ID=374c879d-18c6-4eb8-96e8-5b1ad102369d
VITE_POWERBI_REPORT_SALES_TRENDS_SECTION=ReportSection6d07f950286975e21292

# Sales Analysis Report
VITE_POWERBI_REPORT_SALES_ANALYSIS_GROUP_ID=ca1ac1fe-67ba-4206-835d-c1eca37a3e53
VITE_POWERBI_REPORT_SALES_ANALYSIS_ID=703b9b8b-737c-4969-bade-6679da8c6e82
VITE_POWERBI_REPORT_SALES_ANALYSIS_SECTION=ReportSection3202ee6d4de9c00a3480

# Azure AD Configuration (opcional en frontend, recomendado en backend)
VITE_AZURE_AD_CLIENT_ID=12345678-1234-1234-1234-123456789012
VITE_AZURE_AD_TENANT_ID=87654321-4321-4321-4321-210987654321
VITE_AZURE_AD_REDIRECT_URI=http://localhost:5173/auth/callback

# Backend API URL
VITE_BACKEND_API_URL=http://localhost:3000/api
```

### Backend (.env en tu servidor backend)

```env
# Azure AD Credentials - ¡NUNCA expongas estas en frontend!
AZURE_AD_CLIENT_ID=12345678-1234-1234-1234-123456789012
AZURE_AD_TENANT_ID=87654321-4321-4321-4321-210987654321
AZURE_AD_CLIENT_SECRET=abc123~XYZ789_muy-secreto-no-compartir

# Power BI Configuration
POWERBI_API_URL=https://api.powerbi.com/v1.0/myorg
POWERBI_SCOPE=https://analysis.windows.net/powerbi/api/.default

# Token Configuration
TOKEN_EXPIRATION_MINUTES=60
```

---

## Implementación del Backend

### Opción A: Node.js + Express + MSAL

#### Instalación de Dependencias

```bash
npm install @azure/msal-node express cors dotenv
```

#### Código de Ejemplo (backend/server.js)

```javascript
const express = require('express');
const cors = require('cors');
const msal = require('@azure/msal-node');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MSAL Configuration
const msalConfig = {
  auth: {
    clientId: process.env.AZURE_AD_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}`,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
  },
};

const cca = new msal.ConfidentialClientApplication(msalConfig);

// Get Azure AD Token
async function getAzureADToken() {
  const tokenRequest = {
    scopes: [process.env.POWERBI_SCOPE],
  };

  try {
    const response = await cca.acquireTokenByClientCredential(tokenRequest);
    return response.accessToken;
  } catch (error) {
    console.error('Error acquiring token:', error);
    throw error;
  }
}

// Generate Power BI Embed Token
async function generateEmbedToken(groupId, reportId, accessToken) {
  const url = `${process.env.POWERBI_API_URL}/groups/${groupId}/reports/${reportId}/GenerateToken`;
  
  const body = {
    accessLevel: 'View',
    allowSaveAs: false,
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error generating embed token:', error.response?.data || error.message);
    throw error;
  }
}

// API Endpoint: Get Embed Token
app.post('/api/powerbi/embed-token', async (req, res) => {
  try {
    const { groupId, reportId } = req.body;

    if (!groupId || !reportId) {
      return res.status(400).json({ 
        error: 'Missing required parameters: groupId and reportId' 
      });
    }

    // Get Azure AD token
    const accessToken = await getAzureADToken();

    // Generate Power BI embed token
    const embedTokenResponse = await generateEmbedToken(groupId, reportId, accessToken);

    res.json({
      token: embedTokenResponse.token,
      tokenId: embedTokenResponse.tokenId,
      expiration: embedTokenResponse.expiration,
    });
  } catch (error) {
    console.error('Error in embed-token endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to generate embed token',
      details: error.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
```

### Opción B: .NET Core + MSAL

```csharp
// Program.cs
using Microsoft.Identity.Client;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

var app = builder.Build();
app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.MapPost("/api/powerbi/embed-token", async ([FromBody] EmbedTokenRequest request) =>
{
    var clientId = Environment.GetEnvironmentVariable("AZURE_AD_CLIENT_ID");
    var tenantId = Environment.GetEnvironmentVariable("AZURE_AD_TENANT_ID");
    var clientSecret = Environment.GetEnvironmentVariable("AZURE_AD_CLIENT_SECRET");
    
    var app = ConfidentialClientApplicationBuilder
        .Create(clientId)
        .WithAuthority($"https://login.microsoftonline.com/{tenantId}")
        .WithClientSecret(clientSecret)
        .Build();
    
    var scopes = new[] { "https://analysis.windows.net/powerbi/api/.default" };
    var result = await app.AcquireTokenForClient(scopes).ExecuteAsync();
    
    // Call Power BI REST API to generate embed token
    // ... (implementation similar to Node.js)
    
    return Results.Ok(new { token = result.AccessToken });
});

app.Run();

record EmbedTokenRequest(string GroupId, string ReportId);
```

### Opción C: Python + Flask + MSAL

```python
# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import msal
import requests
import os

app = Flask(__name__)
CORS(app)

def get_azure_ad_token():
    authority = f"https://login.microsoftonline.com/{os.getenv('AZURE_AD_TENANT_ID')}"
    client_id = os.getenv('AZURE_AD_CLIENT_ID')
    client_secret = os.getenv('AZURE_AD_CLIENT_SECRET')
    scope = ['https://analysis.windows.net/powerbi/api/.default']
    
    client = msal.ConfidentialClientApplication(
        client_id,
        authority=authority,
        client_credential=client_secret
    )
    
    result = client.acquire_token_for_client(scopes=scope)
    return result['access_token']

@app.route('/api/powerbi/embed-token', methods=['POST'])
def generate_embed_token():
    data = request.json
    group_id = data.get('groupId')
    report_id = data.get('reportId')
    
    access_token = get_azure_ad_token()
    
    url = f"https://api.powerbi.com/v1.0/myorg/groups/{group_id}/reports/{report_id}/GenerateToken"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }
    body = {
        'accessLevel': 'View',
        'allowSaveAs': False
    }
    
    response = requests.post(url, json=body, headers=headers)
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(port=3000)
```

---

## Actualizar Frontend para Llamar al Backend

Modifica `Mockup_Folder/src/lib/powerbi.ts`:

```typescript
export async function getEmbedToken(
  groupId: string,
  reportId: string
): Promise<{
  token: string
  tokenId: string
  expiration: string
} | null> {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/api'
    
    const response = await fetch(`${backendUrl}/powerbi/embed-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ groupId, reportId }),
    })
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching embed token from backend:', error)
    return null
  }
}
```

---

## Licencias y Costes

### Power BI Pro
- **Coste**: ~10 USD/usuario/mes
- **Uso**: Desarrollo y testing
- **Limitaciones**: 
  - Máximo 1 GB de datos por dataset
  - Compartir solo con usuarios Pro
  - No recomendado para producción con usuarios externos

### Power BI Premium (Capacity-based)
- **Coste**: Desde ~5,000 USD/mes (P1)
- **Uso**: Producción para usuarios internos
- **Ventajas**:
  - Sin límite de usuarios visualizadores
  - Datasets hasta 100 GB
  - Mayor rendimiento

### Power BI Embedded (Azure)
- **Coste**: Pay-per-use, desde ~1 USD/hora (A1)
- **Uso**: Producción para aplicaciones embebidas
- **Ventajas**:
  - Escalado automático
  - Pausa cuando no se usa
  - Ideal para aplicaciones SaaS
- **Calculadora**: [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)

### Recomendación para este Proyecto

Para Grifols International Pharma:
- **Desarrollo**: Power BI Pro
- **Producción**: 
  - Si <100 usuarios: Power BI Embedded (A2-A3 SKU, ~200-400 USD/mes con pausa nocturna)
  - Si >100 usuarios: Power BI Premium (P1, ~5,000 USD/mes)

---

## Solución de Problemas

### Error: "Service principal not found"
- Verifica que el service principal esté añadido al workspace
- Confirma que el tenant setting "Allow service principals" esté habilitado

### Error: "Insufficient privileges"
- Verifica los permisos API en Azure AD
- Confirma que se ha dado admin consent
- Comprueba que el service principal tenga rol Member o Admin en el workspace

### Error: "Token expired"
- Los embed tokens expiran (por defecto 1 hora)
- Implementa refresh automático en el frontend
- Usa `report.on('tokenExpired')` event para renovar

### Error: "CORS policy"
- Configura CORS correctamente en tu backend
- Añade el dominio frontend a allowed origins

### Los informes no cargan en localhost
- Esto es esperado con CSP restrictions
- Usa Power BI Embedded con tokens (implementado en este proyecto)
- O despliega en un dominio real para testing

---

## Recursos Adicionales

- [Power BI Embedded Documentation](https://learn.microsoft.com/en-us/power-bi/developer/embedded/)
- [Power BI REST API Reference](https://learn.microsoft.com/en-us/rest/api/power-bi/)
- [MSAL for Node.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node)
- [Power BI JavaScript SDK](https://github.com/microsoft/PowerBI-JavaScript)
- [Azure AD App Registration Guide](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

---

**Versión**: 1.0  
**Fecha**: 2025-11-19  
**Proyecto**: Grifols International Pharma Analytics

