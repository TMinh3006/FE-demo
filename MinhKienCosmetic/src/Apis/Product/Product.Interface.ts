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
  category: {
    id: number;
    name: string;
    parent_id: number;
  };
  brand: {
    id: number;
    name: string;
  };
  brandName: string;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}
