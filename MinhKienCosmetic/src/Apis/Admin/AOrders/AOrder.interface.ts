export interface IOrderDetail {
  id: string;
  orderId: string;
  productId: string;
  price: number;
  quantity: number;
  totalMoney: number;
}

export interface IOrder {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  note: string;
  orderDate: string;
  status: string;
  discount: number;
  fee: number;
  totalMoney: number;
  shippingMethod: string;
  shippingDate: string;
  trackingNumber: string;
  paymentMethod: string;
  active: boolean;
  orderDetailId: IOrderDetail[];
  paymentUrl: string;
}
export interface IOrderResponse {
  orders: IOrder[];
  totalPages: number;
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
  createdAt: string;
  updatedAt: string;
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  password: string;
  active: boolean;
  dateOfBirth: string;
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
