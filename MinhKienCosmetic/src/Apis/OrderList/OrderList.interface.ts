export interface IUserRole {
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
  role: IUserRole;
  enabled: boolean;
  authorities: IAuthority[];
  username: string;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
}

export interface IProductCategory {
  id: number;
  name: string;
  parent_id: number;
}

export interface IProductBrand {
  id: number;
  name: string;
  thumbnail: string;
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
  category: IProductCategory;
  brand: IProductBrand;
}

export interface IOrderDetail {
  id: number;
  order: string;
  product: IProduct;
  price: number;
  numberOfProducts: number;
  totalMoney: number;
}

export interface IOrder {
  id: number;
  fullName: string;
  user: IUser;
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
  orderDetails: IOrderDetail[];
  created_at: string;
  updated_at: string;
}
export interface Order {
  id: number; // id là số
  fullname: string; // Đổi thành fullname
  phone_number: string; // Đổi thành phone_number
  email: string;
  address: string; // Có thể là địa chỉ chính
  note?: string; // Ghi chú
  order_date: string; // Có thể giữ nguyên kiểu string cho ngày
  shipping_address: string; // Đổi thành shipping_address
  shipping_method: string;
  status: string;
  total_money: number; // Giữ nguyên kiểu số
  order_details: Array<{
    product: {
      id: string; // ID sản phẩm (bạn cần đảm bảo kiểu này tương ứng với API)
      name: string; // Tên sản phẩm (có thể bạn cần thêm trường này)
      thumbnails: string[]; // Hình ảnh sản phẩm
    };
    price: number; // Giá của sản phẩm
    numberOfProducts: number; // Số lượng sản phẩm
    totalMoney: number; // Thành tiền
  }>;
}
