// src/components/UserInfo.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Form,
  Input,
  DatePicker,
  message,
  Col,
  Row,
} from 'antd';
import userService from '@/Apis/Auth/Auth.api';
import { IUser } from '@/Apis/Auth/Auth.interface';
import moment from 'moment';
import {
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const UserInfo: React.FC = () => {
  const [user, setUser] = useState<IUser['result'] | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form] = Form.useForm();

  const getUser = useCallback(async () => {
    try {
      const id = localStorage.getItem('userId');
      if (id === null) return;
      const response = await userService.getUserById(id);
      setUser(response.result);

      form.setFieldsValue({
        fullname: response.result.name,
        email: response.result.email,
        phoneNumber: response.result.phoneNumber,
        date_of_birth: moment(response.result.dob),
        gender: response.result.gender,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [form]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleSave = async () => {
    try {
      const id = localStorage.getItem('userId');
      if (!id) {
        console.error('Không tìm thấy id người dùng.');
        return;
      }

      const values = await form.validateFields();

      const updatedUser = {
        name: values.fullname,
        email: values.email,
        phoneNumber: values.phoneNumber,
        dob: values.date_of_birth
          ? values.date_of_birth.format('YYYY-MM-DD')
          : null,
      };

      const response = await userService.updateUserById(id, updatedUser);

      setUser(response.result);
      setIsEditing(false);
      message.success('Thông tin đã được cập nhật!');
    } catch (error) {
      console.error('Validation Failed or API Error:', error);
      message.error('Cập nhật thông tin thất bại.');
    }
  };
  if (!user) return <p>Loading...</p>;

  return (
    <Card title="Thông Tin Cá Nhân">
      {isEditing ? (
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Họ Tên"
                name="fullname"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Ngày Sinh"
                name="date_of_birth"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày sinh!' },
                ]}
              >
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col
              span={12}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                marginTop: '40px',
              }}
            >
              <Button
                type="primary"
                onClick={handleSave}
                style={{
                  marginBottom: '10px',
                  marginRight: '20px',
                  padding: '20px',
                }}
              >
                Lưu
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                style={{
                  marginBottom: '10px',

                  padding: '20px',
                }}
              >
                Hủy
              </Button>
            </Col>
          </Row>
        </Form>
      ) : (
        <Row gutter={16}>
          <Col span={12}>
            <Card style={{ marginBottom: '16px' }}>
              <Text strong>
                <UserOutlined style={{ marginRight: '8px' }} />
                Họ và Tên: {user?.name}
              </Text>
            </Card>
            <Card style={{ marginBottom: '16px' }}>
              <Text strong>
                <CalendarOutlined style={{ marginRight: '8px' }} />
                Ngày Sinh: {new Date(user?.dob).toLocaleDateString()}
              </Text>
            </Card>
            <Card style={{ marginBottom: '16px' }}>
              <Text strong>
                <MailOutlined style={{ marginRight: '8px' }} />
                Email: {user?.email}
              </Text>
            </Card>
            <Card style={{ marginBottom: '16px' }}>
              <Text strong>
                <TeamOutlined style={{ marginRight: '8px' }} />
                Giới tính: {user?.gender}
              </Text>
            </Card>
            <Card style={{ marginBottom: '16px' }}>
              <Text strong>
                <PhoneOutlined style={{ marginRight: '8px' }} />
                Số điện thoại: {user?.phoneNumber}
              </Text>
            </Card>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              marginTop: '40px',
            }}
          >
            <Button type="primary" onClick={() => setIsEditing(true)}>
              Chỉnh Sửa
            </Button>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default UserInfo;
