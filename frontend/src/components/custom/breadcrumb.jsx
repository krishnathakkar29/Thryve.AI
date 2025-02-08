import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
// import { usePathname } from "next/navigation";
import { useLocation } from "react-router-dom";

export default function DashboardBreadCrumb() {
  const location = useLocation();
  const path = location.pathname.split("/").filter(Boolean);
  const pathToTitle = {
    dashboard: "Building your startup",
    "market-intelligence": "Real-time market trends",
    "audience-insights": "Understanding your audience",
    "feedback-hub": "Get a pulse on your audience",
    analytics: "Get Insights",
    "strategic-insights": "Strategic Insights",
    "bulk-mail": "Bulk Mailing",
    reports: "Comprehensive analytics",
    "competitor-mapping": "Identify and analyze your competitors",
    "custom-recommendations": "Receive personalized action plans",
    "audience-outreach": "Engage with your audience",
    "audience-segments": "Segment your audience",
    "hound-board": "Plot your roadmap",
    "product-comparison": "Compare your products",
  };
  function getPath(i) {
    return "/" + path.slice(0, i + 1).join("/");
  }
  function isActive(i) {
    return getPath(i) === location.pathname;
  }
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {path.map((p, i) => (
          <React.Fragment key={i}>
            <BreadcrumbItem
              className={cn(
                isActive(i) && "text-white",
                !isActive(i) && i < path.length - 1 && "hidden md:block"
              )}
            >
              <BreadcrumbLink href={getPath(i)}>
                {pathToTitle[p]}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {i !== path.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
