import React, { useEffect, useState } from 'react';
import { Card, Descriptions, List, Avatar, Divider } from 'antd';

import {
  IOrderDetail,
  IOrderResponse,
} from '@/Apis/OrderList/OrderList.interface';
import OrderApi from '@/Apis/OrderList/OrderList.api';
import { useParams } from 'react-router-dom';
import { IProductDetail } from '@/Apis/Product/Product.interface';
import ProductApi from '@/Apis/Product/Product.api';

export interface IProductDetailWithTotalMoney extends IProductDetail {
  totalMoney: number;
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<IOrderResponse | null>(null);
  const [products, setProducts] = useState<IProductDetailWithTotalMoney[]>([]);

  const getOrderDetail = async (id: string) => {
    try {
      const response = await OrderApi.getOrderById(id);
      setOrder(response);

      const orderDetailsResponse = await OrderApi.getOrderDetailById(id);

      const productDetails = await Promise.all(
        orderDetailsResponse.result.map(async (orderDetail: IOrderDetail) => {
          const productResponse = await ProductApi.getById(
            orderDetail.productId
          );
          return {
            ...productResponse.result,
            quantity: orderDetail.quantity,
            totalMoney: orderDetail.quantity * productResponse.result.price,
          };
        })
      );

      const totalProductMoney = productDetails.reduce(
        (total, product) => total + product.totalMoney,
        0
      );
      const fee = totalProductMoney < 300000 ? response.result.fee : 0;
      const totalMoneyWithShipping = totalProductMoney + fee;

      if (response.result) {
        const updatedOrder = {
          ...response,
          result: {
            ...response.result,
            totalMoney: totalMoneyWithShipping,
          },
        };
        setOrder(updatedOrder);
      }

      setProducts(productDetails);
    } catch (e) {
      console.error('Error fetching order detail:', e);
    }
  };

  useEffect(() => {
    if (id) {
      getOrderDetail(id);
    }
  }, [id]);

  if (!order || products.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Card
      title={`Chi Tiết Đơn Hàng #${order.result.id}`}
      style={{ margin: '20px' }}
    >
      {/* Thông tin người đặt hàng */}
      <Descriptions title="Thông Tin Người Đặt Hàng" bordered>
        <Descriptions.Item label="Họ và Tên">
          {order.result.name}
        </Descriptions.Item>
        <Descriptions.Item label="Số Điện Thoại">
          {order.result.phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {order.result.email}
        </Descriptions.Item>
        <Descriptions.Item label="Địa Chỉ">
          {order.result.address}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi Chú">
          {order.result.note || 'Không có'}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      {/* Thông tin đơn hàng */}
      <Descriptions title="Thông Tin Đơn Hàng" bordered>
        <Descriptions.Item label="Ngày Đặt">
          {order.result.orderDate
            ? new Date(order.result.orderDate).toLocaleDateString()
            : 'Không xác định'}
        </Descriptions.Item>
        <Descriptions.Item label="Phương Thức Giao Hàng">
          {order.result.paymentMethod}
        </Descriptions.Item>
        <Descriptions.Item label="Địa Chỉ Giao Hàng">
          {order.result.address}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày Giao Dự Kiến">
          {order.result.shippingDate
            ? new Date(order.result.shippingDate).toLocaleDateString()
            : 'Không xác định'}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng Thái Đơn Hàng">
          {order.result.status === 'pending'
            ? 'Đang chờ'
            : order.result.status === 'processing'
              ? 'Đang xử lý'
              : order.result.status === 'shipped'
                ? 'Đang giao'
                : order.result.status === 'delivered'
                  ? 'Đã nhận'
                  : order.result.status === 'cancelled'
                    ? 'Đã hủy'
                    : order.result.status}
        </Descriptions.Item>
        <Descriptions.Item label="Phương Thức Thanh Toán">
          {order.result.shippingMethod}
        </Descriptions.Item>
        <Descriptions.Item label="Phí vận chuyển">
          {order.result.fee.toLocaleString()}₫
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      {/* Chi tiết sản phẩm trong đơn hàng */}
      <List
        header={
          <div className="text-[17px] font-semibold">Chi Tiết Sản Phẩm</div>
        }
        itemLayout="horizontal"
        dataSource={products}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.thumbnails?.[0]} />}
              title={<a href={`/ProductDetail/${item.id}`}>{item.name}</a>}
              description={`Giá: ${item.newPrice ? item.newPrice.toLocaleString() : item.price.toLocaleString()}đ - Số lượng: ${item.quantity}`}
            />

            <div>
              <span className="mr-2">Thành Tiền:</span>
              <span className="font-bold">
                {order?.result.totalMoney
                  ? order.result.totalMoney.toLocaleString()
                  : '0đ'}
                đ
              </span>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default OrderDetail;
