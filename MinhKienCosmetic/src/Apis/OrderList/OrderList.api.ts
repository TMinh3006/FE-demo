import { apiService } from '@/configs/apiService';
import {
  IOrderDetailResponse,
  IOrderListResponse,
  IOrderResponse,
} from './OrderList.interface';
export default {
  getOrdersByUserId(userId: string): Promise<IOrderListResponse> {
    return apiService.get(`/orders/user/${userId}`).then((response) => {
      return response.data;
    });
  },
  getOrderById(id: string): Promise<IOrderResponse> {
    return apiService.get(`/orders/${id}`).then((response) => {
      return response.data;
    });
  },
  getOrderDetailById(id: string): Promise<IOrderDetailResponse> {
    return apiService
      .get(`/orders/order-detail/get-orders/${id}`)
      .then((response) => {
        return response.data;
      });
  },
};
