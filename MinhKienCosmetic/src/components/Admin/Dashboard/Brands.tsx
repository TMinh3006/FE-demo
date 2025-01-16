import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Image,
} from 'antd';
import brandService from '@/Apis/Admin/ABrands/ABrands.api';
import { IBrands } from '@/Apis/Admin/ABrands//ABrands.interface';
import { SearchOutlined } from '@ant-design/icons';

const BrandManagement: React.FC = () => {
  const [brands, setBrands] = useState<IBrands[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredBrands, setFilteredBrands] = useState<IBrands[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingBrand, setEditingBrand] = useState<IBrands | null>(null);

  const [form] = Form.useForm();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await brandService.getBrands(0, 1000);
      setBrands(response);
      setFilteredBrands(response);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
      message.error('Không thể tải danh sách thương hiệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const lowercasedTerm = term.toLowerCase();
    const filtered = brands.filter((brand) =>
      brand.name.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredBrands(filtered);
  };

  const deleteBrand = async (id: string) => {
    try {
      await brandService.deleteBrandsById(id);
      message.success('Xóa thương hiệu thành công');
      fetchBrands();
    } catch (error) {
      console.error('Failed to delete brand:', error);
      message.error('Xóa thương hiệu thất bại');
    }
  };

  const showModal = (brand?: IBrands) => {
    setEditingBrand(brand || null);
    if (brand) {
      form.setFieldsValue({
        name: brand.name,
        thumbnail: brand.thumbnail,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleFinish = async (values: { name: string; thumbnail: string }) => {
    try {
      if (editingBrand) {
        await brandService.updateBrands(editingBrand.id, values);
        message.success('Cập nhật thương hiệu thành công');
      } else {
        await brandService.createBrands(values);
        message.success('Tạo thương hiệu thành công');
      }
      fetchBrands();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to save brand:', error);
      message.error('Lưu thương hiệu thất bại');
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail: string) => (
        <div
          style={{
            backgroundColor: '#f0f0f0',
            padding: '4px',
            display: 'inline-block',
            borderRadius: '4px',
          }}
        >
          <Image
            src={thumbnail}
            width={60}
            style={{ display: 'block', margin: '0 auto' }}
          />
        </div>
      ),
    },
    {
      title: 'Tên thương hiệu',
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: IBrands) => (
        <>
          <Button
            onClick={() => showModal(record)}
            style={{ marginRight: '4px' }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thương hiệu này?"
            onConfirm={() => deleteBrand(record.id)}
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <Input
          placeholder="Tìm kiếm thương hiệu"
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
          Thêm thương hiệu
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredBrands}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingBrand ? 'Sửa thương hiệu' : 'Thêm thương hiệu'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="name"
            label="Tên thương hiệu"
            rules={[
              { required: true, message: 'Vui lòng nhập tên thương hiệu' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="thumbnail" label="Hình ảnh">
            <Input placeholder="URL hình ảnh" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingBrand ? 'Cập nhật' : 'Tạo'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandManagement;
