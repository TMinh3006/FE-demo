import { apiService } from '@/configs/apiService';
import { Brands, IBrands, IBrandsResponse } from './ABrands.interface';

export default {
  getBrands(page: number, limit: number): Promise<IBrands[]> {
    return apiService
      .get(`/products/brands/get-all-brands`, {
        params: { page, limit },
      })
      .then((response) => response.data);
  },
  createBrands(data: Brands): Promise<IBrandsResponse> {
    return apiService
      .post(`/products/brands/create-brand`, data)
      .then((response) => {
        console.log('API response:', response);
        return response.data;
      });
  },
  updateBrands(id: string, data: Brands): Promise<IBrandsResponse> {
    return apiService
      .put(`/products/brands/${id}`, data)
      .then((response) => response.data);
  },
  deleteBrandsById(id: string): Promise<void> {
    return apiService.delete(`/products/brands/${id}`).then((response) => {
      console.log('Brands deleted successfully:', response);
    });
  },
};
