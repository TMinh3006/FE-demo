export interface IProduct {
  name: string;
  price: number;
  quantity: number;
  thumbnails: string[];
  ingredients: string[];
  description: string;
  userManual: string;
  category_id: number;
  brand_id: number;
}
export interface Product {
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
}
