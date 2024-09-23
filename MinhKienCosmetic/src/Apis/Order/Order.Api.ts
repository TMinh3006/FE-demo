import { apiService } from '@/configs/apiService';
import { IOrder } from './Order.Interface';

export default {
  getOrderById(orderId: string): Promise<IOrder[]> {
    return apiService
      .get(`/api/v1/order_details/order/${orderId}`)
      .then((response) => {
        console.log('Order response:', response);

        return response.data.product;
      })
      .catch((error) => {
        console.error('Error fetching order by ID:', error);
        throw error;
      });
  },
};
