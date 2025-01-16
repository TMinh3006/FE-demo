export interface ICategory {
  id: number;
  name: string;
  parent_id: number;
}

export interface IBrand {
  id: number;
  name: string;
}

export interface ICartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  newPrice: number;
}

export interface ICartResult {
  id: string;
  userId: string;
  total: number;
  cartItemIds: ICartItem[];
}

export interface IApiResponse {
  code: number;
  message: string;
  result: ICartResult;
}

export interface Response {
  message: string;
  code: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  newPrice: number;
}
