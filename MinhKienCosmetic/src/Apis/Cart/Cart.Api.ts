import {
  AddToCartRequest,
  ICartItem,
  IDecreaseQuantityResponse,
  IDeleteCartResponse,
} from './Cart.Interface';
import { apiService } from '@/configs/apiService';

export default {
  getCartById(id: string): Promise<ICartItem[]> {
    return apiService
      .get(`/api/v1/carts/user/${id}`)

      .then((response) => {
        return response.data.cartItems;
      });
  },
  decreaseQuantity(
    userId: string,
    productId: number,
    amount: number
  ): Promise<IDecreaseQuantityResponse> {
    return apiService
      .post(
        `/api/v1/carts/user/${userId}/decrease?productId=${productId}&amount=${amount}`
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
      .post(`/api/v1/carts/user/${userId}/add`, data)

      .then((response) => {
        return response.data;
      });
  },

  removeCart(userId: string, cartItemId: number): Promise<IDeleteCartResponse> {
    return apiService
      .delete(`/api/v1/carts/user/${userId}/remove?cartItemId=${cartItemId}`)
      .then((response) => {
        return response.data;
      });
  },
  clearCart(userId: string): Promise<void> {
    return apiService
      .delete(`/api/v1/carts/user/${userId}/clear`)
      .then(() => {});
  },
};
