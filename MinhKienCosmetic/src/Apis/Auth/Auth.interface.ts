export interface Role {
  name: string;
  description: string;
  permissions: string[];
}
export interface IRegister {
  id: string;
  username: string;
  dob: string;
  email: string;
  emailVerified: boolean;
  password: string;
  name: string | null;
  gender: 'male' | 'female' | 'other' | null;
  phoneNumber: string;
  roles: Role[];
}

export interface ApiResponse {
  code: number;
  message: string;
  result: {
    token: string;
    expiryTime: string;
  };
}

export interface ILoginForm {
  password: string;
  username: string;
}
export interface IUser {
  code: number;
  result: {
    id: string;
    username: string;
    dob?: string | null;
    email?: string;
    emailVerified: boolean;
    password: string;
    name: string | null;
    gender: string | null;
    age: number | null;
    phoneNumber: string | null;
    roles: Role[];
    active: boolean;
  };
}
export interface IUserResponse {
  code: number;
  result: IUser[];
}
