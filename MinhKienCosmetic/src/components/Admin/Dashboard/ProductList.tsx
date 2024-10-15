import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
} from 'antd';
import apiService from '@/Apis/Admin/Aproduct/AProduct.api';
import { IProduct, Product } from '@/Apis/Admin/Aproduct/AProduct.interface';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form] = Form.useForm();

  const checkAdminRole = () => {
    const userRole = localStorage.getItem('role');
    if (userRole !== '1') {
      message.error('Bạn không có quyền truy cập vào trang này');
      window.location.href = '/';
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiService.getProducts(0, 1000); // Page 1, limit 10 sản phẩm
      setProducts(response);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa sản phẩm
  const deleteProduct = async (id: number) => {
    try {
      await apiService.deleteProductById(id);
      message.success('Xóa sản phẩm thành công');
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      message.error('Xóa sản phẩm thất bại');
    }
  };

  // Hàm mở modal để tạo hoặc sửa sản phẩm
  const showModal = (product?: Product) => {
    setEditingProduct(product || null);
    if (product) {
      form.setFieldsValue({
        id: product.id,
        name: product.name || '',
        price: product.price || undefined,
        quantity: product.quantity || undefined,
        thumbnails: Array.isArray(product.thumbnails)
          ? product.thumbnails.join(', ') // Chuyển mảng thành chuỗi
          : '',
        ingredients: Array.isArray(product.ingredient)
          ? product.ingredient.join(', ')
          : '',
        description: product.description || '',
        userManual: product.userManual || '',
        category_id: product.category?.id || null,
        brand_id: product.brand?.id || null,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Hàm xử lý gửi form để tạo hoặc sửa sản phẩm
  const handleFinish = async (values: IProduct) => {
    try {
      // Kiểm tra nếu thumbnails là một chuỗi và tách thành mảng
      const thumbnailsArray =
        typeof values.thumbnails === 'string'
          ? values.thumbnails.split(',').map((url) => url.trim())
          : values.thumbnails || []; // Nếu đã là mảng, giữ nguyên, nếu không có giá trị thì gán là mảng rỗng

      const productData = {
        ...values,
        thumbnails: thumbnailsArray.length > 0 ? thumbnailsArray : [],
        ingredients:
          typeof values.ingredients === 'string' &&
          values.ingredients.length > 0
            ? values.ingredients.split(',').map((ing) => ing.trim())
            : [], // Gán mảng rỗng nếu không có giá trị
      };

      if (editingProduct) {
        await apiService.updateProductById(editingProduct.id, productData);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        await apiService.createProduct(productData);
        message.success('Tạo sản phẩm thành công');
      }
      fetchProducts(); // Cập nhật lại danh sách sản phẩm
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to save product:', error);
      message.error('Lưu sản phẩm thất bại');
    }
  };

  useEffect(() => {
    checkAdminRole();
    fetchProducts();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ID danh mục',
      dataIndex: 'category_id',
      key: 'category_id',
    },
    {
      title: 'ID thương hiệu',
      dataIndex: 'brand_id',
      key: 'brand_id',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()}đ`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: Product) => (
        <>
          <Button
            onClick={() => showModal(record)}
            style={{ marginRight: '4px' }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => deleteProduct(record.id)}
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
        style={{ margin: '24px' }}
        onClick={() => showModal()}
      >
        Thêm sản phẩm
      </Button>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="thumbnails" label="Hình ảnh">
            <Input placeholder="URL hình ảnh" />
          </Form.Item>
          <Form.Item name="ingredients" label="Nguyên liệu">
            <Input placeholder="Danh sách nguyên liệu, cách nhau bằng dấu phẩy" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="userManual" label="Hướng dẫn sử dụng">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="category_id" label="ID danh mục">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="brand_id" label="ID thương hiệu">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingProduct ? 'Cập nhật' : 'Tạo'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductList;
