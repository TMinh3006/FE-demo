import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Divider, Row } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { IProduct } from '@/Apis/Product/Product.Interface';
import productApi from '@/Apis/Product/Product.Api';

const Items: React.FC = () => {
  const [Products, setProducts] = useState<IProduct[]>([]);

  const getProducts = async () => {
    try {
      const response = await productApi.getProducts(2, 5);
      setProducts(response);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <Divider
        orientation="left"
        style={{ fontSize: '30px', fontWeight: '700' }}
      >
        Sản Phẩm Bán Chạy
      </Divider>
      <Row className="flex items-center justify-center p-6" gutter={16}>
        {Products.map((products) => (
          <Col
            className="m-3 flex w-40 flex-col items-center justify-center rounded-md bg-white py-2"
            key={products.id}
            span={4}
          >
            {products.thumbnails.length > 0 ? (
              <img
                src={products.thumbnails[0]}
                alt={products.name}
                className="h-40 w-40 rounded-md object-cover"
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-md bg-gray-200">
                <span>No image</span>
              </div>
            )}
            <div className="mt-3 w-full">{products.brandName}</div>
            <Link to={`/ProductDetail/${products.id}`}>
              <button className="truncate-limit-custom w-full text-base font-bold">
                {products.name}
              </button>
            </Link>
            <div>
              <StarOutlined />
            </div>

            <div className="text-lg text-red-500">
              {products.price.toLocaleString()}đ
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Items;
