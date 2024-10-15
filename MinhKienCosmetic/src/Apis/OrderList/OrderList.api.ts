import { apiService } from '@/configs/apiService';
import { IOrder, Order } from './OrderList.interface';
export default {
  getOrdersByUserId(userId: string): Promise<IOrder[]> {
    return apiService.get(`/api/v1/orders/user/${userId}`).then((response) => {
      return response.data;
    });
  },
  getOrderById(id: string): Promise<Order> {
    return apiService.get(`/api/v1/orders/${id}`).then((response) => {
      return response.data;
    });
  },
};
