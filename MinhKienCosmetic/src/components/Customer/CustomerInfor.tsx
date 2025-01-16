// src/components/CustomerInfo.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Card, Layout, Menu, Typography } from 'antd';
import UserInfo from './UserInfo';
import OrderList from './OrderList';
import { IUser } from '@/Apis/Auth/Auth.interface';
import userService from '@/Apis/Auth/Auth.api';

import { UserOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Title } = Typography;

const CustomerInfo: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [activeMenu, setActiveMenu] = useState<string>('personalInfo');

  const getUser = useCallback(async () => {
    try {
      const id = localStorage.getItem('userId');
      if (id === null) return;
      const response = await userService.getUserById(id);
      setUser(response);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất?');

    if (confirmLogout) {
      localStorage.removeItem('fullName');
      localStorage.removeItem('id');
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
  };

  return (
    <Layout
      style={{
        minHeight: '50vh',
        background: '#F9E1E0',
        padding: '3rem',
        paddingTop: '20px',
      }}
    >
      <Sider
        width={300}
        style={{
          background: '#FF6F91',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Avatar size={64} icon={<UserOutlined />} />
          <Title
            level={3}
            style={{ color: '#fff', margin: '10px 0', fontSize: '24px' }}
          >
            {user?.result.name}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeMenu]}
          style={{
            background: 'transparent',
            color: '#fff',
          }}
        >
          <Menu.Item
            key="personalInfo"
            onClick={() => handleMenuClick('personalInfo')}
            style={{
              color: activeMenu === 'personalInfo' ? '#F9E1E0' : '#fff',
              background:
                activeMenu === 'personalInfo' ? '#D53A67' : 'transparent',
              borderRadius: '4px',
              fontSize: '18px',
            }}
          >
            Thông Tin Cá Nhân
          </Menu.Item>
          <Menu.Item
            key="orders"
            onClick={() => handleMenuClick('orders')}
            style={{
              color: activeMenu === 'orders' ? '#F9E1E0' : '#fff',
              background: activeMenu === 'orders' ? '#D53A67' : 'transparent',
              borderRadius: '4px',
              fontSize: '18px',
            }}
          >
            Đơn Hàng Của Tôi
          </Menu.Item>
          <Menu.Item
            key="logout"
            onClick={handleLogout}
            style={{ color: '#fff', fontSize: '18px' }}
          >
            Đăng Xuất
          </Menu.Item>
        </Menu>
      </Sider>

      <Content style={{ marginLeft: '20px' }}>
        <Card
          style={{
            borderRadius: '8px',
            padding: '20px 0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          }}
        >
          {activeMenu === 'personalInfo' ? <UserInfo /> : <OrderList />}
        </Card>
      </Content>
    </Layout>
  );
};

export default CustomerInfo;
