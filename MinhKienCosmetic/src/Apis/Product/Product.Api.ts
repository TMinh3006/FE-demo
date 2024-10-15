import {
  AddToCartRequest,
  IProduct,
  IProductResponse,
} from './Product.interface';
import { apiService } from '@/configs/apiService';

export default {
  getProducts(page: number, limit: number): Promise<IProduct[]> {
    return apiService
      .get(`/api/v1/products`, {
        params: { page, limit },
      })
      .then((response) => response.data.products);
  },

  getProductBrand(page: number, limit: number): Promise<IProductResponse> {
    return apiService
      .get(`/api/v1/products`, {
        params: { page, limit },
      })
      .then((response) => response.data.products);
  },

  getById(id: string): Promise<IProduct & { id?: string }> {
    return apiService.get(`/api/v1/products/${id}`).then((response) => {
      console.log('API:', response);
      return response.data;
    });
  },

  getCategoryId(
    categoryId: string,
    page: number,
    limit: number
  ): Promise<IProductResponse> {
    return apiService
      .get(`/api/v1/products/category/${categoryId}`, {
        params: { page: page - 2, limit },
      })
      .then((response) => {
        // Đảm bảo trả về đúng kiểu IProductResponse
        return {
          products: response.data.products,
          totalPages: response.data.totalPages,
        };
      });
  },

  addToCart(
    userId: string,
    data: AddToCartRequest
  ): Promise<AddToCartRequest[]> {
    console.log('Gửi yêu cầu đến API');
    return apiService
      .post(`/api/v1/carts/add?userId=${userId}`, data)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('giỏ hàng sai:', error);
        throw error; // Ném lỗi để xử lý ở nơi khác
      });
  },
};
