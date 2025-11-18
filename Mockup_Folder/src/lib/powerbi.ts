/**
 * Power BI Configuration and URL Builder
 * 
 * This module handles Power BI embed URL construction based on environment variables.
 * 
 * Note: For production use, you may need to implement authentication
 * using Azure AD app registration and Power BI REST API.
 */

export interface PowerBIReportConfig {
  groupId: string
  reportId: string
  section?: string
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

