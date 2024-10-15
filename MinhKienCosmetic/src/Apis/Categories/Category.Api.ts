import { ICategory } from './Category.interface';
import { apiService } from '@/configs/apiService';

export default {
  getCategories(): Promise<ICategory[]> {
    return apiService
      .get('/api/v1/categories?page=0&limit=80')
      .then((response) => {
        console.log('API response:', response);
        return response.data;
      });
  },
  getICategories(page: number, limit: number): Promise<ICategory[]> {
    return apiService
      .get(`/api/v1/categories`, {
        params: { page, limit },
      })
      .then((response) => response.data);
  },
  getCategoryById(categoryId: string): Promise<ICategory> {
    return apiService
      .get(`/api/v1/categories/${categoryId}`)
      .then((response) => {
        console.log('Category response:', response);
        return response.data;
      })
      .catch((error) => {
        console.error('Error fetching category by ID:', error);
        throw error;
      });
  },
};
