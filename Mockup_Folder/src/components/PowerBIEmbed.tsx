/**
 * Power BI Embedded Component
 * 
 * This component embeds Power BI reports using the Power BI JavaScript SDK.
 * Requires Azure AD authentication and embed tokens from backend.
 */

import { useEffect, useRef, useState } from 'react'
import * as pbi from 'powerbi-client'
import { getEmbedToken, type PowerBIReportConfig } from '../lib/powerbi'

export interface PowerBIEmbedProps {
  reportConfig: PowerBIReportConfig
  title: string
}

export function PowerBIEmbed({ reportConfig, title }: PowerBIEmbedProps) {
  const embedContainer = useRef<HTMLDivElement>(null)
  const [embedStatus, setEmbedStatus] = useState<
    'loading' | 'embedded' | 'error' | 'no-token'
  >('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    if (!embedContainer.current) return

    const embedReport = async () => {
      try {
        setEmbedStatus('loading')

        // Get embed token from backend (currently placeholder)
        const tokenResponse = await getEmbedToken()

        if (!tokenResponse) {
          setEmbedStatus('no-token')
          setErrorMessage(
            'Embed token not available. Backend API not configured.'
          )
          return
        }

        // Power BI service instance
        const powerbi = new pbi.service.Service(
          pbi.factories.hpmFactory,
          pbi.factories.wpmpFactory,
          pbi.factories.routerFactory
        )

        // Embed configuration
        const config: pbi.IEmbedConfiguration = {
          type: 'report',
          tokenType: pbi.models.TokenType.Embed,
          accessToken: tokenResponse.token,
          embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportConfig.reportId}&groupId=${reportConfig.groupId}`,
          id: reportConfig.reportId,
          permissions: pbi.models.Permissions.Read,
          settings: {
            panes: {
              filters: {
                visible: false,
              },
              pageNavigation: {
                visible: true,
              },
            },
            background: pbi.models.BackgroundType.Transparent,
          },
        }

        // Embed the report
        if (!embedContainer.current) return
        const report = powerbi.embed(embedContainer.current, config)

        // Handle report loaded event
        report.on('loaded', () => {
          setEmbedStatus('embedded')
        })

        // Handle report error event
        report.on('error', (event) => {
          interface PowerBIErrorEvent {
            detail?: {
              message?: string
              errorCode?: string
            }
          }
          const errorDetail = (event as PowerBIErrorEvent).detail
          setEmbedStatus('error')
          setErrorMessage(
            errorDetail?.message || 'Unknown error loading report'
          )
        })

        // Clean up on unmount
        return () => {
          powerbi.reset(embedContainer.current!)
        }
      } catch (error) {
        setEmbedStatus('error')
        setErrorMessage(
          error instanceof Error ? error.message : 'Unknown error'
        )
      }
    }

    embedReport()
  }, [reportConfig])

  if (embedStatus === 'no-token') {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-slate-50 p-8">
        <div className="max-w-2xl rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            {title}
          </h3>

          <div className="space-y-4">
            <div className="rounded bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-medium">⚠️ Backend API Required</p>
              <p className="mt-2">
                Power BI Embedded requires a backend API to securely generate
                embed tokens. This cannot be done in the frontend for security
                reasons.
              </p>
            </div>

            <div>
              <p className="mb-2 font-medium text-slate-700">
                Implementation steps:
              </p>
              <ol className="list-decimal space-y-2 pl-6 text-sm text-slate-600">
                <li>
                  <strong>Register application in Azure AD</strong>
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    <li>Go to Azure Portal → Azure Active Directory</li>
                    <li>Create new App Registration</li>
                    <li>Note Client ID and Tenant ID</li>
                    <li>Add API permissions for Power BI Service</li>
                  </ul>
                </li>
                <li>
                  <strong>Configure Power BI workspace</strong>
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    <li>Add service principal to workspace</li>
                    <li>Grant appropriate permissions (Member or Admin)</li>
                  </ul>
                </li>
                <li>
                  <strong>Create backend API endpoint</strong>
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    <li>
                      Authenticate with Azure AD using MSAL and client secret
                    </li>
                    <li>
                      Call Power BI REST API to generate embed token:<br />
                      <code className="rounded bg-slate-100 px-1 text-xs">
                        POST
                        https://api.powerbi.com/v1.0/myorg/groups/{'{'}groupId
                        {'}'}/reports/{'{'}reportId{'}'}/GenerateToken
                      </code>
                    </li>
                    <li>Return embed token to frontend</li>
                  </ul>
                </li>
                <li>
                  <strong>Configure environment variables</strong>
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    <li>
                      <code className="rounded bg-slate-100 px-1 text-xs">
                        VITE_AZURE_AD_CLIENT_ID
                      </code>
                    </li>
                    <li>
                      <code className="rounded bg-slate-100 px-1 text-xs">
                        VITE_AZURE_AD_TENANT_ID
                      </code>
                    </li>
                  </ul>
                </li>
              </ol>
            </div>

            <div className="rounded bg-blue-50 p-4 text-sm text-blue-900">
              <p className="font-medium">📚 Resources:</p>
              <ul className="ml-4 mt-2 list-disc space-y-1">
                <li>
                  <a
                    href="https://learn.microsoft.com/en-us/power-bi/developer/embedded/embed-sample-for-customers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline hover:text-blue-800"
                  >
                    Power BI Embedded documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/microsoft/PowerBI-JavaScript"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline hover:text-blue-800"
                  >
                    Power BI JavaScript SDK
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (embedStatus === 'error') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-red-900">
          <p className="font-medium">Error loading Power BI report</p>
          <p className="mt-2 text-sm">{errorMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      {embedStatus === 'loading' && (
        <div className="flex h-full items-center justify-center">
          <div className="text-slate-600">Loading Power BI report...</div>
        </div>
      )}
      <div
        ref={embedContainer}
        className="h-full w-full"
        style={{ minHeight: '500px' }}
      />
    </div>
  )
}

