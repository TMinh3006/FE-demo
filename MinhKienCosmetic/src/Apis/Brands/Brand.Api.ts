import { apiService } from '@/configs/apiService';
import { IBrands } from './Brands.Interface';

export default {
  getCategories(page: number, limit: number): Promise<IBrands[]> {
    return apiService
      .get(`/api/v1/brands`, {
        params: { page, limit },
      })
      .then((response) => response.data);
  },
};
