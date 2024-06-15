import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { organizationPermissionsGuard } from "../../guards/org-permissions.guard";

import { OrganizationVaultExportComponent } from "./org-vault-export.component";

const routes: Routes = [
  {
    path: "",
    component: OrganizationVaultExportComponent,
    canActivate: [organizationPermissionsGuard((org) => org.canAccessImportExport)],
    data: {
      titleId: "exportVault",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class OrganizationVaultExportRoutingModule {}
