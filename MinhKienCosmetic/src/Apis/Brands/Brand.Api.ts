import { apiService } from '@/configs/apiService';
import { IProductResponse } from './Brands.interface';

export default {
  getBrandById(
    brandId: string,
    page: number,
    limit: number
  ): Promise<IProductResponse> {
    return apiService
      .get(`/api/v1/products/brand/${brandId}`, {
        // Đảm bảo endpoint này là chính xác
        params: { page: page + 2, limit },
      })
      .then((response) => {
        // Đảm bảo trả về toàn bộ dữ liệu cần thiết
        return {
          products: response.data.products,
          totalPages: response.data.totalPages, // Đảm bảo rằng totalPages có trong phản hồi
        };
      });
  },
};
