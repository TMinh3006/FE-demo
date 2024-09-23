import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Radio,
  Select,
  Button,
  Card,
  Divider,
  Row,
  Col,
  List,
} from 'antd';
import { useParams } from 'react-router-dom';
import orderApi from '@/Apis/Order/Order.Api';
import { OrderProduct, IOrder, Product } from '@/Apis/Order/Order.Interface';
import Title from 'antd/es/typography/Title';

const { Option } = Select;

const CheckoutPage = () => {
  const { id } = useParams<string>();
  const [form] = Form.useForm();
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [orderData, setOrderData] = useState<IOrder | null>(null);

  const getOrderDetails = async () => {
    if (id) {
      try {
        const response: OrderProduct = await orderApi.getOrderById(id);
        if (response.length > 0) {
          setCartItems(response.map((orderDetail) => orderDetail.product));
          setOrderData(response[0].order); // Lấy thông tin đơn hàng từ phần tử đầu tiên
        } else {
          setCartItems([]);
          setOrderData(null);
        }
      } catch (error) {
        console.error('Error: ', error);
      }
    }
  };

  useEffect(() => {
    getOrderDetails();
  }, [id]);

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  const totalPrice = order.order_details.reduce(
    (total, item) => total + item.totalMoney,
    0
  );

  const handleSubmit = () => {
    console.log('Submitting order');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto max-w-6xl">
        <Title level={2} style={{ fontSize: '36px' }}>
          Thanh Toán
        </Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item label="Họ và tên" name="fullname">
                <Input />
              </Form.Item>

              <Form.Item label="Email" name="email">
                <Input />
              </Form.Item>

              <Form.Item label="Số điện thoại" name="phone_number">
                <Input />
              </Form.Item>

              <Form.Item label="Địa chỉ giao hàng" name="shipping_address">
                <Input />
              </Form.Item>

              <Form.Item label="Phương thức giao hàng" name="shipping_method">
                <Select placeholder="Chọn phương thức giao hàng">
                  <Option value="express">Giao hàng Express</Option>
                  <Option value="fast">Giao hàng nhanh</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Phương thức thanh toán" name="payment_method">
                <Select placeholder="Chọn phương thức thanh toán">
                  <Option value="cod">COD</Option>
                  <Option value="other">Phương thức khác</Option>
                </Select>
              </Form.Item>
            </Form>
          </Col>

          <Col span={12}>
            <Card title="Đơn Hàng Của Bạn" className="mt-4 rounded shadow">
              <List
                itemLayout="horizontal"
                dataSource={order.order_details}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <span style={{ fontSize: '18px' }}>
                          {item.product.name}
                        </span>
                      }
                      description={`Đơn giá: ${item.price.toLocaleString()}₫ - Số lượng: ${item.numberOfProducts}`}
                    />
                  </List.Item>
                )}
              />
              <div className="mt-4 flex justify-between">
                <span>Tổng sản phẩm đã chọn</span>
                <span>{order.order_details.length}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>Tạm tính</span>
                <span>{totalPrice.toLocaleString()}₫</span>
              </div>
              <div className="mt-4 flex justify-between font-bold">
                <span>Tổng thanh toán</span>
                <span className="text-red-500">
                  {totalPrice.toLocaleString()}₫
                </span>
              </div>

              {/* Nút Đặt hàng nằm giữa */}
            </Card>
            <Row justify="center" className="mt-4">
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '200px' }}
                onClick={handleSubmit}
              >
                Đặt hàng
              </Button>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CheckoutPage;
