import { AddToCartRequest, IApiResponse, Response } from './Cart.Interface';
import { apiService } from '@/configs/apiService';

export default {
  getCartById(id: string): Promise<IApiResponse> {
    return apiService
      .get(`/orders/cart/${id}`)

      .then((response) => {
        return response.data;
      });
  },
  decreaseQuantity(
    userId: string,
    productId: string,
    quantityToReduce: number
  ): Promise<Response> {
    return apiService
      .patch(
        `/orders/cart/${userId}/items/${productId}/reduce?quantityToReduce=${quantityToReduce}`
      )

      .then((response) => {
        return response.data;
      });
  },

  increaseQuantity(
    userId: string,
    data: AddToCartRequest
  ): Promise<AddToCartRequest[]> {
    return apiService
      .post(`/orders/cart/${userId}/items`, data)

      .then((response) => {
        return response.data;
      });
  },

  removeCart(userId: string, cartItemId: string): Promise<Response> {
    return apiService
      .delete(`orders/cart/${userId}/items/${cartItemId}`)
      .then((response) => {
        return response.data;
      });
  },
  clearCart(userId: string): Promise<void> {
    return apiService.delete(`/orders/cart/${userId}/clear`).then(() => {});
  },
};
