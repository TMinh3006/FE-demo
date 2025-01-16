export interface IBrands {
  id: string;
  name: string;
  thumbnail: string;
}

export interface IProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
  thumbnails: string[];
  ingredients: string[];
  description: string;
  userManual: string;
  categoryName: string;
  brandName: string;
  categoryId: number;
  brandId: number;
}

export interface IProductResponse {
  products: IProduct[];
  totalPages: number;
}
