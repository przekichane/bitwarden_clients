import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

import { OrganizationService } from "@bitwarden/common/admin-console/abstractions/organization/organization.service.abstraction";
import { DialogService } from "@bitwarden/components";

/**
 * `CanActivateFn` that checks if the organization matching the id in the URL
 * parameters is paid or free. If the organization is free instructions are
 * provided on how to upgrade a free organization, and the user is redirected
 * if they have access to upgrade the organization. If the organization is
 * paid routing proceeds."
 */
@Injectable({
  providedIn: "root",
})
export class IsPaidOrgGuard implements CanActivate {
  constructor(
    private router: Router,
    private organizationService: OrganizationService,
    private dialogService: DialogService,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const org = await this.organizationService.get(route.params.organizationId);

    if (org == null) {
      return this.router.createUrlTree(["/"]);
    }

    if (org.isFreeOrg) {
      // Users without billing permission can't access billing
      if (!org.canEditSubscription) {
        await this.dialogService.openSimpleDialog({
          title: { key: "upgradeOrganizationCloseSecurityGaps" },
          content: { key: "upgradeOrganizationCloseSecurityGapsDesc" },
          acceptButtonText: { key: "ok" },
          cancelButtonText: null,
          type: "info",
        });
        return false;
      } else {
        const upgradeConfirmed = await this.dialogService.openSimpleDialog({
          title: { key: "upgradeOrganizationCloseSecurityGaps" },
          content: { key: "upgradeOrganizationCloseSecurityGapsDesc" },
          acceptButtonText: { key: "upgradeOrganization" },
          type: "info",
          icon: "bwi-arrow-circle-up",
        });
        if (upgradeConfirmed) {
          await this.router.navigate(["organizations", org.id, "billing", "subscription"], {
            queryParams: { upgrade: true },
          });
        }
      }
    }

    return !org.isFreeOrg;
  }
}
