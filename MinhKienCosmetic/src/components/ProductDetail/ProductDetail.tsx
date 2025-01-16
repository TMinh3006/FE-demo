import React, { useEffect, useState } from 'react';
import Gallary from './Gallary';
import { Tabs } from 'antd';
import Productinfo from './Productinfo';
import productApi from '@/Apis/Product/Product.api';
import { IProducts } from '@/Apis/Product/Product.interface';
import { useParams } from 'react-router-dom';

const { TabPane } = Tabs;

const ProductDetail: React.FC = () => {
  const [product, setProduct] = useState<IProducts | null>(null);
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

  if (!product || !product.result) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col bg-white">
      <section className="flex px-12 pt-2">
        <div className="flex-1">
          <Gallary images={product.result.thumbnails} />
        </div>

        <div className="flex-1">
          <Productinfo
            id={product.result.id}
            name={product.result.name}
            price={product.result.price}
            quantity={product.result.quantity}
            thumbnails={product.result.thumbnails}
            ingredient={product.result.ingredient}
            userManual={product.result.userManual}
            brandId={product.result.brandId}
            description={product.result.description}
            categoryId={product.result.categoryId}
            sold={product.result.sold}
            newPrice={product.result.newPrice}
            discount={product.result.discount}
          />
        </div>
      </section>
      <section className="mx-10">
        <Tabs
          defaultActiveKey="1"
          tabBarStyle={{
            fontSize: '12px',
            fontWeight: 'bold',
            background: '#FEADB9',
            padding: '2px',
            paddingLeft: '80px',
            marginTop: '25px',
            borderRadius: '20px 20px 20px 20px',
          }}
        >
          <TabPane
            tab={
              <span className="inline-block rounded-md bg-slate-50 px-5 text-lg !text-pink-600">
                Giới thiệu
              </span>
            }
            key="1"
          >
            <div className="m-2 rounded-xl p-2">
              <div className="mb-1 ml-20 text-xl font-semibold">
                Mô tả chi tiết
              </div>

              <div className="mb-5 ml-10 text-base">
                {product.result.description}
              </div>
              <div className="mb-5 flex flex-col items-center justify-center space-y-4">
                {product.result.thumbnails &&
                product.result.thumbnails.length > 0 ? (
                  product.result.thumbnails.map((thumbnail, index) => (
                    <img
                      key={index}
                      src={thumbnail}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-45 min-w-fit rounded-lg object-contain shadow-md"
                    />
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>
          </TabPane>

          <TabPane
            tab={
              <span className="inline-block rounded-md bg-slate-50 px-5 text-lg !text-pink-600">
                Thành phần
              </span>
            }
            key="2"
          >
            <div className="m-2 rounded-xl p-2">
              <div className="mb-1 ml-24 text-xl font-semibold">Thành Phần</div>
              <div className="mb-5 ml-10 text-lg">
                {product.result.ingredient}
              </div>
            </div>
          </TabPane>

          <TabPane
            tab={
              <span className="inline-block rounded-md bg-slate-50 px-5 text-lg !text-pink-600">
                Hướng dẫn sử dụng
              </span>
            }
            key="4"
          >
            <div className="m-2 rounded-xl p-2">
              <div className="mb-1 ml-24 text-xl font-semibold">
                Hướng Dẫn Sử Dụng
              </div>
              <div className="mb-5 ml-10 text-lg">
                {product.result.userManual}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </section>
    </div>
  );
};

export default ProductDetail;
