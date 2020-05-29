import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PlatformUtilsService } from 'jslib/abstractions/platformUtils.service';
import { UserService } from 'jslib/abstractions/user.service';
import { StorageService } from 'jslib/abstractions/storage.service';

@Component({
    selector: 'app-org-settings',
    templateUrl: 'settings.component.html',
})
export class SettingsComponent {
    access2fa = false;
    selfHosted: boolean;
    scaleUIWidth: boolean = false;

    constructor(private route: ActivatedRoute, private userService: UserService,
        private platformUtilsService: PlatformUtilsService, private storageService: StorageService) { }

    ngOnInit() {
        this.route.parent.params.subscribe(async (params) => {
            this.scaleUIWidth = await this.storageService.get<boolean>('enableUIScaling');
            this.selfHosted = await this.platformUtilsService.isSelfHost();
            const organization = await this.userService.getOrganization(params.organizationId);
            this.access2fa = organization.use2fa;
        });
    }
}
