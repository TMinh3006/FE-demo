import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Popconfirm,
  Modal,
  Form,
  Input,
  message,
  Space,
  Descriptions,
  Image,
} from 'antd';
import { Blog, IBlog } from '@/Apis/Admin/ABlog/ABlog.interface';
import apiService from '@/Apis/Admin/ABlog/ABlog.api';

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<IBlog | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewingProduct, setViewingProduct] = useState<IBlog | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);

  const [form] = Form.useForm();

  const fetchBlogs = async (page: number = 0, limit: number = 10) => {
    setLoading(true);
    try {
      const response = await apiService.getBlog(page, limit);
      setBlogs(response);
      setFilteredBlogs(response);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      message.error('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  const viewProductDetails = async (id: string) => {
    try {
      const response: IBlog = await apiService.getBlogbyId(id);
      setViewingProduct(response);
      setIsViewModalVisible(true);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      message.error('Không thể tải thông tin sản phẩm');
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      await apiService.deleteBlog(id);
      message.success('Xóa bài viết thành công');
      fetchBlogs();
    } catch (error) {
      console.error('Failed to delete blog:', error);
      message.error('Xóa bài viết thất bại');
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const lowercasedTerm = term.toLowerCase();
    const filtered = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredBlogs(filtered);
  };

  const showModal = (blog?: IBlog) => {
    setEditingBlog(blog || null);
    if (blog) {
      form.setFieldsValue({
        title: blog.title,
        description: blog.description.join(', '),
        thumbnails: blog.thumbnails?.join(', ') || '',
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleFinish = async (values: Blog) => {
    try {
      const blogData: Blog = {
        ...values,
        description: values.description.split(',').map((desc) => desc.trim()),
        thumbnails: values.thumbnails?.split(',').map((url) => url.trim()),
      };

      if (editingBlog) {
        await apiService.updateBlog(editingBlog.id, blogData);
        message.success('Cập nhật bài viết thành công');
      } else {
        await apiService.createBlog(blogData);
        message.success('Tạo bài viết thành công');
      }
      fetchBlogs();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to save blog:', error);
      message.error('Lưu bài viết thất bại');
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnails',
      key: 'thumbnails',
      render: (thumbnails: string[]) => {
        if (thumbnails && thumbnails.length > 0) {
          return (
            <img
              src={thumbnails[0]}
              alt="product"
              style={{ width: '90px', height: '50px', objectFit: 'cover' }}
            />
          );
        }
        return null;
      },
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },

    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: IBlog) => (
        <Space>
          <Button
            onClick={() => viewProductDetails(record.id)}
            style={{ marginRight: '4px' }}
          >
            Xem chi tiết
          </Button>
          <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => deleteBlog(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <Input
          placeholder="Tìm kiếm bài viết theo tiêu đề"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: '60%', padding: '12px', borderRadius: '4px' }}
        />
        <Button type="primary" onClick={() => showModal()}>
          Thêm bài viết
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredBlogs}
        rowKey="id"
        loading={loading}
      />
      <Modal
        title="Chi tiết sản phẩm"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setIsViewModalVisible(false)}
          ></Button>,
        ]}
        width={800}
      >
        {viewingProduct && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Id">
              {viewingProduct.id}
            </Descriptions.Item>

            <Descriptions.Item label="Số lượng">
              {viewingProduct.title}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {viewingProduct.description}
            </Descriptions.Item>

            <Descriptions.Item label="Hình ảnh">
              {viewingProduct.thumbnails?.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  width={100}
                  style={{ marginRight: '8px' }}
                />
              )) || 'Không có'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title={editingBlog ? 'Sửa bài viết' : 'Thêm bài viết'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề bài viết' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả bài viết' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="thumbnails" label="Hình ảnh">
            <Input placeholder="URL hình ảnh, cách nhau bằng dấu phẩy" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingBlog ? 'Cập nhật' : 'Tạo'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogManagement;
