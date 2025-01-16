import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Descriptions, Switch } from 'antd';
import { IUser } from '@/Apis/Admin/AUsers/AUser.interface';
import UserApi from '@/Apis/Admin/AUsers/AUser.api';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const getUser = async () => {
    try {
      const response = await UserApi.getUsers();
      setUsers(response.result);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Không thể lấy danh sách người dùng');
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleToggleStatus = async (userId: string) => {
    console.log('User ID: ', userId);
    if (!userId) {
      message.error('User ID không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      await UserApi.updateUserActiveStatus(userId);
      message.success('Cập nhật trạng thái người dùng thành công');
      getUser();
    } catch (error) {
      console.error('Failed to update user status:', error);
      message.error('Cập nhật trạng thái người dùng thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý mở modal chi tiết
  const handleViewDetails = (user: IUser) => {
    setSelectedUser(user);
    setIsDetailModalVisible(true);
  };

  // Xử lý đóng modal chi tiết
  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedUser(null);
  };

  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean, record: IUser) => (
        <Switch
          checked={active}
          onChange={() => handleToggleStatus(record.id)}
          loading={loading}
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: unknown, record: IUser) => (
        <Button
          onClick={() => handleViewDetails(record)}
          style={{ marginRight: '4px' }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={users} columns={columns} rowKey="id" />

      {/* Modal hiển thị chi tiết người dùng */}
      <Modal
        title="User Details"
        visible={isDetailModalVisible}
        onCancel={handleCloseDetailModal}
        footer={null}
      >
        {selectedUser ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Username">
              {selectedUser.username}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedUser.email || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Name">
              {selectedUser.name || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
              {selectedUser.gender || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {selectedUser.dob || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Active">
              {selectedUser.active ? 'Đã bị chặn' : 'Đang hoạt động'}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>No user selected.</p>
        )}
      </Modal>
    </div>
  );
};

export default UserList;
