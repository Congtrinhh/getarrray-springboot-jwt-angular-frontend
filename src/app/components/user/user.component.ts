import { Role } from './../../enums/role.enum';
import { FileUploadStatus } from './../../models/file-upload-status';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CustomHttpResponse } from './../../models/custom-http-response';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { NotificationType } from './../../enums/notification-type.enum';
import { NotificationService } from './../../services/notification.service';
import { UserService } from './../../services/user.service';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  private titleSubject = new BehaviorSubject<string>('users');
  public titleAction$ = this.titleSubject.asObservable();

  public users: User[] = [];
  public user = new User();
  public showLoading = false;

  public selectedUser = new User();

  public fileName = '';
  public profileImage!: File;

  public editUser = new User();
  public currentUsername = '';
  public usernameToDelete = '';
  public fileUploadStatus = new FileUploadStatus();

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();
    this.getUsers(true);
  }

  get isSuperAdmin(): boolean {
    return this.getUserRole() == Role.SUPER_ADMIN;
  }

  get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN;
  }

  get isManageOrHr(): boolean {
    return (
      this.getUserRole() === Role.MANAGER || this.getUserRole() === Role.HR
    );
  }

  get isUser(): boolean {
    return this.getUserRole() === Role.USER;
  }

  getUserRole(): string {
    return this.authService.getUserFromLocalStorage().role;
  }

  onUpdateProfileImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.profileImage = file;
      const formData = new FormData();
      formData.append(
        'username',
        this.authService.getUserFromLocalStorage().username
      );
      formData.append('profileImage', this.profileImage);
      this.userService.updateProfileImage(formData).subscribe({
        next: (event: HttpEvent<User>) => {
          this.reportUploadProgress(event);
        },
        error: (response: HttpErrorResponse) => {
          this.notificationService.showNotification(
            NotificationType.ERROR,
            response.error.message
          );
          this.fileUploadStatus.status = 'done';
        },
      });
    } else {
    }
  }

  private reportUploadProgress(event: HttpEvent<User>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        const total = event.total || 0;
        this.fileUploadStatus.percentage = Math.round(
          (100 * event.loaded) / total
        );
        this.fileUploadStatus.status = 'progress';
        break;
      case HttpEventType.Response:
        if (event.status == 200) {
          this.notificationService.showNotification(
            NotificationType.SUCCESS,
            `User image successfully updated`
          );
          this.user.profileImageUrl = `${
            event.body?.profileImageUrl
          }?time=${new Date().getTime()}`;
          this.authService.addUserToLocalStorage(this.user);
        } else {
          this.notificationService.showNotification(
            NotificationType.ERROR,
            "Can't update profile image"
          );
        }
        this.fileUploadStatus.status = 'done';
        break;
      default:
    }
  }

  clickChooseProfileImageButton() {
    this.clickButtonWithId('profileImageFileInput');
  }

  onUpdateUserProfile(): void {
    const loggedInUsername =
      this.authService.getUserFromLocalStorage().username;
    const formData = this.userService.createFormData(
      loggedInUsername,
      this.user,
      undefined as any
    );
    this.userService.updateUser(formData).subscribe({
      next: (user: User) => {
        this.user = user;
        this.authService.addUserToLocalStorage(user);
        this.showLoading = false;
        this.notificationService.showNotification(
          NotificationType.SUCCESS,
          `User ${user.username} successfully updated`
        );
      },
      error: (response: HttpErrorResponse) => {
        this.showLoading = false;
        this.notificationService.showNotification(
          NotificationType.ERROR,
          response.error.message
        );
      },
    });
  }

  logout() {
    this.authService.logOut();
    this.router.navigateByUrl('/login');
    this.notificationService.showNotification(
      NotificationType.SUCCESS,
      "You've logged out successfully"
    );
  }

  onTitleChange(newTitle: string): void {
    this.titleSubject.next(newTitle);
  }

  getUsers(showNotification: boolean): void {
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.users;
        this.showLoading = false;
        this.userService.addUsersToLocalStorage(response.users);
        if (showNotification) {
          this.notificationService.showNotification(
            NotificationType.SUCCESS,
            `Retrieved ${this.users.length} user(s)`
          );
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.showLoading = false;
        this.notificationService.showNotification(
          NotificationType.ERROR,
          'An error occurred: ' + errorResponse.error.message
        );
      },
    });
  }

  handleResetPassword(emailForm: NgForm) {
    const email = emailForm.value['reset-password-email'];
    this.showLoading = true;
    this.userService.resetPassword(email).subscribe({
      next: (response: CustomHttpResponse) => {
        this.notificationService.showNotification(
          NotificationType.SUCCESS,
          response.message
        );
        this.showLoading = false;
      },
      error: (response: HttpErrorResponse) => {
        this.notificationService.showNotification(
          NotificationType.ERROR,
          'An error occurred: ' + response.error.message
        );
        this.showLoading = false;
      },
      complete: () => {
        emailForm.reset();
        console.log('complete reset');
      },
    });
  }

  onDeleteBtnClick(username: string): void {
    this.usernameToDelete = username;
  }

  handleDeleteUser() {
    this.userService.deleteUser(this.usernameToDelete).subscribe({
      next: (response: CustomHttpResponse) => {
        this.notificationService.showNotification(
          NotificationType.SUCCESS,
          response.message
        );
        this.clickButtonWithId('confirmDeleteModalClose');
        this.getUsers(false);
      },
      error: (response: HttpErrorResponse) => {
        this.notificationService.showNotification(
          NotificationType.ERROR,
          response.error.message
        );
        this.clickButtonWithId('confirmDeleteModalClose');
      },
    });
  }

  onEditBtnClick(user: User): void {
    this.editUser = user;
    this.currentUsername = user.username;
    this.clickButtonWithId('openUserEdit');
  }

  onUpdateUser(): void {
    const formData = this.userService.createFormData(
      this.currentUsername,
      this.editUser,
      this.profileImage
    );
    this.userService.updateUser(formData).subscribe({
      next: (response: User) => {
        this.notificationService.showNotification(
          NotificationType.SUCCESS,
          'Update user ' + response.username + ' successfully'
        );
        this.clickButtonWithId('edit-user-close');
      },
      error: (response: HttpErrorResponse) => {
        this.notificationService.showNotification(
          NotificationType.ERROR,
          response.error.message
        );
      },
    });
  }

  clickButtonWithId(id: string): void {
    document.getElementById(id)?.click();
  }

  searchUsers(searchTerm: string): void {
    const results: User[] = [];
    for (const user of this.userService.getUsersFromLocalStorage()) {
      if (
        user.username
          .toLocaleLowerCase()
          .indexOf(searchTerm.toLocaleLowerCase()) !== -1 ||
        user.userId
          .toLocaleLowerCase()
          .indexOf(searchTerm.toLocaleLowerCase()) !== -1 ||
        user.email
          .toLocaleLowerCase()
          .indexOf(searchTerm.toLocaleLowerCase()) !== -1
      ) {
        results.push(user);
      }
    }
    this.users = results;
  }

  onSelectUser(user: User): void {
    this.selectedUser = user;
    this.clickButtonWithId('openUserInfo');
  }

  onProfileImageChange($event: any): void {
    const profileImage: File = $event.target.files[0];
    if (profileImage) {
      this.fileName = profileImage.name;
      this.profileImage = profileImage;
    }
  }

  clickSubmitFormButton() {
    document.getElementById('new-user-save')?.click();
  }

  onCreateNewUser(form: NgForm): void {
    const formData = this.userService.createFormData(
      '',
      form.value,
      this.profileImage
    );
    this.userService.addUser(formData).subscribe({
      next: (response: User) => {
        this.notificationService.showNotification(
          NotificationType.SUCCESS,
          'created successfully'
        );
        this.getUsers(false);
        document.getElementById('new-user-close')?.click();
        this.fileName = '';
        this.profileImage = undefined as any;
        form.reset();
      },
      error: (response: HttpErrorResponse) => {
        this.notificationService.showNotification(
          NotificationType.ERROR,
          'failed to create new user, ' + response.error.message
        );
      },
    });
  }
}
