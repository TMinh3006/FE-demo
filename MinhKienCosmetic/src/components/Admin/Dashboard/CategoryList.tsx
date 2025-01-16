import React, { useEffect, useState } from 'react';
import { Button, message, Modal, Form, Input, Table, Popconfirm } from 'antd';
import categoryApi from '@/Apis/Admin/ACategories/ACategory.api';
import { ICategory } from '@/Apis/Admin/ACategories/ACategory.interface';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryApi.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      message.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getParentName = (parentId: string) => {
    const parentCategory = categories.find((cat) => cat.id === parentId);
    return parentCategory ? parentCategory.name : 'danh mục cha';
  };

  const showModal = (category?: ICategory) => {
    setEditingCategory(category || null);
    if (category) {
      form.setFieldsValue(category);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleFinish = async (values: Partial<ICategory>) => {
    try {
      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory.id, {
          ...editingCategory,
          ...values,
        });
        message.success('Cập nhật danh mục thành công');
      } else {
        await categoryApi.createCategory(values as ICategory);
        message.success('Tạo danh mục thành công');
      }
      fetchCategories();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to save category:', error);
      message.error('Lưu danh mục thất bại');
    }
  };

  const handleDelete = async (categoryId: string) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn xóa danh mục này?',
      onOk: async () => {
        try {
          await categoryApi.deleteCategory(categoryId);
          message.success('Xóa danh mục thành công');
          fetchCategories();
        } catch (error) {
          console.error('Failed to delete category:', error);
          message.error('Xóa danh mục thất bại');
        }
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ID Danh mục cha',
      dataIndex: 'parent_id',
      key: 'parent_id',
    },
    {
      title: 'Tên danh mục cha',
      key: 'parent_name',
      render: (_: unknown, record: ICategory) =>
        getParentName(record.parent_id),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: ICategory) => (
        <>
          <Button style={{ marginRight: 8 }} onClick={() => showModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: '10px' }}
        onClick={() => showModal()}
      >
        Thêm danh mục
      </Button>

      <Table
        dataSource={categories}
        columns={columns}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="parent_id"
            label="ID danh mục cha"
            rules={[
              { required: true, message: 'Vui lòng nhập ID danh mục cha' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCategory ? 'Cập nhật' : 'Tạo'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
