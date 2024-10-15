import React from 'react';
import { Layout, Typography, Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Content } = Layout;

const OrderSuccessPage: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#F9E1E0' }}>
      <Content style={{ padding: '50px' }}>
        <Result
          status="success"
          title={<Title level={2}>Đặt Hàng Thành Công!</Title>}
          subTitle={
            <Text style={{ fontSize: '18px' }}>
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý!
            </Text>
          }
          extra={[
            <Link to="/orders" key="orders">
              <Button type="primary" size="large">
                Xem Đơn Hàng Của Tôi
              </Button>
            </Link>,
          ]}
        />
      </Content>
    </Layout>
  );
};

export default OrderSuccessPage;
