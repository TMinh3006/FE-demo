export interface IRole {
  id: number;
  name: string;
}

export interface IAuthority {
  authority: string;
}

export interface IUser {
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
  role: IRole;
  enabled: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  authorities: IAuthority[];
  username: string;
}

export interface ICategory {
  id: number;
  name: string;
  parent_id: number;
}

export interface IBrand {
  id: number;
  name: string;
}

export interface IProduct {
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
  category: ICategory;
  brand: IBrand;
}

export interface ICartItem {
  id: number;
  cart: string;
  product: IProduct;
  quantity: number;
  price: number;
}

export interface ICart {
  id: number;
  user: IUser;
  cartItems: ICartItem[];
}

export interface IDeleteCartResponse {
  message: string;
  status: string;
}
export interface IDecreaseQuantityResponse {
  success: boolean;
  message: string;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}
