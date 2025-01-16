import React, { useEffect, useState } from 'react';
import { Card, List, Avatar, Steps, Button, Spin } from 'antd';
import {
  IOrder,
  IOrderDetail,
  IOrderListResponse,
} from '@/Apis/OrderList/OrderList.interface';
import OrderApi from '@/Apis/OrderList/OrderList.api';
import { Link } from 'react-router-dom';
import ProductApi from '@/Apis/Product/Product.api';
import { IProductDetail } from '@/Apis/Product/Product.interface';

const { Step } = Steps;

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);

  const getOrders = async () => {
    setLoadingOrders(true);
    try {
      const userId = localStorage.getItem('userId');
      if (userId === null) return;

      const orderResponse: IOrderListResponse =
        await OrderApi.getOrdersByUserId(userId);
      console.log('Order response:', orderResponse);

      const ordersArray = orderResponse.result || [];

      const enrichedOrders = await Promise.all(
        ordersArray
          .sort(
            (a, b) =>
              new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          )
          .map(async (order) => {
            const orderDetailResponse = await OrderApi.getOrderDetailById(
              order.id
            );
            const orderDetailsArray = orderDetailResponse.result || [];

            const enrichedDetails = await Promise.all(
              orderDetailsArray.map(async (detail) => {
                try {
                  const product = await ProductApi.getById(detail.productId);
                  return { ...detail, product: product.result };
                } catch (error) {
                  console.error(
                    `Error fetching product ${detail.productId}:`,
                    error
                  );
                  return detail;
                }
              })
            );

            return { ...order, orderDetailId: enrichedDetails };
          })
      );

      setOrders(enrichedOrders);

      setFilteredOrders(
        enrichedOrders.filter(
          (order) => order.status === getStatusByStep(currentStep)
        )
      );
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, [currentStep]);

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

  return (
    <Card title="Đơn Hàng Của Tôi">
      <Steps
        current={currentStep}
        onChange={setCurrentStep}
        style={{ marginBottom: 20 }}
      >
        <Step title="Đang chờ" onClick={() => setCurrentStep(0)} />
        <Step title="Đang xử lý" onClick={() => setCurrentStep(1)} />
        <Step title="Đang giao" onClick={() => setCurrentStep(2)} />
        <Step title="Đã nhận" onClick={() => setCurrentStep(3)} />
        <Step title="Đã hủy" onClick={() => setCurrentStep(4)} />
      </Steps>

      {loadingOrders ? (
        <Spin size="large" />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={showAll ? filteredOrders : filteredOrders.slice(0, 3)}
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
                description={`Ngày đặt: ${new Date(order.orderDate).toLocaleDateString()} - Trạng thái: ${
                  order.status === 'pending'
                    ? 'Đang chờ'
                    : order.status === 'processing'
                      ? 'Đang xử lý'
                      : order.status === 'shipped'
                        ? 'Đang giao'
                        : order.status === 'delivered'
                          ? 'Đã nhận'
                          : order.status === 'cancelled'
                            ? 'Đã hủy'
                            : order.status
                }`}
              />
              <List
                itemLayout="horizontal"
                dataSource={order.orderDetailId || []}
                renderItem={(
                  detail: IOrderDetail & { product?: IProductDetail }
                ) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={detail.product?.thumbnails?.[0]} />}
                      title={detail.product?.name || 'Sản phẩm không xác định'}
                      description={`Số lượng: ${detail.quantity} - Giá: ${detail.newPrice ? detail.newPrice.toLocaleString() : detail.price.toLocaleString()}đ`}
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
      )}

      {/* Nút xem tất cả đơn hàng */}
      {filteredOrders.length > 3 && (
        <Button
          type="link"
          style={{
            marginTop: '20px',
            fontSize: '20px',
            color: '#189',
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
