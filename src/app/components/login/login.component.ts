import { HeaderType } from './../../enums/header-type.enum';
import { NotificationType } from './../../enums/notification-type.enum';
import { User } from './../../models/user';
import { Router } from '@angular/router';
import { NotificationService } from './../../services/notification.service';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  showLoading = false;
  private subscriptions: Subscription[] = [];
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe())
  }

  onLogin(user: User): void {
    user.username = user.username.trim();

    this.showLoading = true;
    this.subscriptions.push(
      this.authService.login(user).subscribe(
        (response: HttpResponse<User>) => {
          const token = response.headers.get(HeaderType.JWT_TOKEN)!;
          this.authService.saveToken(token);
          this.authService.addUserToLocalStorage(response.body!);
          this.router.navigateByUrl('/user/management');
          this.showLoading = false;
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse)
          this.notificationService.showNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
          this.showLoading = false;
        }
      )
    );
  }
}
