// src/components/UserInfo.tsx
import React, { useEffect, useState } from 'react';
import {
  Layout,
  Menu,
  Card,
  Typography,
  Divider,
  Button,
  Steps,
  List,
  Form,
  Input,
  DatePicker,
  message,
  Avatar,
} from 'antd';

import userService from '@/Apis/Auth/Auth.api';
import userUpdate from '@/Apis/Auth/Auth.api';
import { User } from '@/Apis/Auth/Auth.interface';
import moment from 'moment';

const { Text } = Typography;
const { Step } = Steps;
const { Sider, Content } = Layout;

const CustomerInfo: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [activeMenu, setActiveMenu] = useState<string>('personalInfo');

  const getUser = async () => {
    try {
      const id = localStorage.getItem('id');
      if (id === null) return;
      const response = await userService.getUserById(id);
      setUser(response);

      form.setFieldsValue({
        fullName: response.fullName,
        phoneNumber: response.phoneNumber,
        address: response.address,
        dateOfBirth: moment(response.dateOfBirth),
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    getUser();
  }, [form]);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất?');

    if (confirmLogout) {
      localStorage.removeItem('fullName');
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
  };
  const handleSave = async () => {
    try {
      const id = localStorage.getItem('id');
      if (!id) {
        console.error('Không tìm thấy id người dùng.');
        return;
      }

      const values = await form.validateFields();

      const response = await userUpdate.updateUserById(id, {
        fullname: values.fullname,
        phone_number: values.phone_number,
        address: values.address,
        date_of_birth: values.date_of_birth.format('YYYY-MM-DD'),
      });

      setUser(response);
      setIsEditing(false);

      message.success('Thông tin đã được cập nhật!');
    } catch (error) {
      console.log('Validation Failed or API Error:', error);
      message.error('Cập nhật thông tin thất bại.');
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <Layout style={{ minHeight: '100vh', background: '#F9E1E0' }}>
      <Sider
        width={350}
        style={{
          background: '#F9E1E0',
          marginLeft: '200px',
          marginTop: '30px',
          fontSize: '25px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '20px 0',
          }}
        >
          <Avatar size={64} />
          <div style={{ marginTop: 2 }}>{user?.fullName}</div>
        </div>
        <Divider />
        <Menu
          mode="inline"
          selectedKeys={[activeMenu]}
          style={{
            background: '#F9E1E0',
            borderRight: 'none',
            fontSize: '20px',
          }}
        >
          <Menu.Item
            key="personalInfo"
            onClick={() => handleMenuClick('personalInfo')}
          >
            Thông Tin Cá Nhân
          </Menu.Item>
          <Menu.Item key="orders" onClick={() => handleMenuClick('orders')}>
            Đơn Hàng Của Tôi
          </Menu.Item>
          <Menu.Item key="logout" onClick={handleLogout}>
            Đăng Xuất
          </Menu.Item>
        </Menu>
      </Sider>

      <Content style={{ margin: '16px 16px 0', overflow: 'initial' }}>
        {activeMenu === 'personalInfo' ? (
          <Card
            title="Thông Tin Cá Nhân"
            style={{ width: '90%', margin: '40px auto', marginRight: '200px' }}
          >
            {isEditing ? (
              <Form form={form} layout="vertical">
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
                  label="Số Điện Thoại"
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập số điện thoại!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Địa Chỉ"
                  name="address"
                  rules={[
                    { required: true, message: 'Vui lòng nhập địa chỉ!' },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Button type="primary" onClick={handleSave}>
                  Lưu
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  style={{ marginLeft: 10 }}
                >
                  Hủy
                </Button>
              </Form>
            ) : (
              <>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <Text
                    style={{
                      minWidth: 150,
                      marginLeft: '300px',
                    }}
                  >
                    Họ và Tên:
                    <span
                      style={{
                        fontWeight: 'bold',
                        border: 'none',
                        padding: '20px',
                        borderRadius: 3,
                        marginLeft: 10,
                        fontSize: '20px',
                      }}
                    >
                      {user?.fullName}
                    </span>
                  </Text>
                  <Text
                    style={{
                      minWidth: 150,
                      marginLeft: '300px',
                    }}
                  >
                    Ngày Sinh:
                    <span
                      style={{
                        fontWeight: 'bold',
                        border: 'none',
                        padding: '20px',
                        borderRadius: 3,
                        marginLeft: 10,
                        fontSize: '20px',
                      }}
                    >
                      {new Date(user?.dateOfBirth).toLocaleDateString()}
                    </span>
                  </Text>
                  <Text
                    style={{
                      minWidth: 150,
                      marginLeft: '300px',
                    }}
                  >
                    Số Điện Thoại:
                    <span
                      style={{
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: 3,
                        marginLeft: 8,
                        fontSize: '20px',
                      }}
                    >
                      {user?.phoneNumber}
                    </span>
                  </Text>
                  <Text
                    style={{
                      minWidth: 150,
                      marginLeft: '300px',
                    }}
                  >
                    Địa Chỉ:
                    <span
                      style={{
                        fontWeight: 'bold',

                        border: 'none',
                        padding: '20px',
                        borderRadius: 3,
                        marginLeft: 10,
                        fontSize: '20px',
                      }}
                    >
                      {user?.address}
                    </span>
                  </Text>
                </div>

                <Button
                  type="primary"
                  onClick={() => setIsEditing(true)}
                  style={{ marginTop: 20, marginLeft: '500px' }}
                >
                  Chỉnh Sửa
                </Button>
              </>
            )}
          </Card>
        ) : (
          <Card
            title="Đơn Hàng Của Tôi"
            style={{ width: '90%', margin: '40px auto', marginRight: '200px' }}
          >
            <Steps current={1} style={{ marginBottom: 20 }}>
              <Step title="Tất Cả" />
              <Step title="Đang Xử Lý" />
              <Step title="Đang Giao" />
              <Step title="Đã Giao" />
              <Step title="Đã Hủy" />
            </Steps>
            <List
              itemLayout="horizontal"
              dataSource={[]} // Thay bằng danh sách đơn hàng của bạn
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.productThumbnail} />} // Hiển thị ảnh sản phẩm
                    title={<a href={item.productLink}>{item.productName}</a>} // Tên sản phẩm
                    description={`Giá: ${item.price} - Số lượng: ${item.quantity}`} // Giá và số lượng
                  />
                  <div>{item.status}</div> {/* Hiển thị trạng thái đơn hàng */}
                </List.Item>
              )}
            />
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default CustomerInfo;
