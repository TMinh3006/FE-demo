import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Select, Button, Form, Modal, Space } from 'antd';
import apiService from '@/Apis/Admin/AOrders/AOrder.api';
import { IOrder } from '@/Apis/Admin/AOrders/AOrder.interface';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';

const { Option } = Select;

const Orderlist: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [orderDetails, setOrderDetails] = useState<IOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<IOrder | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiService.getOrders(0, 1000);

      setOrders(response);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật trạng thái đơn hàng
  const handleEdit = (order: IOrder) => {
    setEditingOrder(order);
    setIsModalVisible(true);
    form.setFieldsValue(order);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingOrder) {
        await apiService.updateOrderStatus(editingOrder.id, values.status);
        message.success('Cập nhật trạng thái đơn hàng thành công!');
        setEditingOrder(null);
        setIsModalVisible(false);
        fetchOrders();
      }
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái.');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingOrder(null);
  };

  const handleViewDetails = (order: IOrder) => {
    setOrderDetails(order);
  };

  const columns = [
    {
      title: 'ID Đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên người nhận',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      render: (totalMoney: number) => `${totalMoney.toLocaleString()}đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: IOrder) => (
        <Space>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Button
            onClick={() => handleViewDetails(record)}
            style={{ marginRight: '4px' }}
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <Spin />;
  }

  return (
    <div>
      <Table
        dataSource={orders}
        columns={columns}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Sửa đơn hàng"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="pending">Đang xử lý</Option>
              <Option value="shipped">Đã giao</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orderlist;
