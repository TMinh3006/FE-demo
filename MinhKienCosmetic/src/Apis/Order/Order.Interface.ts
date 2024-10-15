export interface ICartItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface IOrder {
  email: string;
  address: string;
  note: string;
  user_id: number;
  fullname: string;
  phone_number: string;
  total_money: number;
  shipping_address: string;
  shipping_method: string;
  shipping_date: string; // ISO format date string
  payment_method: string;
  cart_items: ICartItem[];
}
