import React, { useEffect, useState } from 'react';
import { Card, Descriptions, List, Avatar, Divider } from 'antd';

import { Order } from '@/Apis/OrderList/OrderList.interface';
import OrderApi from '@/Apis/OrderList/OrderList.api';
import { useParams } from 'react-router-dom';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  const getOrderDetail = async () => {
    try {
      const userId = localStorage.getItem('id');
      if (userId === null) return;
      if (!id) return;
      const response = await OrderApi.getOrderById(id);
      console.log('API dt:', response);
      setOrder(response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getOrderDetail();
  }, [id]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <Card title={`Chi Tiết Đơn Hàng #${order.id}`} style={{ margin: '20px' }}>
      {/* Thông tin người đặt hàng */}
      <Descriptions title="Thông Tin Người Đặt Hàng" bordered>
        <Descriptions.Item label="Họ và Tên">
          {order.fullname}
        </Descriptions.Item>
        <Descriptions.Item label="Số Điện Thoại">
          {order.phone_number}
        </Descriptions.Item>
        <Descriptions.Item label="Email">{order.email}</Descriptions.Item>
        <Descriptions.Item label="Địa Chỉ">{order.address}</Descriptions.Item>
        <Descriptions.Item label="Ghi Chú">
          {order.note || 'Không có'}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      {/* Thông tin đơn hàng */}
      <Descriptions title="Thông Tin Đơn Hàng" bordered>
        <Descriptions.Item label="Ngày Đặt">
          {new Date(order.order_date).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Phương Thức Giao Hàng">
          {order.shipping_method}
        </Descriptions.Item>
        <Descriptions.Item label="Địa Chỉ Giao Hàng">
          {order.shipping_address}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày Giao Dự Kiến">
          {new Date(order.order_date).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng Thái Đơn Hàng">
          {order.status}
        </Descriptions.Item>
        <Descriptions.Item label="Phương Thức Thanh Toán">
          {order.shipping_method}
        </Descriptions.Item>
        <Descriptions.Item label="Số Tiền">
          {order.total_money ? order.total_money.toLocaleString() : '0đ'}đ
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      {/* Chi tiết sản phẩm trong đơn hàng */}
      <List
        header={<div>Chi Tiết Sản Phẩm</div>}
        itemLayout="horizontal"
        dataSource={order.order_details}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.product.thumbnails[0]} />}
              title={
                <a href={`/ProductDetail/${item.product.id}`}>
                  {item.product.name}
                </a>
              }
              description={`Giá: ${item.price ? item.price.toLocaleString() : '0đ'}đ - Số lượng: ${item.numberOfProducts}`}
            />
            <div style={{ fontWeight: 'bold' }}>
              Thành Tiền:{' '}
              {item.totalMoney ? item.totalMoney.toLocaleString() : '0đ'}đ
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default OrderDetail;
