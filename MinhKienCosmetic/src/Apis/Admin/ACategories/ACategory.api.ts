import { Category, ICategory } from './ACategory.interface';
import { apiService } from '@/configs/apiService';

export default {
  getCategories(): Promise<ICategory[]> {
    return apiService
      .get('/products/categories/get-all-categories')
      .then((response) => {
        console.log('API response:', response);
        return response.data;
      });
  },

  createCategory(categoryData: Category): Promise<void> {
    return apiService
      .post('/products/categories/create-category', categoryData)
      .then((response) => {
        console.log('Category created:', response);
        return response.data;
      });
  },

  updateCategory(id: string, categoryData: Category): Promise<void> {
    return apiService
      .put(`/products/categories/${id}`, categoryData)
      .then((response) => {
        console.log('Category updated:', response);
        return response.data;
      });
  },
  deleteCategory(id: string): Promise<void> {
    return apiService.delete(`/products/categories/${id}`).then((response) => {
      console.log('Category deleted:', response);
    });
  },
};
