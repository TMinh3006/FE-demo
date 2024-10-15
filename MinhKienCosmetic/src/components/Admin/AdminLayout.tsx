import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  AppstoreOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Logo from '@/assets/logo1.png';
import React from 'react';

const { Header, Content, Sider } = Layout;

const AdminLayout: React.FC = () => {
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('role');
  const navigate = useNavigate();

  if (!token || userRole !== '1') {
    window.location.href = '/admin';
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    navigate('/Login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible style={{ backgroundColor: '#FF69B4' }}>
        {' '}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            color: 'white',
          }}
        >
          <Link to="/">
            <img alt="logo" src={Logo} className="h-10 w-10 cursor-pointer" />
          </Link>
          <div className="logo" style={{ marginTop: '10px' }}>
            Admin
          </div>
        </div>
        <Menu
          theme="light"
          mode="inline"
          style={{ backgroundColor: '#FF69B4' }}
        >
          {' '}
          {/* Màu hồng cho Menu */}
          <Menu.Item key="1" icon={<AppstoreOutlined />}>
            <Link to="/admin/products">Quản lý sản phẩm</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<TagsOutlined />}>
            <Link to="/admin/categories">Quản lý danh mục</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            <Link to="/admin/users">Quản lý người dùng</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<ShoppingCartOutlined />}>
            <Link to="/admin/orders">Quản lý đơn hàng</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 20px',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '30px', fontWeight: 'bold' }}>
            Quản lý Admin
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-2xl px-4 font-bold text-pink-500 hover:text-red-500"
            >
              <LogoutOutlined />
              Đăng xuất
            </button>
          </div>
        </Header>
        <Content style={{ margin: ' 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#FDBCCF' }}>
            <Outlet />
            {''}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
