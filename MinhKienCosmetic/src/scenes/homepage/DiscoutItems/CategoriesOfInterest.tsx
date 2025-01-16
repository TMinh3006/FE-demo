import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Divider, Rate, Row } from 'antd';
import { IProductDetail } from '@/Apis/Product/Product.interface';
import productApi from '@/Apis/Product/Product.api';
import apiBrand from '@/Apis/Brands/Brand.api';
import { IBrands } from '@/Apis/Brands/Brands.interface';

const DiscountedProducts: React.FC = () => {
  const [Products, setProducts] = useState<IProductDetail[]>([]);
  const [brands, setBrands] = useState<Record<string, IBrands>>({});
  const [showAll, setShowAll] = useState(false);

  const getDiscountedProducts = async () => {
    try {
      const response = await productApi.getProducts(0, 200, 'discount', 'desc');
      const products = response.result.products;

      const discountedProducts = products.filter(
        (product) => product.discount > 0
      );

      if (showAll) {
        setProducts(discountedProducts);
      } else {
        setProducts(discountedProducts.slice(0, 10));
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  useEffect(() => {
    getDiscountedProducts();
  }, [showAll]);

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

  const DiscountPercentage = (price: number, newPrice: number) => {
    if (price === 0) return 0;
    return Math.round(((price - newPrice) / price) * 100);
  };

  return (
    <div>
      <Divider
        orientation="center"
        style={{
          fontSize: '28px',
          fontWeight: '700',
          paddingTop: '25px',
        }}
      >
        <span className="text-white"> ĐẠI TIỆC ƯU ĐÃI </span>
      </Divider>

      <Row className="flex items-center justify-center pb-4" gutter={12}>
        {Products.map((product) => (
          <Col
            className="m-3 flex flex-col items-center justify-center rounded-md bg-white pb-4 shadow-md"
            key={product.id}
            span={4}
          >
            {product.thumbnails && product.thumbnails.length > 0 ? (
              <div className="relative h-40 w-full overflow-hidden rounded-md">
                <img
                  src={product.thumbnails[0]}
                  alt={product.name}
                  className="absolute h-full w-full rounded-md object-cover transition-opacity duration-300 hover:opacity-0"
                />

                <img
                  src={product.thumbnails[1]}
                  alt={`${product.name}-hover`}
                  className="absolute h-full w-full rounded-md object-cover opacity-0 transition-opacity duration-300 hover:opacity-100"
                />

                {product.discount > 0 && (
                  <div className="absolute right-2 top-1 rounded-full bg-red-600 px-2 py-1 text-sm text-white">
                    -{DiscountPercentage(product.price, product.newPrice)}%
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-200">
                <span>No image</span>
              </div>
            )}

            <div className="mt-3 w-full font-semibold hover:underline">
              <Link to={`/brand/${product.brandId}`}>
                <span className="hover:!text-black">
                  {brands[product.brandId]?.name || 'Đang tải...'}
                </span>
              </Link>
            </div>

            <Link to={`/ProductDetail/${product.id}`}>
              <button className="truncate-limit-custom w-full hover:!font-bold hover:!text-black">
                {product.name}
              </button>
            </Link>
            <div className="flex w-full items-center justify-center space-x-2">
              <div className="text-sm font-light line-through">
                {product.price.toLocaleString()}đ
              </div>
              <div className="text-sm font-semibold text-red-600">
                {product.newPrice.toLocaleString()}đ
              </div>
            </div>

            <div className="flex w-full space-x-1">
              <div className="mt-2 flex flex-grow items-center justify-center">
                <Rate
                  className="mr-1 text-yellow-500"
                  value={product.sold > 0 ? 4.5 : 0}
                  disabled
                />
              </div>

              <div className="flex flex-grow items-center justify-center space-x-1">
                <div className="text-xs text-slate-600">Đã bán:</div>
                <div className="text-sm font-semibold text-gray-800">
                  {product.sold}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <div className="flex justify-center pb-4">
        <Link to="/Discount">
          <Button
            className="rounded-xl border-none bg-white px-5 py-5 text-base font-bold hover:!border-black hover:!bg-yellow-300 hover:!text-black"
            onClick={() => setShowAll(true)}
          >
            Xem Thêm...
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DiscountedProducts;
