import { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  List,
  message,
  DatePicker,
} from 'antd';
import orderApi from '@/Apis/Order/Order.api';
import { IOrder } from '@/Apis/Order/Order.interface';
import Title from 'antd/es/typography/Title';
import cartApi from '@/Apis/Cart/Cart.api';
import { ICartItem } from '@/Apis/Cart/Cart.interface';
import { Link } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;

const CheckoutPage = () => {
  const [form] = Form.useForm();
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const id = localStorage.getItem('id');
        if (id === null) {
          message.error('Vui lòng đăng nhập để tiếp tục.');
          return;
        }

        const response = await cartApi.getCartById(id);
        setCartItems(response);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        message.error('Không thể tải giỏ hàng.');
      }
    };

    fetchCartItems();
  }, []);

  const handleSubmit = async (values: IOrder) => {
    const id = localStorage.getItem('id');
    if (id === null) {
      message.error('Vui lòng đăng nhập để tiếp tục.');
      return;
    }

    try {
      const orderData: IOrder = {
        ...values,
        cart_items: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.price, // Bao gồm price ở đây
        })),
        total_money: totalPrice, // Sử dụng tổng tiền đã tính
        user_id: parseInt(id),
        shipping_date: moment(values.shipping_date).format('YYYY-MM-DD'),
      };

      await orderApi.createOrder(orderData);
      await cartApi.clearCart(id);
      message.success('Đặt hàng thành công!');
    } catch (error) {
      console.error('Error submitting order:', error);
      message.error('Đặt hàng thất bại, vui lòng thử lại.');
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto max-w-6xl">
        <Title level={2} style={{ fontSize: '36px', fontWeight: 'bold' }}>
          Thanh Toán
        </Title>
        <Row gutter={20}>
          <Col span={12}>
            <Form layout="vertical" onFinish={handleSubmit} form={form}>
              <Form.Item label="Họ và tên" name="fullname">
                <Input style={{ fontSize: '16px' }} />
              </Form.Item>

              <Form.Item label="Email" name="email">
                <Input style={{ fontSize: '16px' }} />
              </Form.Item>

              <Form.Item label="Số điện thoại" name="phone_number">
                <Input style={{ fontSize: '16px' }} />
              </Form.Item>

              <Form.Item label="Địa chỉ giao hàng" name="shipping_address">
                <Input style={{ fontSize: '16px' }} />
              </Form.Item>

              <Form.Item label="Địa chỉ nhận hàng" name="address">
                <Input style={{ fontSize: '16px' }} />
              </Form.Item>

              <Form.Item label="Phương thức giao hàng" name="shipping_method">
                <Select
                  placeholder="Chọn phương thức giao hàng"
                  style={{ fontSize: '16px' }}
                >
                  <Option value="express">Giao hàng Express</Option>
                  <Option value="fast">Giao hàng nhanh</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Phương thức thanh toán" name="payment_method">
                <Select
                  placeholder="Chọn phương thức thanh toán"
                  style={{ fontSize: '16px' }}
                >
                  <Option value="cod">COD</Option>
                  <Option value="other">Phương thức khác</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Ngày giao hàng"
                name="shipping_date"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày sinh!' },
                ]}
              >
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
            </Form>
          </Col>

          <Col span={12}>
            <Card title="Đơn Hàng Của Bạn" className="mt-4 rounded shadow">
              <List
                itemLayout="horizontal"
                dataSource={cartItems}
                renderItem={(item) => (
                  <List.Item>
                    <img
                      className="h-16 w-16 object-cover"
                      src={item.product.thumbnails[0]}
                    />
                    <List.Item.Meta
                      title={
                        <span
                          style={{
                            fontSize: '20px',

                            fontWeight: 'bold',
                          }}
                        >
                          {item.product.name}
                        </span>
                      }
                      description={`Đơn giá: ${item.price.toLocaleString()}₫ - Số lượng: ${item.quantity}`}
                    />
                  </List.Item>
                )}
              />
              <div
                className="mt-4 flex justify-between"
                style={{ fontSize: '18px' }}
              >
                <span>Tổng sản phẩm đã chọn</span>
                <span>{cartItems.length}</span>
              </div>
              <div
                className="mt-2 flex justify-between"
                style={{ fontSize: '18px' }}
              >
                <span>Tạm tính</span>
                <span>{totalPrice.toLocaleString()}₫</span>
              </div>
              <div
                className="mt-4 flex justify-between font-bold"
                style={{ fontSize: '20px' }}
              >
                <span>Tổng thanh toán</span>
                <span className="text-red-500">
                  {totalPrice.toLocaleString()}₫
                </span>
              </div>
            </Card>
            <Row justify="center" className="mt-4">
              <Link to="/SuccessPage">
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: '200px', fontSize: '18px' }}
                  onClick={() => form.submit()}
                >
                  Đặt hàng
                </Button>
              </Link>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CheckoutPage;
