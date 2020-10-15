import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'biosimulations-error-500',
  templateUrl: './error-500.component.html',
  styleUrls: ['./error-500.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Error500Component {
  @Input()
  pageHasBreadCrumbs = false;

  message = 'Server error';
  details = 'Something went wrong.';
  email: string;
  emailUrl: string;
  newIssueUrl: string;

  constructor(router: Router, activatedRoute: ActivatedRoute) {
    const state = router.getCurrentNavigation()?.extras.state;
    this.message = state?.message || this.message;
    this.details = state?.details || this.details;

    const config = activatedRoute.snapshot.data?.config;
    this.email = config?.email;
    this.emailUrl = 'mailto:' + this.email;
    this.newIssueUrl = config?.newIssueUrl;    
  }
}
