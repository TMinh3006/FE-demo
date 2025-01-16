import { apiService } from '@/configs/apiService';
import { IOrder } from './AOrder.interface';

export default {
  getOrders(page: number, limit: number): Promise<IOrder[]> {
    return apiService
      .get(`/orders/get-all-orders`, {
        params: { page, limit },
      })
      .then((response) => response.data.orders);
  },
  updateOrderStatus(id: string, status: string): Promise<void> {
    return apiService
      .patch(`/orders/${id}/status?status=${status}`)
      .then((response) => response.data);
  },
  deleteOrderById(id: string): Promise<void> {
    return apiService.delete(`/orders/order-detail/${id}`).then((response) => {
      console.log('Product deleted successfully:', response);
    });
  },
};
