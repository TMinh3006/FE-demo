export interface IBrands {
  id: number;
  name: string;
  thumbnail: string;
}

export interface IProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
  thumbnails: string[];
  ingredients: string[]; // Có thể thay đổi kiểu nếu cần thiết
  description: string;
  userManual: string;
  categoryName: string;
  brandName: string;
  created_at: string; // Thay đổi thành Date nếu bạn muốn chuyển đổi
  updated_at: string; // Thay đổi thành Date nếu bạn muốn chuyển đổi
  category_id: number;
  brand_id: number;
}

export interface IProductResponse {
  products: IProduct[];
  totalPages: number;
}
