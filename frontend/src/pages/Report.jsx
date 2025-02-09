import React from "react";
import { FileUploadDemo } from "@/components/reports/FileUploadDemo";
import { ExpandableCardDemo } from "@/components/reports/ExpandableCardDemo";

function Report() {
  return ( <div className="h-full flex flex-col overflow-y-auto">
<ExpandableCardDemo />
<FileUploadDemo />
  </div>);
}

export default Report;