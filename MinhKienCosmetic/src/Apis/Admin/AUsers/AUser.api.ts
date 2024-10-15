import { IUserResponse } from './AUser.interface';
import { apiService } from '@/configs/apiService';

export default {
  getUsers(page: number, limit: number): Promise<IUserResponse> {
    return apiService
      .get(`/api/v1/users`, {
        params: { page, limit },
      })
      .then((response) => response.data);
  },
  updateUserActiveStatus(id: number, isActive: boolean): Promise<void> {
    return apiService
      .put(`/api/v1/users/active/${id}`, null, {
        params: { isActive },
      })
      .then((response) => {
        return response.data;
      });
  },
};
