export interface IOrderDetail {
  id: number;
  order: IOrder;
  product: IProduct;
  price: number;
  numberOfProducts: number;
  totalMoney: number;
}

export interface IOrder {
  id: number;
  address: string;
  user_id: number;
  fullname: string;
  email: string;
  phone_number: string;
  note: string;
  order_date: string; // ISO 8601 date string
  status: string;
  total_money: number;
  shipping_address: string;
  shipping_method: string;
  order_details: IOrderDetail[];
}

export interface IProduct {
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  thumbnails: string[];
  ingredient: string[];
  userManual: string;
  category: ICategory;
  brand: IBrand;
}

export interface ICategory {
  id: number;
  name: string;
  parent_id: number;
}

export interface IBrand {
  id: number;
  name: string;
  thumbnail: string;
}

export interface IUser {
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  password: string;
  active: boolean;
  dateOfBirth: string; // ISO 8601 date string
  facebookAccountId: number;
  googleAccountId: number;
  role: IRole;
  enabled: boolean;
  authorities: IAuthority[];
  username: string;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
}

export interface IRole {
  id: number;
  name: string;
}

export interface IAuthority {
  authority: string;
}

export interface IOrderResponse {
  orders: IOrder[];
  totalPages: number;
}
