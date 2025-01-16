export interface ICartItem {
  productId: string;
  quantity: number;
  price: number;
  newPrice: number;
  discount: number;
}

export interface IOrder {
  userId: string;
  email: string;
  name: string;
  phoneNumber: string;
  address: string;
  status: string;
  orderDate: string;
  discount: number;
  fee: number;
  note: string;
  totalMoney: number;
  shippingMethod: string;
  shippingDate: string;
  trackingNumber: string;
  paymentMethod: string;
  cartItemsIdRequest: ICartItem[];
  paymentUrl: string;
}

export interface IOrderDetail {
  id: string;
  orderId: string;
  productId: string;
  price: number;
  quantity: number;
  totalMoney: number;
  discount: number;
  newPrice: number;
}

export interface IOrderResult {
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

export interface ICreateOrderResponse {
  code: number;
  message: string;
  result: IOrderResult;
}
export interface IShippingFeeResponse {
  code: number;
  message: string;
  result: number;
}
