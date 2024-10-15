import { apiService } from '@/configs/apiService';
import { IOrder } from './Order.interface';

export default {
  createOrder(orderData: IOrder): Promise<IOrder> {
    return apiService
      .post('/api/v1/orders', orderData)
      .then((response) => {
        console.log('Order created successfully:', response);
        return response.data;
      })
      .catch((error) => {
        console.error('Error creating order:', error);
        throw error;
      });
  },
};
