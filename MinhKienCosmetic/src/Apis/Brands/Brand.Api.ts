import { apiService } from '@/configs/apiService';
import { IBrands } from './Brands.interface';

export default {
  getBrand(page: number, limit: number): Promise<IBrands[]> {
    return apiService
      .get('/products/brands/get-all-brands', {
        params: { page, limit },
      })
      .then((response) => {
        console.log('brands response:', response);
        return response.data;
      });
  },
  getBrandId(id: string): Promise<IBrands> {
    return apiService.get(`/products/brands/${id}`).then((response) => {
      console.log('brands response:', response);
      return response.data;
    });
  },
};
