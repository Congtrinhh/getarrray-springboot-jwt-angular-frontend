import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NotificationType } from '../enums/notification-type.enum';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private notifierService: NotifierService) {}

  showNotification(type: NotificationType, message: string): void {
    if (type === NotificationType.ERROR && !message) {
      this.notifierService.notify(type, 'An error occurred');
    }
    this.notifierService.notify(type, message);
  }
}
