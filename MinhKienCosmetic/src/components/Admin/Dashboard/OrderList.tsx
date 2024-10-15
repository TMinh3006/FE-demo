import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Select, Avatar, Popconfirm, Button } from 'antd';
import apiService from '@/Apis/Admin/AOrders/AOrder.api'; // Giả sử bạn đã tạo apiService cho đơn hàng
import { IOrder } from '@/Apis/Admin/AOrders/AOrder.interface';

const { Option } = Select;

const Orderlist: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Hàm lấy danh sách đơn hàng
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiService.getOrders(0, 1000); // Page 1, limit 10 đơn hàng
      setOrders(response);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (id: number, status: string) => {
    try {
      await apiService.updateOrderStatus(id, status);
      message.success('Cập nhật trạng thái đơn hàng thành công');
      fetchOrders(); // Cập nhật lại danh sách đơn hàng
    } catch (error) {
      console.error('Failed to update order status:', error);
      message.error('Cập nhật trạng thái đơn hàng thất bại');
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole !== '1') {
      message.error('Bạn không có quyền truy cập vào trang này');
      window.location.href = '/';
      return;
    }
    fetchOrders();
  }, []);

  const deleteOrder = async (id: number) => {
    try {
      const userRole = localStorage.getItem('role');
      if (userRole !== '1') {
        message.error('Bạn không có quyền truy cập vào trang này');
        window.location.href = '/';
        return;
      }
      await apiService.deleteOrderById(id);
      message.success('Xóa sản phẩm thành công');
      fetchOrders();
    } catch (error) {
      console.error('Failed to delete product:', error);
      message.error('Xóa sản phẩm thất bại');
    }
  };

  const columns = [
    {
      title: 'ID Đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên người nhận',
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: 'Thông tin Đơn hàng',
      key: 'orderDetails',
      render: (record: IOrder) => (
        <ul style={{ fontSize: '16px', lineHeight: '1.5' }}>
          {record.order_details.map((detail, index) => (
            <li key={index}>
              {<Avatar src={detail.product.thumbnails[0]} />}
              {detail.product.name} - SL:{detail.numberOfProducts}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_money',
      key: 'total_money',
      render: (totalMoney: number) => `${totalMoney.toLocaleString()}đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: IOrder) => (
        <Select
          defaultValue={status}
          onChange={(value) => updateOrderStatus(record.id, value)}
        >
          <Option value="pending">Đang xử lý</Option>
          <Option value="processing">Đang vận chuyển</Option>
          <Option value="shipped">Đã giao</Option>
          <Option value="delivered">Đã nhận hàng</Option>
          <Option value="cancelled">Đã hủy</Option>
        </Select>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: IOrder) => (
        <>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đơn hàng này?"
            onConfirm={() => deleteOrder(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Hủy</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  if (loading) {
    return <Spin />;
  }

  return (
    <div>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default Orderlist;
