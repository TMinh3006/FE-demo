import { IProduct, Product } from './AProduct.interface';
import { apiService } from '@/configs/apiService';

export default {
  getProducts(page: number, limit: number): Promise<Product[]> {
    return apiService
      .get(`/api/v1/products`, {
        params: { page, limit },
      })
      .then((response) => response.data.products);
  },

  createProduct(data: IProduct): Promise<IProduct> {
    return apiService
      .post(`/api/v1/products`, data)
      .then((response) => {
        console.log('API response:', response);
        return response.data;
      })
      .catch((error) => {
        console.error('Error creating product:', error);
        throw error;
      });
  },

  updateProductById(id: number, data: IProduct): Promise<IProduct> {
    return apiService.put(`/api/v1/products/${id}`, data).then((response) => {
      console.log('API response:', response);
      return response.data;
    });
  },
  deleteProductById(id: number): Promise<void> {
    return apiService.delete(`/api/v1/products/${id}`).then((response) => {
      console.log('Product deleted successfully:', response);
    });
  },
};
