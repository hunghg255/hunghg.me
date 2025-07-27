import { CollapsibleList } from "@/components/collapsible-list";

import { Panel, PanelHeader, PanelTitle } from "../panel";
import { CertificationItem } from "./certification-item";
import { CERTIFICATIONS } from "@/features/profile/data/certificates";

export function Certifications() {
  return (
    <Panel id="certs">
      <PanelHeader>
        <PanelTitle>
          Certifications
          <sup className="ml-1 font-mono text-sm font-medium text-muted-foreground select-none">
            ({CERTIFICATIONS.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={CERTIFICATIONS}
        max={8}
        renderItem={(item) => <CertificationItem certification={item} />}
      />
    </Panel>
  );
}
