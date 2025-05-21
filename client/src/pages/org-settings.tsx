import React from "react";
import { OrgSettings } from "@/components/settings/org-settings";

export default function OrgSettingsPage() {
  return (
    <div className="p-6 bg-dark-lighter h-full overflow-auto">
      <OrgSettings />
    </div>
  );
}