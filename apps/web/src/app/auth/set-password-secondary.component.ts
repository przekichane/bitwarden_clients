import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

import { JslibModule } from "@bitwarden/angular/jslib.module";
import { InputPasswordComponent } from "@bitwarden/auth/angular";

@Component({
  standalone: true,
  selector: "app-set-password-secondary",
  templateUrl: "./set-password-secondary.component.html",
  imports: [InputPasswordComponent, JslibModule],
})
export class SetPasswordSecondaryComponent implements OnInit {
  private destroy$ = new Subject<void>();

  orgId: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((qParams) => {
      if (qParams.orgId) {
        this.orgId = qParams.orgId;
      }
    });
  }
}
