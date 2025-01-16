import authApi from '@/Apis/Auth/Auth.api';
import { Button, Form, Input, notification } from 'antd';
import { useState } from 'react';
import img1 from '@/assets/LOG.jpg';
import { Link } from 'react-router-dom';
import { ILoginForm } from '@/Apis/Auth/Auth.interface';

const LoginPage = () => {
  const [notify, notifyContext] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values: ILoginForm) => {
    try {
      setIsLoading(true);
      console.log('Login values:', values);

      const response = await authApi.userLogin(values);

      // Lưu token trong localStorage
      localStorage.setItem('accessToken', response.result.token);
      localStorage.setItem('refreshToken', response.result.token);
      localStorage.setItem('expiryTime', response.result.expiryTime);
      localStorage.setItem('username', values.username);

      const userId = await authApi.getUserinfo();
      localStorage.setItem('userId', userId.result.id);
      localStorage.setItem('roles', JSON.stringify(userId.result.roles));

      notify.success({
        message: 'Đăng nhập thành công',
      });
      const roles = userId.result.roles;
      const isAdmin = roles.some((role) => role.name === 'ADMIN');
      console.log(isAdmin);

      if (isAdmin) {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.log(error);
      notify.error({
        message: 'Đăng nhập thất bại',
        description: 'Tài khoản hoặc mật khẩu không đúng',
      });
    }
    setIsLoading(false);
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="relative mx-6 mb-6 flex flex-col space-y-2 rounded-2xl bg-white shadow-2xl md:flex-row md:space-y-0">
        {/* Left Side */}
        <div className="flex flex-col justify-center p-8 md:p-10">
          <h1 className="mb-3 text-2xl font-bold">Đăng Nhập</h1>
          <p className="-light mb-5 text-sm text-gray-500">
            Vui lòng nhập thông tin đăng nhập
          </p>
          {notifyContext}
          <Form
            name="login"
            layout="vertical"
            onFinish={handleLogin}
            className="space-y-5"
          >
            <Form.Item
              label={<span className="font-medium">Username</span>}
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
            >
              <Input
                placeholder="username"
                size="large"
                className="rounded-md border border-gray-300 p-2 placeholder:font-light placeholder:text-gray-500"
              />
            </Form.Item>
            <Form.Item
              label={<span className="font-medium">Mật khẩu</span>}
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                placeholder="********"
                size="large"
                className="rounded-md border border-gray-300 p-2 placeholder:font-light placeholder:text-gray-500"
              />
            </Form.Item>
            {/* <div className="flex w-full justify-between py-4">
              <div>
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember" className="text-md">
                  Ghi nhớ 30 ngày
                </label>
              </div>
              <Link to="/forgot-password" className="text-md font-bold">
                Quên mật khẩu?
              </Link>
            </div> */}
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isLoading}
              className="mb-6 w-full rounded-lg bg-pink-500 p-2 text-white hover:border hover:border-gray-300 hover:!bg-pink-600 hover:text-black"
            >
              Đăng Nhập
            </Button>
          </Form>
          <p className="mt-6 text-center text-sm text-gray-500">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-bold text-pink-600 underline">
              Đăng ký
            </Link>
          </p>
        </div>
        {/* Right Side */}
        <div className="relative hidden md:block">
          <img
            src={img1}
            alt="Login"
            className="h-full w-[400px] rounded-r-2xl object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
