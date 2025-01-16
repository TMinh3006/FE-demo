import { IUserResponse } from './AUser.interface';
import { apiService } from '@/configs/apiService';

export default {
  getUsers(): Promise<IUserResponse> {
    return apiService.get(`/identity/users`).then((response) => response.data);
  },
  updateUserActiveStatus(userId: string): Promise<void> {
    return apiService
      .put(`/identity/users/${userId}/deactivate`)
      .then((response) => {
        return response.data;
      });
  },
};
