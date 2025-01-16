import { ICategory } from './Category.interface';
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

  getCategoryById(categoryId: string): Promise<ICategory> {
    return apiService
      .get(`/products/categories/${categoryId}`)
      .then((response) => {
        console.log('Category response:', response);
        return response.data;
      })
      .catch((error) => {
        console.error('Error fetching category by ID:', error);
        throw error;
      });
  },

  getCategoriesByNames(categoryNames: string[]): Promise<ICategory[]> {
    return this.getCategories().then((categories) =>
      categories.filter((category) => categoryNames.includes(category.name))
    );
  },
};
