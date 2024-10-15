import { apiService } from '@/configs/apiService';
import { IRegister, ILoginForm, LoginResponse, User } from './Auth.interface';

export default {
  userRegister(data: IRegister): Promise<{ message: string }> {
    const userData = {
      ...data,
      role_id: 2,
    };

    return apiService
      .post('/api/v1/users/register', userData)

      .then((response) => {
        return response.data;
      });
  },

  userLogin(data: ILoginForm): Promise<LoginResponse> {
    return apiService
      .post('/api/v1/users/login', data)

      .then((response) => {
        return response.data;
      });
  },
  getUserById(id: string): Promise<User> {
    return apiService
      .get(`/api/v1/users/details/${id}`)

      .then((response) => {
        return response.data;
      });
  },
  updateUserById(id: string, data: Partial<User>): Promise<User> {
    return apiService
      .put(`/api/v1/users/details/${id}`, data)

      .then((response) => {
        localStorage.setItem('accessToken', response.data);
        return response.data;
      });
  },
};
