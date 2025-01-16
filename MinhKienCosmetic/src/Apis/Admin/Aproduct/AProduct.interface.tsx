export interface IProductDetail {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  thumbnails?: string[];
  ingredient?: string[];
  userManual: string;
  categoryId: string;
  brandId: string;
  discount: number;
  newPrice: number;
}
export interface ProductDetail {
  discount: number;
  newPrice: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  thumbnails?: string[];
  ingredient?: string[];
  userManual: string;
  categoryId: string;
  brandId: string;
}
export interface IProductResponse {
  products: IProductDetail[];
  totalPages: number;
}

export interface IProduct {
  code: number;
  message: string;
  result: IProductResponse;
}
export interface IProducts {
  code: number;
  message: string;
  result: IProductDetail;
}
