import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";

import { JslibModule } from "@bitwarden/angular/jslib.module";
import { InputPasswordComponent } from "@bitwarden/auth/angular";

@Component({
  standalone: true,
  selector: "app-set-password-secondary",
  templateUrl: "./set-password-secondary.component.html",
  imports: [InputPasswordComponent, JslibModule],
})
export class SetPasswordSecondaryComponent implements OnInit {
  orgId: string;
  orgName: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  async ngOnInit() {
    const qParams = await firstValueFrom(this.route.queryParams);

    if (qParams.orgName == null && qParams.identifier == null) {
      await this.router.navigate(["/"]);
    }

    this.orgName = qParams.orgName;
    this.orgId = qParams.identifier; // from SsoComponent handleChangePasswordRequired()
  }
}
