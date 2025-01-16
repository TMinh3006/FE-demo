import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Divider, Rate, Row } from 'antd';
import { IProductDetail } from '@/Apis/Product/Product.interface';
import productApi from '@/Apis/Product/Product.api';
import apiBrand from '@/Apis/Brands/Brand.api';
import { IBrands } from '@/Apis/Brands/Brands.interface';

const Items: React.FC = () => {
  const [Products, setProducts] = useState<IProductDetail[]>([]);

  const [brands, setBrands] = useState<Record<string, IBrands>>({});
  const [showAll, setShowAll] = useState(false);

  const getProducts = async () => {
    try {
      const response = await productApi.getProducts(0, 200, 'sold', 'desc');
      const products = response.result.products;

      if (showAll) {
        setProducts(products);
      } else {
        const bestSellingProducts = products
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 10);
        setProducts(bestSellingProducts);
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  useEffect(() => {
    const fetchBrands = async () => {
      const fetchedBrands: Record<string, IBrands> = {};
      try {
        for (const product of Products) {
          const brandId = product.brandId;
          if (brandId && !fetchedBrands[brandId]) {
            const brand = await apiBrand.getBrandId(brandId);
            fetchedBrands[brandId] = brand;
          }
        }
        setBrands((prevBrands) => ({ ...prevBrands, ...fetchedBrands }));
      } catch (error) {
        console.error('Lỗi khi tải brand:', error);
      }
    };

    if (Products.length > 0) {
      fetchBrands();
    }
  }, [Products]);

  return (
    <div>
      <Divider
        orientation="center"
        style={{ fontSize: '28px', fontWeight: '700', paddingTop: '25px' }}
      >
        Sản Phẩm Bán Chạy
      </Divider>

      <Row className="flex items-center justify-center pb-4" gutter={12}>
        {Products.map((products) => (
          <Col
            className="m-3 flex flex-col items-center justify-center rounded-md bg-white p-4 shadow-md"
            key={products.id}
            span={4}
          >
            {products.thumbnails && products.thumbnails.length > 0 ? (
              <div className="relative h-40 w-full overflow-hidden rounded-md">
                <img
                  src={products.thumbnails[0]}
                  alt={products.name}
                  className="absolute h-full w-full rounded-md object-cover transition-opacity duration-300 hover:opacity-0"
                />

                <img
                  src={products.thumbnails[1]}
                  alt={`${products.name}-hover`}
                  className="absolute h-full w-full rounded-md object-cover opacity-0 transition-opacity duration-300 hover:opacity-100"
                />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-200">
                <span>No image</span>
              </div>
            )}

            <div className="mt-3 w-full font-semibold hover:underline">
              <Link to={`/brand/${products.brandId}`}>
                <span className="hover:!text-black">
                  {brands[products.brandId]?.name || 'Đang tải...'}
                </span>
              </Link>
            </div>

            <Link to={`/ProductDetail/${products.id}`}>
              <button className="truncate-limit-custom w-full hover:!font-bold hover:!text-black">
                {products.name}
              </button>
            </Link>
            <div className="text-sm font-semibold text-red-600">
              {products.price.toLocaleString()}đ
            </div>

            <div className="flex w-full space-x-1">
              <div className="mt-2 flex flex-grow items-center justify-center">
                <Rate className="mr-1 text-yellow-500" value={4.5} disabled />
              </div>

              <div className="flex flex-grow items-center justify-center space-x-1">
                <div className="text-xs text-slate-600">Đã bán:</div>
                <div className="text-sm font-semibold text-gray-800">
                  {products.sold}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <div className="flex justify-center pb-4">
        <Link to="/BestSell">
          <Button
            className="rounded-xl border border-black bg-white px-5 py-5 text-base font-bold hover:!border-black hover:!bg-yellow-300 hover:!text-black"
            onClick={() => setShowAll(true)}
          >
            Xem Thêm...
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Items;
