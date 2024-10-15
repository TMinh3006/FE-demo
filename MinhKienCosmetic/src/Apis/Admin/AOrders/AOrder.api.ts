import { apiService } from '@/configs/apiService';
import { IOrder } from './AOrder.interface';

export default {
  getOrders(page: number, limit: number): Promise<IOrder[]> {
    return apiService
      .get(`/api/v1/orders`, {
        params: { page, limit },
      })
      .then((response) => response.data.orders);
  },
  updateOrderStatus(id: number, status: string): Promise<IOrder> {
    return apiService
      .patch(`/api/v1/orders/${id}/status?status=${status}`)
      .then((response) => response.data);
  },
  deleteOrderById(id: number): Promise<void> {
    return apiService.delete(`/api/v1/orders/${id}`).then((response) => {
      console.log('Product deleted successfully:', response);
    });
  },
};
