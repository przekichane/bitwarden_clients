import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from "@angular/router";

import {
  canAccessOrgAdmin,
  OrganizationService,
} from "@bitwarden/common/admin-console/abstractions/organization/organization.service.abstraction";

/**
 *
 * `CanActivateFn` that returns a URL Tree redirecting to a caller provided
 * sub route of `/organizations/{id}/`. If no sub route is provided the URL
 * tree returned will redirect to `/organizations/{id}` if possible, or `/` if
 * the user does not have permission to access `organizations/{id}`.
 */
export function organizationRedirectGuard(): CanActivateFn {
  return async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const organizationService = inject(OrganizationService);

    const org = await organizationService.get(route.params.organizationId);

    const customRedirect = route.data?.autoRedirectCallback;
    if (customRedirect) {
      let redirectPath = customRedirect(org);
      if (typeof redirectPath === "string") {
        redirectPath = [redirectPath];
      }
      return router.createUrlTree([state.url, ...redirectPath]);
    }

    if (org != null && canAccessOrgAdmin(org)) {
      return router.createUrlTree(["/organizations", org.id]);
    }

    return router.createUrlTree(["/"]);
  };
}
