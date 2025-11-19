/**
 * Power BI Embedded Configuration with Azure AD
 * 
 * This module handles Power BI embed configuration using Azure AD authentication.
 * Requires Azure AD app registration and Power BI REST API setup.
 * 
 * For development: Set environment variables in .env file
 * For production: Use secure backend API to generate embed tokens
 */

export interface PowerBIReportConfig {
  groupId: string
  reportId: string
  section?: string
}

export interface PowerBIAzureConfig {
  clientId: string
  tenantId: string
  redirectUri: string
  scope: string
}

/**
 * Get Power BI embed URL for a report
 * 
 * @param config Report configuration with group ID, report ID, and optional section
 * @returns Full embed URL for Power BI iframe
 */
export function getPowerBIEmbedUrl(config: PowerBIReportConfig): string {
  const { groupId, reportId, section } = config
  
  // Base URL for Power BI embed
  const baseUrl = 'https://app.powerbi.com/groups'
  
  // Construct the URL
  let url = `${baseUrl}/${groupId}/reports/${reportId}`
  
  // Add section if provided
  if (section) {
    url += `/${section}`
  }
  
  // Add embed parameters
  url += '?experience=power-bi'
  
  // Optional: Add additional parameters for better embedding
  // url += '&filterPaneEnabled=false'
  // url += '&navContentPaneEnabled=false'
  
  return url
}

/**
 * Get Power BI configuration from environment variables
 */
export function getPowerBIConfig(): {
  salesTrends: PowerBIReportConfig
  salesAnalysis: PowerBIReportConfig
  workspace: string
} {
  const workspace = import.meta.env.VITE_POWERBI_WORKSPACE || ''
  
  return {
    workspace,
    salesTrends: {
      groupId: import.meta.env.VITE_POWERBI_REPORT_SALES_TRENDS_GROUP_ID || '',
      reportId: import.meta.env.VITE_POWERBI_REPORT_SALES_TRENDS_ID || '',
      section: import.meta.env.VITE_POWERBI_REPORT_SALES_TRENDS_SECTION || undefined,
    },
    salesAnalysis: {
      groupId: import.meta.env.VITE_POWERBI_REPORT_SALES_ANALYSIS_GROUP_ID || '',
      reportId: import.meta.env.VITE_POWERBI_REPORT_SALES_ANALYSIS_ID || '',
      section: import.meta.env.VITE_POWERBI_REPORT_SALES_ANALYSIS_SECTION || undefined,
    },
  }
}

/**
 * Validate Power BI configuration
 * Returns true if all required environment variables are set
 */
export function validatePowerBIConfig(): boolean {
  const config = getPowerBIConfig()
  
  return (
    config.workspace !== '' &&
    config.salesTrends.groupId !== '' &&
    config.salesTrends.reportId !== '' &&
    config.salesAnalysis.groupId !== '' &&
    config.salesAnalysis.reportId !== ''
  )
}

/**
 * Get Azure AD configuration for Power BI Embedded
 * These values should be configured in environment variables
 */
export function getAzureADConfig(): PowerBIAzureConfig {
  return {
    clientId: import.meta.env.VITE_AZURE_AD_CLIENT_ID || '',
    tenantId: import.meta.env.VITE_AZURE_AD_TENANT_ID || '',
    redirectUri: import.meta.env.VITE_AZURE_AD_REDIRECT_URI || window.location.origin,
    scope: import.meta.env.VITE_POWERBI_SCOPE || 'https://analysis.windows.net/powerbi/api/.default',
  }
}

/**
 * Get embed token for a Power BI report
 * 
 * IMPORTANT: This is a placeholder. In production, this should be done on the backend:
 * 1. Backend authenticates with Azure AD using client credentials
 * 2. Backend calls Power BI REST API to generate embed token
 * 3. Backend returns token to frontend
 * 
 * Never expose client secrets in frontend code!
 * 
 * @param groupId Workspace/Group ID
 * @param reportId Report ID
 * @returns Promise with embed token (placeholder returns empty for now)
 */
export async function getEmbedToken(
  groupId: string,
  reportId: string
): Promise<{
  token: string
  tokenId: string
  expiration: string
} | null> {
  // TODO: Implement backend API call to get embed token
  // Example backend endpoint: POST /api/powerbi/embed-token
  // 
  // Backend should:
  // 1. Authenticate with Azure AD using MSAL (Microsoft Authentication Library)
  // 2. Call Power BI REST API: 
  //    POST https://api.powerbi.com/v1.0/myorg/groups/{groupId}/reports/{reportId}/GenerateToken
  // 3. Return the embed token to frontend
  
  console.warn('Embed token generation not implemented. Configure backend API.')
  
  // For development without backend, you can manually:
  // 1. Go to Power BI Service
  // 2. Open report and click "..." → Embed → Publish to web (for testing only!)
  // 3. Or use Power BI Playground: https://microsoft.github.io/PowerBI-JavaScript/demo/
  
  return null
}

/**
 * Check if Azure AD is configured
 */
export function isAzureADConfigured(): boolean {
  const config = getAzureADConfig()
  return config.clientId !== '' && config.tenantId !== ''
}

