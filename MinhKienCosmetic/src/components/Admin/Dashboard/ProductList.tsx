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
  Descriptions,
  Image,
} from 'antd';
import apiService from '@/Apis/Admin/Aproduct/AProduct.api';
import apiProduct from '@/Apis/Product/Product.api';
import {
  ProductDetail,
  IProductDetail,
} from '@/Apis/Admin/Aproduct/AProduct.interface';
import brandsApi from '@/Apis/Brands/Brand.api';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import { IBrands } from '@/Apis/Brands/Brands.interface';

export interface IProductWithBrandName extends IProductDetail {
  brandName: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<IProductWithBrandName[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<
    IProductWithBrandName[]
  >([]);

  const [brands, setBrands] = useState<Record<string, IBrands>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<IProductDetail | null>(
    null
  );

  const [viewingProduct, setViewingProduct] =
    useState<IProductWithBrandName | null>(null);

  const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);

  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiService.getProducts(0, 1000);
      const fetchedProducts = response.result.products;

      // Tạo ánh xạ thương hiệu
      const fetchedBrands: Record<string, IBrands> = {};
      for (const product of fetchedProducts) {
        const brandId = product.brandId;
        if (brandId && !fetchedBrands[brandId]) {
          const brand = await brandsApi.getBrandId(brandId);
          fetchedBrands[brandId] = brand;
        }
      }

      // Thêm thuộc tính `brandName` vào sản phẩm
      const enrichedProducts: IProductWithBrandName[] = fetchedProducts.map(
        (product) => ({
          ...product,
          brandName: fetchedBrands[product.brandId]?.name || 'Không xác định',
        })
      );

      setBrands(fetchedBrands);
      setProducts(enrichedProducts);
      setFilteredProducts(enrichedProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };
  const viewProductDetails = async (id: string) => {
    try {
      const response = await apiProduct.getById(id);
      const product = response.result;
      const brandName = brands[product.brandId]?.name || 'Không xác định'; // Lấy tên thương hiệu từ state
      setViewingProduct({ ...product, brandName });
      setIsViewModalVisible(true);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      message.error('Không thể tải thông tin sản phẩm');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await apiService.deleteProductById(id);
      message.success('Xóa sản phẩm thành công');
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      message.error('Xóa sản phẩm thất bại');
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const lowercasedTerm = term.toLowerCase();
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showModal = (product?: IProductDetail) => {
    setEditingProduct(product || null);
    if (product) {
      form.setFieldsValue({
        id: product.id,
        name: product.name || '',
        price: product.price || undefined,
        newPrice: product.newPrice,
        discount: product.discount,
        quantity: product.quantity || undefined,
        thumbnails: Array.isArray(product.thumbnails)
          ? product.thumbnails.join(', ')
          : '',
        ingredient: Array.isArray(product.ingredient)
          ? product.ingredient.join(', ')
          : '',
        description: product.description || '',
        userManual: product.userManual || '',
        categoryId: product.categoryId || null,
        brandId: product.brandId || null,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };
  const handleFinish = async (values: ProductDetail) => {
    try {
      // Lấy giá gốc và giảm giá
      const price = values.price;
      const discount = values.discount;

      // Tính toán giá mới (newPrice)
      const newPrice = price - (price * discount) / 100;

      // Chuẩn bị dữ liệu sản phẩm
      const thumbnailsArray = values.thumbnails
        ? values.thumbnails.split(',').map((url) => url.trim())
        : [];

      const ingredientsArray = values.ingredient
        ? values.ingredient.split(',').map((ing) => ing.trim())
        : [];

      const productData: ProductDetail = {
        ...values,
        newPrice: newPrice,
        thumbnails: thumbnailsArray,
        ingredient: ingredientsArray,
      };

      // Lưu sản phẩm hoặc cập nhật sản phẩm
      if (editingProduct) {
        await apiService.updateProductById(editingProduct.id, productData);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        await apiService.createProduct(productData);
        message.success('Tạo sản phẩm thành công');
      }

      fetchProducts();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to save product:', error);
      message.error('Lưu sản phẩm thất bại');
    }
  };

  useEffect(() => {
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
      title: 'Thương hiệu',
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()}đ`,
    },
    {
      title: 'Giảm giá (%)',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number) => `${discount || 0}%`,
    },
    {
      title: 'Giá mới',
      dataIndex: 'newPrice',
      key: 'newPrice',
      render: (newPrice: number, record: IProductDetail) => {
        const price = record.price;
        return newPrice
          ? `${newPrice.toLocaleString()}đ`
          : `${price.toLocaleString()}đ`;
      },
    },

    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: IProductDetail) => (
        <Button.Group>
          <Button
            icon={<EyeOutlined />}
            onClick={() => viewProductDetails(record.id)}
            style={{ marginRight: '4px' }}
            title="Xem chi tiết"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            style={{ marginRight: '4px' }}
            title="Sửa"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => deleteProduct(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} danger title="Xóa" />
          </Popconfirm>
        </Button.Group>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <Input
          placeholder="Tìm kiếm sản phẩm theo tên"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: '50%',
            padding: '12px 16px',
            fontSize: '16px',
            borderRadius: '50px',
            border: '1px solid #ddd',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" onClick={() => showModal()}>
          Thêm sản phẩm
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredProducts}
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
            <Descriptions.Item label="Tên sản phẩm">
              {viewingProduct.name}
            </Descriptions.Item>
            <Descriptions.Item label="Thương hiệu">
              {viewingProduct?.brandName || 'Không xác định'}
            </Descriptions.Item>
            <Descriptions.Item label="Giá">{`${viewingProduct.price.toLocaleString()}đ`}</Descriptions.Item>
            <Descriptions.Item label="Giảm giá (%)">
              {viewingProduct.discount || '0'}%
            </Descriptions.Item>
            <Descriptions.Item label="Giá mới">
              {viewingProduct.newPrice
                ? `${viewingProduct.newPrice.toLocaleString()}đ`
                : 'Chưa có giá mới'}
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng">
              {viewingProduct.quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {viewingProduct.description}
            </Descriptions.Item>
            <Descriptions.Item label="Nguyên liệu">
              {viewingProduct.ingredient?.join(', ') || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Hướng dẫn sử dụng">
              {viewingProduct.userManual}
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
            name="brandName"
            label="Tên Thương Hiệu"
            rules={[
              { required: true, message: 'Vui lòng nhập tên thương hiệu' },
            ]}
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
            name="discount"
            label="Giảm giá (%)"
            rules={[{ required: true, message: 'Vui lòng nhập giảm giá' }]}
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: '100%' }}
              onChange={(value) => {
                const price = form.getFieldValue('price');
                if (price && value !== null) {
                  const newPrice = price - (price * (value || 0)) / 100;
                  form.setFieldsValue({ newPrice, discount: value }); // Cập nhật cả newPrice và discount
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name="newPrice"
            label="Giá mới"
            rules={[{ required: true, message: 'Vui lòng nhập giá mới' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} disabled />
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
