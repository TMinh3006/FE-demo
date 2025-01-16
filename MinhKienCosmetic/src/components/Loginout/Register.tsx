import authApi from '@/Apis/Auth/Auth.api';
import {
  Button,
  Form,
  Input,
  notification,
  DatePicker,
  Row,
  Col,
  Radio,
} from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import img1 from '@/assets/LOG.jpg';
import { IRegister } from '@/Apis/Auth/Auth.interface';
import moment from 'moment';

const RegisterPage = () => {
  const [notify, notifyContext] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (values: IRegister) => {
    try {
      const userData: IRegister = {
        ...values,
        dob: moment(values.dob).format('YYYY-MM-DD'),
      };

      const response = await authApi.userRegister(userData);
      console.log('API Response:', response);

      notify.success({
        message: 'Đăng ký thành công',
        description: 'Tài khoản của bạn đã được tạo',
      });

      window.location.href = '/login';
    } catch (error) {
      notify.error({
        message: 'Đăng ký thất bại',
      });
    }
    setIsLoading(false);
  };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-3">
      {/* Container */}
      <div className="relative m-6 flex flex-col space-y-4 rounded-2xl bg-white shadow-2xl md:flex-row md:space-y-0">
        {/* Left Image */}
        <div className="relative hidden w-1/2 md:block">
          <img
            src={img1}
            alt="Register"
            className="h-full w-full rounded-l-2xl object-cover"
          />
        </div>
        {/* Right Side */}
        <div className="flex w-full flex-col p-8 md:w-1/2 md:p-5">
          <h1 className="mb-3 text-2xl font-bold">Đăng Ký</h1>
          {notifyContext}
          <Form
            name="register"
            layout="vertical"
            onFinish={handleRegister}
            className="space-y-2"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium">Username</span>}
                  name="username"
                  rules={[{ required: true, message: 'Vui lòng nhập Họ tên!' }]}
                >
                  <Input
                    placeholder="abcd"
                    size="large"
                    className="rounded-full"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium">Email</span>}
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập địa chỉ email!' },
                    {
                      pattern: emailRegex,
                      message: "Email phải là định dạng '@gmail.com'!",
                    },
                  ]}
                >
                  <Input
                    placeholder="you@gmail.com"
                    size="large"
                    className="rounded-full"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium">Mật Khẩu</span>}
                  name="password"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                  ]}
                >
                  <Input.Password
                    placeholder="********"
                    size="large"
                    className="rounded-full"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium">Nhập lại Mật khẩu</span>}
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('Mật khẩu không khớp!')
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="********"
                    size="large"
                    className="rounded-full"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium">Tên</span>}
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                >
                  <Input
                    placeholder="Abcd"
                    size="large"
                    className="rounded-full"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium">Giới tính</span>}
                  name="gender"
                  rules={[
                    { required: true, message: 'Vui lòng chọn giới tính!' },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="male">Nam</Radio>
                    <Radio value="female">Nữ</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium">Số điện thoại</span>}
                  name="phoneNumber"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  ]}
                >
                  <Input
                    placeholder="Hãy nhập số điện thoại!"
                    size="large"
                    className="rounded-full"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium">Ngày sinh</span>}
                  name="dob"
                  rules={[
                    { required: true, message: 'Vui lòng chọn ngày sinh!' },
                  ]}
                >
                  <DatePicker
                    placeholder="Chọn ngày sinh"
                    size="large"
                    className="w-full rounded-full"
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
                className="rounded-full bg-pink-600 text-white hover:!bg-pink-500"
              >
                Đăng Ký
              </Button>
            </Form.Item>
          </Form>
          <div className="mt-4 text-center text-xs">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <Link
                to="/login"
                className="font-semibold text-pink-600 underline"
              >
                Đăng Nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
