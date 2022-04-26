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
    this.showLoading = true;
    this.authService.register(user).subscribe({
      next: (response) => {
        this.notificationService.showNotification(
          NotificationType.SUCCESS,
          'REGISTER SUCCESSFULLY, PASSWORD HAS BEEN SENT TO YOUR EMAIL'
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
  notifyError(message='AN ERROR OCCURRED, PLEASE TRY AGAIN') {
    this.notificationService.showNotification(NotificationType.ERROR, message);
  }
}
