export class User {
  public id: number;
  public userId: string;
  public firstName: string;
  public lastName: string;
  public username: string;
  public email: string;
  public lastLoginDate: Date;
  public lastLoginDateDisplay: Date;
  public joinDate: Date;
  public profileImageUrl: string;
  public isActive: boolean;
  public isNonLocked: boolean;
  public role: string;
  public authorities: [];

  constructor() {
    this.id = -1;
    this.userId = '';
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.lastLoginDate = new Date();
    this.lastLoginDateDisplay = new Date();
    this.joinDate = new Date();
    this.profileImageUrl = '';
    this.isActive = false;
    this.isNonLocked = false;
    this.role = '';
    this.authorities = [];
  }
}
