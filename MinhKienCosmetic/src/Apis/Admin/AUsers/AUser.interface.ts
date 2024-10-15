export interface IUser {
  id: number;
  fullName: string;
  email: string;
  address: string;
  dateOfBirth: string; // Bạn có thể thay đổi kiểu thành Date nếu cần
  phone_number: string;
  active: boolean;
}

export interface IUserResponse {
  users: IUser[];
  totalPages: number;
}
