import authApi from '@/Apis/Auth/Auth.api';
import { Button, Form, Input, notification, DatePicker } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IRegister, IErrorResponse } from '@/Apis/Auth/Auth.interface';

const RegisterPage = () => {
  const [notify, notifyContext] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (values: IRegister) => {
    try {
      setIsLoading(true);

      await authApi.userRegister(values);

      notify.success({
        message: 'Đăng ký thành công',
        description: 'Tài khoản của bạn đã được tạo',
      });

      window.location.href = '/login';
    } catch (error) {
      // Kiểm tra loại lỗi và cấu trúc của nó
      const err = error as IErrorResponse;
      const errorMessage =
        err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại';

      notify.error({
        message: 'Đăng ký thất bại',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="blur-background">
      <div className="flex h-screen items-center justify-center bg-cover bg-center">
        <div className="w-full max-w-md rounded-lg bg-white bg-opacity-80 p-10 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
            Đăng Ký
          </h1>
          {notifyContext}
          <Form onFinish={handleRegister}>
            <Form.Item
              name="fullname"
              label="Họ và Tên"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập họ và tên!',
                },
              ]}
            >
              <Input className="h-10 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </Form.Item>

            <Form.Item
              name="phone_number"
              label="Số Điện Thoại"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại!',
                },
              ]}
            >
              <Input className="h-10 rounded-lg border border-gray-300 px-10 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </Form.Item>

            <Form.Item
              name="date_of_birth"
              label="Ngày Sinh"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn ngày sinh!',
                },
              ]}
            >
              <DatePicker
                className="h-10 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}
            >
              <Input.Password className="h-10 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </Form.Item>

            <Form.Item
              name="retype_password"
              label="Nhập lại Mật khẩu"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập lại mật khẩu!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
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
                Đăng ký
              </Button>
              <p className="text-center text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-pink-500 hover:underline">
                  Đăng nhập ngay
                </Link>
              </p>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
