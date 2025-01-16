import { apiService } from '@/configs/apiService';
import {
  ICreateOrderResponse,
  IOrder,
  IShippingFeeResponse,
} from './Order.interface';

export default {
  createOrder(orderData: IOrder): Promise<ICreateOrderResponse> {
    return apiService
      .post('orders/create-order', orderData)
      .then((response) => {
        console.log('Order created successfully:', response);
        return response.data as ICreateOrderResponse;
      })
      .catch((error) => {
        console.error('Error creating order:', error);
        throw error;
      });
  },
  getShippingFee(
    address: string,
    totalMoney: number
  ): Promise<IShippingFeeResponse> {
    return apiService
      .get(`/orders/shipping-fee`, {
        params: {
          address,
          totalMoney,
        },
      })
      .then((response) => {
        return response.data;
      });
  },
};
