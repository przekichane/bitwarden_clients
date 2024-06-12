import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";

import { ProviderService } from "@bitwarden/common/admin-console/abstractions/provider.service";
import { Provider } from "@bitwarden/common/admin-console/models/domain/provider";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";
import { PlatformUtilsService } from "@bitwarden/common/platform/abstractions/platform-utils.service";

/**
 * `CanActivateFn` that asserts the logged in user has permission to access
 * the page being navigated to. Two high-level checks are performed:
 *
 * 1. If the user is not a member of the provider in the URL parameters, they
 *    are redirected to the home screen.
 * 2. If the provider in  the URL parameters is disabled and the user is not
 *    an admin, they are redirected to the home screen.
 *
 * In addition to these high level checks the guard accepts a callback
 * function as an argument that will be called to check for more granular
 * permissions. Based on the return from this callback one of the following
 * will happen:
 *
 * 1. If the logged in user does not have the required permissions they are
 *    redirected to `/providers`.
 * 2. If the logged in user does have the required permissions navigation
 *    proceeds as expected.
 */
@Injectable()
export class ProviderPermissionsGuard implements CanActivate {
  constructor(
    private providerService: ProviderService,
    private router: Router,
    private platformUtilsService: PlatformUtilsService,
    private i18nService: I18nService,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot) {
    const provider = await this.providerService.get(route.params.providerId);
    if (provider == null) {
      return this.router.createUrlTree(["/"]);
    }

    if (!provider.isProviderAdmin && !provider.enabled) {
      this.platformUtilsService.showToast("error", null, this.i18nService.t("providerIsDisabled"));
      return this.router.createUrlTree(["/"]);
    }

    const permissionsCallback: (provider: Provider) => boolean = route.data?.providerPermissions;
    const hasSpecifiedPermissions = permissionsCallback == null || permissionsCallback(provider);

    if (!hasSpecifiedPermissions) {
      this.platformUtilsService.showToast("error", null, this.i18nService.t("accessDenied"));
      return this.router.createUrlTree(["/providers", provider.id]);
    }

    return true;
  }
}
