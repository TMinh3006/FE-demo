import { apiService } from '@/configs/apiService';
import { IRegister, ILoginForm, LoginResponse, User } from './Auth.interface';

export default {
  // Đăng ký không cần xác thực
  userRegister(data: IRegister): Promise<{ message: string }> {
    return apiService.post('/api/v1/users/register', data).then((response) => {
      console.log('API login:', response); // Log phản hồi từ API
      localStorage.setItem('accessToken', response.data);
      return response.data;
    });
  },

  userLogin(data: ILoginForm): Promise<LoginResponse> {
    return apiService
      .post('/api/v1/users/login', data)

      .then((response) => {
        console.log('API login:', response); // Log phản hồi từ API
        localStorage.setItem('accessToken', response.data);
        return response.data;
      });
  },
  getUserById(id: string): Promise<User> {
    return apiService
      .get(`/api/v1/users/details/${id}`)

      .then((response) => {
        localStorage.setItem('accessToken', response.data);
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
