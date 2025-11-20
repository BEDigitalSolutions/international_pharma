/**
 * Power BI Embedded Component
 *
 * This component embeds Power BI reports using the Power BI JavaScript SDK.
 * Requires Azure AD authentication and embed tokens from backend.
 */

import { type PowerBIReportConfig } from "../lib/powerbi";

export interface PowerBIEmbedProps {
  reportConfig: PowerBIReportConfig;
  title: string;
}

export function PowerBIEmbed({ reportConfig, title }: PowerBIEmbedProps) {
  return (
    <div className="h-full w-full flex flex-col">
      {title}
      <iframe
        className="flex-1"
        src={`https://app.powerbi.com/reportEmbed?reportId=${reportConfig.reportId}&autoAuth=true`}
      ></iframe>
    </div>
  );
}
