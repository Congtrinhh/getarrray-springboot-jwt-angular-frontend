import { NotificationType } from './../enums/notification-type.enum';
import { NotificationService } from './../services/notification.service';
import { AuthenticationService } from './../services/authentication.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router, private notificationService: NotificationService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean  {
    return this.isUserLoggedIn();
  }

  private isUserLoggedIn():boolean{
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    this.notificationService.showNotification(NotificationType.ERROR, `You need to log in to access this page`);
    return false;
   }
}
