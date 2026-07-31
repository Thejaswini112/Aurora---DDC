import { Settings } from "lucide-react";

import { Page, PageHeader } from "@/components/common/Page";

import WorkspaceSettings from "./settings/components/WorkspaceSettings";
import ScanSettings from "./settings/components/ScanSettings";
import AISettings from "./settings/components/AISettings";
import Integrations from "./settings/components/Integrations";

export function SettingsPage() {
  return (
    <Page>
      <PageHeader
        title="Settings"
        description="Configure workspace preferences, scanning behavior, AI capabilities and repository integrations."
        icon={Settings}
      />

      <div className="mt-8 space-y-10">

        <WorkspaceSettings />

        <ScanSettings />

        <AISettings />

        <Integrations />

      </div>
    </Page>
  );
}

export default SettingsPage;