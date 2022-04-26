import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  host = environment.apiUrl;
  private token!: string;
  private loggedInUsername!: string;
  private jwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {}

  login(user: User): Observable<HttpResponse<any> > {
    return this.http.post<User>(
      `${this.host}/user/login`,
      user,
      { observe: 'response' }
    );
  }

  register(user: User): Observable<User | HttpErrorResponse> {
    return this.http.post<User | HttpErrorResponse>(
      `${this.host}/user/register`,
      user
    );
  }

  logOut() {
    this.token = '';
    this.loggedInUsername = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('users');
  }

  saveToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  addUserToLocalStorage(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserFromLocalStorage(): User {
    let userJson = localStorage.getItem('user')!;
    return JSON.parse(userJson);
  }

  loadToken() {
    this.token = localStorage.getItem('token')!;
  }

  getToken(): string {
    return this.token;
  }

  isLoggedIn(): boolean {
    this.loadToken();
    if (this.token) {
      if (
        this.jwtHelperService.decodeToken(this.token).sub &&
        !this.jwtHelperService.isTokenExpired(this.token)
      ) {
        this.loggedInUsername = this.jwtHelperService.decodeToken(
          this.token
        ).sub;
        return true;
      } else {
        this.logOut();
        return false;
      }
    } else {
      this.logOut();
      return false;
    }
  }
}
