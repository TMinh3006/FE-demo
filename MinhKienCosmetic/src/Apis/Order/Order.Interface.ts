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
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
}

export interface Category {
  id: number;
  name: string;
  parent_id: number;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Product {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  thumbnails: string[];
  ingredient: string[];
  userManual: string;
  category: Category;
  brand: Brand;
}

export interface IOrder {
  id: number;
  fullName: string;
  user: User;
  email: string;
  phoneNumber: string;
  address: string;
  note: string;
  orderDate: string;
  status: string;
  totalMoney: number;
  shippingMethod: string;
  shippingAddress: string;
  shippingDate: string;
  trackingNumber: string;
  paymentMethod: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderDetail {
  id: number;
  order: IOrder;
  product: Product;
  price: number;
  numberOfProducts: number;
  totalMoney: number;
}

export type OrderProduct = OrderDetail[];
