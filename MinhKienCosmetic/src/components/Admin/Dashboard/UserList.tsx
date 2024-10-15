import React, { useEffect, useState } from 'react';
import { Button, Table, Popconfirm, message } from 'antd';
import userApi from '@/Apis/Admin/AUsers/AUser.api';
import { IUser, IUserResponse } from '@/Apis/Admin/AUsers/AUser.interface';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async (page: number = 0, limit: number = 50) => {
    setLoading(true);
    try {
      const response: IUserResponse = await userApi.getUsers(page, limit);
      setUsers(response.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserActiveStatus = async (id: number, active: boolean) => {
    try {
      await userApi.updateUserActiveStatus(id, !active); // Gọi API để cập nhật trạng thái
      message.success(`Cập nhật trạng thái người dùng thành công`);
      fetchUsers(0, 50);
    } catch (error) {
      console.error('Failed to update user status:', error);
      message.error('Cập nhật trạng thái người dùng thất bại');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên đầy đủ',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Ngày Sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (_: boolean, record: IUser) => (
        <>
          <span>{record.active ? 'Đã bị chặn' : 'Đang hoạt động'}</span>
          <Popconfirm
            title={`Bạn có chắc chắn muốn ${record.active ? 'kích hoạt' : 'chặn'} người dùng này?`}
            onConfirm={() => toggleUserActiveStatus(record.id, record.active)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link">{record.active ? 'Kích hoạt' : 'Chặn'}</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};
export default UserList;
