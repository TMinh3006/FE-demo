import { useEffect, useState } from 'react';
import imgVoucher from '@/assets/no voucher.png';
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
} from 'antd';
import orderApi from '@/Apis/Order/Order.api';
import ProductApi from '@/Apis/Product/Product.api';
import { ICreateOrderResponse, IOrder } from '@/Apis/Order/Order.interface';
import Title from 'antd/es/typography/Title';
import cartApi from '@/Apis/Cart/Cart.api';
import { ICartItem } from '@/Apis/Cart/Cart.Interface';
import { IProductDetail } from '@/Apis/Product/Product.interface';
import { useNavigate } from 'react-router-dom';
import AddressMap from './mapbox';

const { Option } = Select;

const CheckoutPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<
    (ICartItem & { product?: IProductDetail })[]
  >([]);

  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId === null) return;
      const cartData = await cartApi.getCartById(userId);

      if (!cartData || !cartData.result || !cartData.result.cartItemIds) {
        message.warning('Giỏ hàng của bạn đang trống.');
        setCartItems([]);
        return;
      }

      const cartItems = cartData.result.cartItemIds;

      const cartWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const productResponse = await ProductApi.getById(item.productId);
          console.log('Giỏ hàng của bạn:', cartItems);
          return {
            ...item,
            product: productResponse.result,
          };
        })
      );
      setCartItems(cartWithDetails);
    } catch (error) {
      console.error('error fetching cart:', error);
      message.error('Lỗi khi lấy dữ liệu giỏ hàng.');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);
  const handleSubmit = async (values: IOrder) => {
    const userId = localStorage.getItem('userId');
    if (userId === null) {
      message.error('Vui lòng đăng nhập để tiếp tục.');
      return;
    }
    setLoading(true);

    try {
      const shippingDate =
        values.shippingMethod === 'express'
          ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // Dự kiến 2 ngày
          : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(); // Dự kiến 5 ngày

      const orderData: IOrder = {
        ...values,
        userId,
        cartItemsIdRequest: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          newPrice: item.newPrice,
          discount: item.discount,
        })),
        totalMoney: totalPrice + shippingFee,
        address: selectedAddress,
        orderDate: new Date().toISOString(),
        shippingDate,
        note: values.note || '',
      };

      const response: ICreateOrderResponse =
        await orderApi.createOrder(orderData);
      if (response.code === 1000 && response.result) {
        const { paymentUrl, paymentMethod } = response.result;

        await cartApi.clearCart(userId);

        if (paymentMethod === 'MOMO') {
          const paymentData = JSON.parse(paymentUrl);
          const momoPaymentUrl = paymentData.payUrl;

          if (momoPaymentUrl) {
            window.location.href = momoPaymentUrl;
          }
        } else if (paymentMethod === 'VNPay') {
          const vnpayPaymentUrl = paymentUrl;

          if (vnpayPaymentUrl) {
            window.location.href = vnpayPaymentUrl;
          }
        } else {
          navigate('/SuccessPage');
        }
      } else {
        throw new Error('Lỗi trong quá trình tạo đơn hàng.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      message.error('Đặt hàng thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      item.quantity * (item.product?.newPrice || item.product?.price || 0),
    0
  );
  console.log('Tổng tiền:', totalPrice);

  const handleAddressSelect = async (
    address: string,
    coordinates: [number, number]
  ) => {
    setSelectedAddress(address);
    setSelectedCoordinates(coordinates);
    message.success(`Đã chọn địa chỉ:${address}`);
    await handleCalculateShippingFee(address, totalPrice);
  };

  const handleCalculateShippingFee = async (
    address: string,
    totalMoney: number
  ) => {
    if (!address) {
      message.warning('Vui lòng chọn địa chỉ giao hàng!');
      return;
    }
    setLoading(true);
    try {
      const shippingFeeResponse = await orderApi.getShippingFee(
        address,
        totalMoney
      );
      if (shippingFeeResponse.code === 1000 && shippingFeeResponse?.result) {
        setShippingFee(shippingFeeResponse.result);

        console.log('Phí vận chuyển:', shippingFeeResponse.result);
      } else {
        setShippingFee(0);
      }
    } catch (error) {
      console.error('Lỗi khi tính phí vận chuyển:', error);
      message.error('Có lỗi xảy ra, vui lòng thử lại.');
      setShippingFee(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-5">
      <div className="container mx-auto max-w-6xl">
        <Title level={2} style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Thanh Toán
        </Title>
        <Row gutter={20}>
          <Col span={12}>
            <Form layout="vertical" onFinish={handleSubmit} form={form}>
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên!' },
                ]}
              >
                <Input style={{ fontSize: '20px' }} />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input style={{ fontSize: '16px' }} />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: 'Số điện thoại không hợp lệ!',
                  },
                ]}
              >
                <Input style={{ fontSize: '16px' }} />
              </Form.Item>

              <Form.Item label="Ghi chú (tùy chọn)" name="note">
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập ghi chú nếu cần (VD: Giao hàng trong giờ hành chính)"
                  style={{ fontSize: '16px' }}
                />
              </Form.Item>

              <div className="mt-8">
                <h2 className="mb-4 font-semibold">Chọn địa chỉ giao hàng</h2>

                <AddressMap onAddressSelect={handleAddressSelect} />
                {selectedAddress && (
                  <p className="mt-4 text-gray-600">
                    <strong>Địa chỉ đã chọn:</strong> {selectedAddress}
                  </p>
                )}
              </div>

              <Form.Item
                label="Phương thức giao hàng"
                name="shippingMethod"
                style={{ marginTop: '16px' }}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn phương thức giao hàng!',
                  },
                ]}
              >
                <Select
                  placeholder="Chọn phương thức giao hàng"
                  style={{ fontSize: '16px' }}
                  onChange={(value) => {
                    const estimatedDate =
                      value === 'express'
                        ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // Express: 2 ngày
                        : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // Fast: 5 ngày
                    message.info(
                      `Dự kiến giao hàng: ${estimatedDate.toLocaleDateString('vi-VN')}`
                    );
                  }}
                >
                  <Option value="Express">
                    Giao hàng nhanh (dự kiến 2-3 ngày)
                  </Option>
                  <Option value="Fast">
                    Giao hàng Express (dự kiến 3-5 ngày)
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item label="Phương thức thanh toán" name="paymentMethod">
                <Select
                  placeholder="Chọn phương thức thanh toán"
                  style={{ fontSize: '16px' }}
                >
                  <Option value="COD">COD</Option>
                  <Option value="VNPay">VNPay</Option>
                  <Option value="MOMO">MOMO</Option>
                  <Option value="other">Phương thức khác</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Voucher" name="discount">
                <Select placeholder="Chọn Voucher" style={{ fontSize: '16px' }}>
                  <div className="flex flex-col-reverse items-center">
                    <span>
                      <img
                        className="h-16 w-16 object-cover"
                        src={imgVoucher}
                        alt="Voucher"
                      />
                      Hiện chưa có voucher nào
                    </span>
                  </div>
                </Select>
              </Form.Item>
            </Form>
          </Col>

          <Col span={12}>
            <Card className="mt-4 rounded shadow">
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={4} style={{ margin: 0 }}>
                    Đơn Hàng Của Bạn
                  </Title>
                </Col>
                <Col>
                  <span style={{ fontSize: '16px', color: 'gray' }}>
                    Ngày đặt hàng: {new Date().toLocaleDateString()}
                  </span>
                </Col>
              </Row>

              <List
                itemLayout="horizontal"
                dataSource={cartItems}
                renderItem={(item) => (
                  <List.Item>
                    <img
                      className="mr-4 h-16 w-16 object-cover"
                      src={item.product?.thumbnails?.[0]}
                    />
                    <List.Item.Meta
                      title={
                        <span
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                          }}
                        >
                          {item.product?.name}
                        </span>
                      }
                      description={`Đơn giá: ${item.newPrice ? item.newPrice.toLocaleString() : item.price.toLocaleString()}đ`}
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
                className="mt-4 flex justify-between"
                style={{ fontSize: '18px' }}
              >
                <span>Phí vận chuyển</span>
                <span>{shippingFee.toLocaleString()}₫</span>
              </div>
              {totalPrice >= 300000 && (
                <div
                  className="mt-2 text-green-600"
                  style={{ fontSize: '16px' }}
                >
                  * Hóa đơn trên 300k được miễn phí vận chuyển
                </div>
              )}
              <div
                className="mt-4 flex justify-between font-bold"
                style={{ fontSize: '20px' }}
              >
                <span>Tổng thanh toán</span>
                <span className="text-red-500">
                  {(totalPrice + (shippingFee || 0)).toLocaleString()}₫
                </span>
              </div>
            </Card>
            <Row justify="center" className="mt-4">
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '200px', fontSize: '18px' }}
                onClick={() => form.submit()}
                loading={loading}
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
