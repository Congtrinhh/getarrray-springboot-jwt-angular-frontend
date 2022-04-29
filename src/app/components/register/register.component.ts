import { NotificationService } from './../../services/notification.service';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationType } from 'src/app/enums/notification-type.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  showLoading = false;
  constructor(
    private authService: AuthenticationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  onRegister(user: User): void {
    user = this.cleanUser(user);

    this.showLoading = true;
    this.authService.register(user).subscribe({
      next: (response) => {
        this.notificationService.showNotification(
          NotificationType.SUCCESS,
          'Register successfully, password has been sent to your email'
        );
      },
      error: (errResponse) => {
        this.notifyError(errResponse.error.message);
        this.showLoading = false;
      },
      complete: () => {
        this.showLoading = false;
      },
    });
  }
  cleanUser(user: User): User {
    user.username = user.username.trim();
    user.firstName = user.firstName.trim();
    user.lastName = user.lastName.trim();
    user.email = user.email.trim();
    return user;
  }
  notifyError(message = 'An error occurred, please try again') {
    this.notificationService.showNotification(NotificationType.ERROR, message);
  }
}
