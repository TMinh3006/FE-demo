import React, { useEffect, useState } from 'react';
import Gallary from './Gallary';
import { Tabs } from 'antd';
import Productinfo from './Productinfo';
import productApi from '@/Apis/Product/Product.api';
import { IProduct } from '@/Apis/Product/Product.interface';
import { useParams } from 'react-router-dom';

const { TabPane } = Tabs;

const ProductDetail: React.FC = () => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const { id } = useParams<{ id: string }>();

  const ProductById = async (id: string) => {
    try {
      const responseDetail = await productApi.getById(id);
      console.log('Product Data:', responseDetail);
      setProduct(responseDetail);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    console.log('Product ID:', id);
    if (id) {
      ProductById(id);
    }
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex px-8 py-0">
        <div className="flex-1">
          <Gallary images={product.thumbnails} />
        </div>

        <div className="flex-1">
          <Productinfo
            id={product.id}
            name={product.name}
            price={product.price}
            quantity={product.quantity}
            thumbnails={product.thumbnails}
            ingredient={product.ingredient}
            userManual={product.userManual}
            brand={{ id: product.brand.id, name: product.brand.name }}
            description={product.description}
          />
        </div>
      </section>
      <section>
        <Tabs
          defaultActiveKey="1"
          tabBarStyle={{
            fontSize: '10px',
            fontWeight: 'bold',
            background: '#fff',
            padding: '10px',
          }}
        >
          <TabPane
            tab={<span className="bg-red-200 p-5 text-xl">Giới thiệu</span>}
            key="1"
          >
            <div className="mb-3 ml-24 text-2xl font-semibold">
              Mô tả chi tiết
            </div>

            <div className="ml-10 text-lg">{product.description}</div>
            <div className="flex flex-wrap items-center justify-center">
              {product.thumbnails && product.thumbnails.length > 0 ? (
                product.thumbnails.map((thumbnail, index) => (
                  <img
                    key={index}
                    src={thumbnail} // Assuming each item in thumbnails is a URL
                    alt={`Thumbnail ${index + 1}`}
                    className="h-30 w-30 m-2 object-cover" // Example styling, adjust as needed
                  />
                ))
              ) : (
                <p>No images available</p>
              )}
            </div>
          </TabPane>

          <TabPane
            tab={
              <span className="rounded-md bg-red-200 p-5 text-xl">
                Thành phần
              </span>
            }
            key="2"
          >
            <div className="mb-3 ml-24 text-2xl font-semibold">Thành Phần</div>
            <div className="ml-10 text-xl">{product.ingredient}</div>
          </TabPane>

          <TabPane
            tab={
              <span className="rounded-md bg-red-200 p-5 text-xl">
                Hướng dẫn sử dụng
              </span>
            }
            key="4"
          >
            <div className="mb-3 ml-24 text-2xl font-semibold">
              Hướng Dẫn Sử Dụng
            </div>
            <div className="ml-10 text-xl">{product.userManual}</div>
          </TabPane>
        </Tabs>
      </section>
    </div>
  );
};

export default ProductDetail;
