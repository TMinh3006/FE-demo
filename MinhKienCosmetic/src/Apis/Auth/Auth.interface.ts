export interface IRegister {
  address: string;
  password: string;
  fullname: string;
  phone_number: string;
  retype_password: string;
  date_of_birth: string;
  facebook_account_id: 0;
  google_account_id: 0;
  role_id: 0;
}
export interface IErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}
// src/types/User.ts
export interface Role {
  id: number;
  name: string;
}

export interface Authority {
  authority: string;
}

export interface User {
  createdAt: string;
  updatedAt: string;
  id: number;
  fullName: string;
  phoneNumber: string;
  address: string;
  password: string;
  active: boolean;
  dateOfBirth: string;
  facebookAccountId: number;
  googleAccountId: number;
  role: Role;
  enabled: boolean;
  username: string;
  authorities: Authority[];
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  fullname: string;
  phone_number: string;
  date_of_birth: string;
}

export interface LoginResponse {
  user: User;
  message: string;
  token: string;
}

export interface ILoginForm {
  password: string;
  phone_number: string;
}
