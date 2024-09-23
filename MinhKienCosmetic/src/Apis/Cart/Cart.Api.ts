import { ICart, ICartItem } from './Cart.Interface';
import { apiService } from '@/configs/apiService';

export default {
  getCartById(id: string): Promise<ICartItem[]> {
    return apiService
      .get(`/api/v1/carts/user/${id}`)

      .then((response) => {
        return response.data;
      });
  },
  decreaseQuantity(
    userId: string,
    productId: number,
    amount: number
  ): Promise<ICart[]> {
    return apiService
      .post(
        `/api/v1/carts/user/${userId}/decrease?productId=${productId}&amount=${amount}`
      )

      .then((response) => {
        // localStorage.setItem('accessToken', response.data);
        return response.data;
      });
  },

  increaseQuantity(
    userId: string,
    product_id: number,
    quantity: number
  ): Promise<ICart[]> {
    return apiService
      .post(`/api/v1/carts/user/${userId}/add`, {
        product_id: product_id,
        quantity: quantity,
      })

      .then((response) => {
        // localStorage.setItem('accessToken', response.data);
        return response.data;
      });
  },

  removeCart(userId: string, cartItemId: number): Promise<ICart[]> {
    return apiService
      .get(`/api/v1/carts/user/${userId}/remove?cartItemId=${cartItemId}`)
      .then((response) => {
        // localStorage.setItem('accessToken', response.data);
        return response.data;
      });
  },
};
