import { apiService } from '@/configs/apiService';
import { IRegister, ILoginForm, IUser, ApiResponse } from './Auth.interface';

export default {
  userRegister(data: IRegister): Promise<{ message: string }> {
    return apiService
      .post('/identity/users/registration', data)

      .then((response) => {
        return response.data;
      });
  },

  userLogin(data: ILoginForm): Promise<ApiResponse> {
    return apiService
      .post('/identity/auth/token', data)

      .then((response) => {
        return response.data;
      });
  },
  getUserById(userId: string): Promise<IUser> {
    return apiService
      .get(`/profile/users/${userId}`)

      .then((response) => {
        return response.data;
      });
  },
  getUserinfo(): Promise<IUser> {
    return apiService
      .get('/identity/users/my-info')

      .then((response) => {
        return response.data;
      });
  },
  updateUserById(
    userId: string,
    updatedUser: Partial<IUser['result']>
  ): Promise<IUser> {
    return apiService
      .put(`/profile/users/${userId}`, updatedUser)

      .then((response) => {
        return response.data;
      });
  },
};
