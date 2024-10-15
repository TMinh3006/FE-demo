// src/components/OrderList.tsx
import React, { useEffect, useState } from 'react';
import { Card, List, Avatar, Steps, Button } from 'antd';
import { IOrder } from '@/Apis/OrderList/OrderList.interface';
import OrderApi from '@/Apis/OrderList/OrderList.api';
import { Link } from 'react-router-dom';

const { Step } = Steps;

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const getOrders = async () => {
    try {
      const userId = localStorage.getItem('id');
      if (userId === null) return;

      const response = await OrderApi.getOrdersByUserId(userId);
      console.log(response);
      setOrders(response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const getStatusByStep = (step: number) => {
    switch (step) {
      case 1:
        return 'processing';
      case 2:
        return 'shipped';
      case 3:
        return 'delivered';
      case 4:
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  // Lấy danh sách đơn hàng để hiển thị
  const displayedOrders = showAll ? orders : orders.slice(0, 1);

  const filteredOrders =
    currentStep === 0
      ? displayedOrders // Tất cả
      : displayedOrders.filter(
          (order) => order.status === getStatusByStep(currentStep)
        );

  return (
    <Card title="Đơn Hàng Của Tôi">
      <Steps
        current={currentStep}
        onChange={setCurrentStep}
        style={{ marginBottom: 20 }}
      >
        <Step title="pending" onClick={() => setCurrentStep(0)} />
        <Step title="processing" onClick={() => setCurrentStep(1)} />
        <Step title="shipped" onClick={() => setCurrentStep(2)} />
        <Step title="delivered" onClick={() => setCurrentStep(3)} />
        <Step title="cancelled" onClick={() => setCurrentStep(4)} />
      </Steps>
      <List
        itemLayout="vertical"
        dataSource={filteredOrders}
        renderItem={(order) => (
          <List.Item
            style={{
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              marginBottom: '20px',
              padding: '15px',
              background: '#fafafa',
            }}
          >
            <List.Item.Meta
              title={
                <Link to={`/order/${order.id}`}>
                  <span style={{ fontWeight: 'bold' }}>
                    Đơn hàng #{order.id}
                  </span>
                </Link>
              }
              description={`Ngày đặt: ${new Date(order.orderDate).toLocaleDateString()} - Trạng thái: ${order.status}`}
            />
            <List
              itemLayout="horizontal"
              dataSource={order.orderDetails}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.product.thumbnails[0]} />}
                    title={
                      <a
                        href={`/ProductDetail/${item.product.id}`}
                        style={{ color: '#F25EA3', fontWeight: 'bold' }}
                      >
                        {item.product.name}
                      </a>
                    }
                    description={`Giá: ${item.price.toLocaleString()}đ - Số lượng: ${item.numberOfProducts}`}
                  />
                </List.Item>
              )}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 10,
                width: '100%',
              }}
            >
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '16px',
                  marginRight: '10px',
                }}
              >
                Tổng tiền:
              </div>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: '#ff4d4f',
                }}
              >
                {order.totalMoney.toLocaleString()}đ
              </div>
            </div>
          </List.Item>
        )}
      />
      {/* Nút xem tất cả đơn hàng */}
      {!showAll && orders.length > 3 && (
        <Button
          type="link"
          style={{
            marginTop: '20px',
            color: '#1890ff',
            fontWeight: 'bold',
            textAlign: 'center',
            display: 'block',
            textDecoration: 'underline',
          }}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Rút gọn' : 'Xem tất cả...'}
        </Button>
      )}
    </Card>
  );
};

export default OrderList;
