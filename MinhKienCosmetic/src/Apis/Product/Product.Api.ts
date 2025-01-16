import {
  AddToCartRequest,
  IProduct,
  IProductResponse,
  IProducts,
} from './Product.interface';
import { apiService } from '@/configs/apiService';

export default {
  getProducts(
    page?: number,
    limit?: number,
    sortBy?: string,
    sortDirection?: string,
    brands?: string[],
    priceRange?: [number, number]
  ): Promise<IProduct> {
    return apiService
      .get(`/products/get-all-products`, {
        params: {
          page,
          limit,
          sortBy,
          sortDirection,
          brands,
          minPrice: priceRange?.[0],
          maxPrice: priceRange?.[1],
        },
      })
      .then((response) => response.data);
  },

  getProductBrand(page: number, limit: number): Promise<IProductResponse> {
    return apiService
      .get(`/products/get-all-products`, {
        params: { page, limit },
      })
      .then((response) => response.data.products);
  },

  getById(id: string): Promise<IProducts> {
    return apiService.get(`/products/${id}`).then((response) => {
      console.log('API response for product:', response.data);
      return response.data;
    });
  },

  getCategoryId(
    categoryId: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortDirection?: string,
    brands?: string[],
    priceRange?: [number, number]
  ): Promise<IProduct> {
    return apiService
      .get(`/products/category/${categoryId}`, {
        params: {
          page,
          limit,
          sortBy,
          sortDirection,
          brands,
          minPrice: priceRange?.[0],
          maxPrice: priceRange?.[1],
        },
      })
      .then((response) => {
        console.log('API:', response);
        return response.data;
      });
  },

  getBrandById(
    brandId: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortDirection?: string,
    brands?: string[],
    priceRange?: [number, number]
  ): Promise<IProduct> {
    return apiService
      .get(`/products/brand/${brandId}`, {
        params: {
          page,
          limit,
          sortBy,
          sortDirection,
          brands,
          minPrice: priceRange?.[0],
          maxPrice: priceRange?.[1],
        },
      })
      .then((response) => {
        console.log('API:', response);
        return response.data;
      });
  },

  addToCart(
    userId: string,
    data: AddToCartRequest
  ): Promise<AddToCartRequest[]> {
    console.log('Gửi yêu cầu đến API');
    return apiService
      .post(`/orders/cart/${userId}/items`, data)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  },
};
