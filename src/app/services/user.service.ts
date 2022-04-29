import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
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

  getUsers(): Observable<any> {
    // add page & size later
    return this.http.get<any>(`${this.host}/user/find/all`);
    // http://localhost:8080/user/find/all
  }

  addUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/admin/new`, formData);
  }

  updateUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/admin/update`, formData);
  }

  resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(
      `${this.host}/user/reset-password/${email}`
    );
  }

  updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(
      `${this.host}/user/update-profile-image `,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  deleteUser(username: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(
      `${this.host}/user/delete/${username}`
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
    formData.append('firstName', user.firstName.trim());
    formData.append('lastName', user.lastName.trim());
    formData.append('username', user.username.trim());
    formData.append('email', user.email.trim());
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.isActive));
    formData.append('isNonLocked', JSON.stringify(user.isNonLocked));
    return formData;
  }
}
