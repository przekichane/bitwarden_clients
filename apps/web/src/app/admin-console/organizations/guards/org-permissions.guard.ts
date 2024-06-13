import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

import {
  canAccessOrgAdmin,
  OrganizationService,
} from "@bitwarden/common/admin-console/abstractions/organization/organization.service.abstraction";
import { Organization } from "@bitwarden/common/admin-console/models/domain/organization";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";
import { PlatformUtilsService } from "@bitwarden/common/platform/abstractions/platform-utils.service";
import { SyncService } from "@bitwarden/common/vault/abstractions/sync/sync.service.abstraction";

/**
 * `CanActivateFn` that asserts the logged in user has permission to access
 * the page being navigated to. Two high-level checks are performed:
 *
 * 1. If the user is not a member of the organization in the URL parameters, they
 *    are redirected to the home screen.
 * 2. If the organization in the URL parameters is disabled and the user is not
 *    an admin, they are redirected to the home screen.
 *
 * In addition to these high level checks the guard accepts a callback
 * function as an argument that will be called to check for more granular
 * permissions. Based on the return from this callback one of the following
 * will happen:
 *
 * 1. If the logged in user does not have the required permissions they are
 *    redirected to `/organizations/{id}` or `/` based on admin console access
 *    permissions.
 * 2. If the logged in user does have the required permissions navigation
 *    proceeds as expected.
 */
@Injectable({
  providedIn: "root",
})
export class OrganizationPermissionsGuard implements CanActivate {
  constructor(
    private router: Router,
    private organizationService: OrganizationService,
    private platformUtilsService: PlatformUtilsService,
    private i18nService: I18nService,
    private syncService: SyncService,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // TODO: We need to fix this issue once and for all.
    if ((await this.syncService.getLastSync()) == null) {
      await this.syncService.fullSync(false);
    }

    const org = await this.organizationService.get(route.params.organizationId);
    if (org == null) {
      return this.router.createUrlTree(["/"]);
    }

    if (!org.isOwner && !org.enabled) {
      this.platformUtilsService.showToast(
        "error",
        null,
        this.i18nService.t("organizationIsDisabled"),
      );
      return this.router.createUrlTree(["/"]);
    }

    const permissionsCallback: (organization: Organization) => boolean =
      route.data?.organizationPermissions;
    const hasPermissions = permissionsCallback == null || permissionsCallback(org);

    if (!hasPermissions) {
      // Handle linkable ciphers for organizations the user only has view access to
      // https://bitwarden.atlassian.net/browse/EC-203
      const cipherId =
        state.root.queryParamMap.get("itemId") || state.root.queryParamMap.get("cipherId");
      if (cipherId) {
        return this.router.createUrlTree(["/vault"], {
          queryParams: {
            itemId: cipherId,
          },
        });
      }

      this.platformUtilsService.showToast("error", null, this.i18nService.t("accessDenied"));
      return canAccessOrgAdmin(org)
        ? this.router.createUrlTree(["/organizations", org.id])
        : this.router.createUrlTree(["/"]);
    }

    return true;
  }
}
