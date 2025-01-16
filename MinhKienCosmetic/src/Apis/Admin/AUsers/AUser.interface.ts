export interface Role {
  name: string;
  description: string;
  permissions: string[];
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
    occupation: string | null;
    roles: Role[];
    active: boolean;
  };
}

export interface IUserResponse {
  code: number;
  result: IUser[];
}
