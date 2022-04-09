import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse } from '../models/custom-http-response';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private host = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[] | HttpErrorResponse> {
    // add page & size later
    return this.http.get<User[] | HttpErrorResponse>(
      `${this.host}/user/find/list`
    );
  }

  addUser(formData: FormData): Observable<User | HttpErrorResponse> {
    return this.http.post<User | HttpErrorResponse>(
      `${this.host}/user/admin/add`,
      formData
    );
  }

  updateUser(formData: FormData): Observable<User | HttpErrorResponse> {
    return this.http.post<User | HttpErrorResponse>(
      `${this.host}/user/admin/update`,
      formData
    );
  }

  resetPassword(
    email: string
  ): Observable<CustomHttpResponse | HttpErrorResponse> {
    return this.http.get<CustomHttpResponse | HttpErrorResponse>(
      `${this.host}/user/resetpassword/${email}`
    );
  }

  updateProfileImage(formData: FormData): Observable<any> {
    return this.http.post<any>(
      `${this.host}/user/update-profile-image `,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  deleteUser(
    userId: number
  ): Observable<CustomHttpResponse | HttpErrorResponse> {
    return this.http.delete<CustomHttpResponse | HttpErrorResponse>(
      `${this.host}/user/delete/${userId}`
    );
  }

  addUsersToLocalStorage(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  getUsersFromLocalStorage(): User[] {
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users') || (undefined as any));
    }
    return undefined as any;
  }

  public createFormData(
    loggedInUsername: string,
    user: User,
    profileImage: File
  ): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.notLocked));
    return formData;
  }
}
