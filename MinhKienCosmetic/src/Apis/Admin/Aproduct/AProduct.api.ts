import { IProduct, IProducts, ProductDetail } from './AProduct.interface';
import { apiService } from '@/configs/apiService';

export default {
  getProducts(page: number, limit: number): Promise<IProduct> {
    return apiService
      .get(`/products/get-all-products`, {
        params: { page, limit },
      })
      .then((response) => response.data);
  },

  createProduct(data: ProductDetail): Promise<IProducts> {
    return apiService
      .post(`/products/create-product`, data)
      .then((response) => {
        console.log('API response:', response);
        return response.data;
      })
      .catch((error) => {
        console.error('Error creating product:', error);
        throw error;
      });
  },

  updateProductById(id: string, data: ProductDetail): Promise<IProducts> {
    return apiService
      .put(`/products/update-product/${id}`, data)
      .then((response) => {
        console.log('API response:', response);
        return response.data;
      });
  },
  deleteProductById(id: string): Promise<void> {
    return apiService
      .delete(`/products/delete-product/${id}`)
      .then((response) => {
        console.log('Product deleted successfully:', response);
      });
  },
};
