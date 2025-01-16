export interface IOrderDetail {
  id: number;
  orderId: string;
  productId: string;
  price: number;
  quantity: number;
  totalMoney: number;
  discount: number;
  newPrice: number;
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
  code: number;
  message: string;
  result: IOrder;
}

export interface IOrderListResponse {
  code: number;
  message: string;
  result: IOrder[];
}
export interface IOrderDetailResponse {
  code: number;
  message: string;
  result: IOrderDetail[];
}
