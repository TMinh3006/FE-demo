import { ICategory } from './ACategory.interface';
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

  createCategory(categoryData: ICategory): Promise<ICategory> {
    return apiService
      .post('/api/v1/categories', categoryData)
      .then((response) => {
        console.log('Category created:', response);
        return response.data;
      });
  },

  updateCategory(id: number, categoryData: ICategory): Promise<ICategory> {
    return apiService
      .put(`/api/v1/categories/${id}`, categoryData)
      .then((response) => {
        console.log('Category updated:', response);
        return response.data;
      });
  },
  deleteCategory(id: number): Promise<void> {
    return apiService.delete(`/api/v1/categories/${id}`).then((response) => {
      console.log('Category deleted:', response);
    });
  },
};
