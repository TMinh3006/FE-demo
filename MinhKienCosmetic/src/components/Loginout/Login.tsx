import authApi from '@/Apis/Auth/Auth.api';
import { Button, Form, Input, notification } from 'antd';
import { useState } from 'react';
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
      localStorage.setItem('accessToken', response.token);
      localStorage.setItem('fullName', response.user.fullName);
      localStorage.setItem('userName', response.user.username);
      localStorage.setItem('id', response.user.id.toString());
      localStorage.setItem('role', response.user.role.id.toString());

      if (response.user.role.id === 1) {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      notify.error({
        message: 'Đăng nhập thất bại',
        description: 'Tài khoản hoặc mật khẩu không đúng',
      });
    }
    setIsLoading(false);
  };
  return (
    <div className="blur-background">
      <div className="flex h-screen items-center justify-center bg-cover bg-center">
        <div className="w-full max-w-md rounded-lg bg-white bg-opacity-80 p-10 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
            Đăng Nhập
          </h1>
          {notifyContext}
          <Form onFinish={handleLogin}>
            <Form.Item
              name="phone_number"
              label="Số Điện Thoại"
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 18 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại!',
                },
              ]}
            >
              <Input className="h-10 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 18 }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}
            >
              <Input.Password className="h-10 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="mb-4 h-12 w-full rounded-lg bg-pink-500 font-bold text-white transition duration-300 hover:bg-pink-600"
              >
                Đăng nhập
              </Button>
              <p className="text-center text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-pink-500 hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
              <p className="text-center text-gray-600">
                Quay lại{' '}
                <Link to="/" className="text-blue-700 hover:underline">
                  Trang chủ
                </Link>
              </p>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
