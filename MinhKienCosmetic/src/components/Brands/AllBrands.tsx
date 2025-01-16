import React, { useEffect, useState } from 'react';
import { Row, Col, message } from 'antd';
import { Link } from 'react-router-dom';
import BgBrands from '@/assets/Allbrands .jpg';
import apiBrand from '@/Apis/Brands/Brand.api';
import { IBrands } from '@/Apis/Brands/Brands.interface';

const AllBrands: React.FC = () => {
  const [brands, setBrands] = useState<IBrands[]>([]);

  // Fetching brands from API
  const fetchBrands = async () => {
    try {
      const response = await apiBrand.getBrand(0, 50);
      setBrands(response);
    } catch (error) {
      console.error('Error fetching brands:', error);
      message.error('Không thể tải danh sách thương hiệu.');
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="px-10 pb-8">
      <img
        src={BgBrands}
        className="h-[200px] w-full object-cover"
        alt="Brand Background"
      />
      <h2 className="m-4 text-center text-xl font-semibold drop-shadow-lg">
        Tất Cả Thương Hiệu
      </h2>
      <div className="px-4 py-2">
        <Row gutter={[16, 24]} justify="center" align="middle">
          {brands.map((brand: IBrands, index: number) => (
            <Col
              xs={12}
              sm={8}
              md={6}
              lg={4}
              key={brand.id}
              className="flex justify-center"
            >
              <Link
                to={`/brand/${brand.id}`}
                className="transition-all duration-300 hover:opacity-80"
              >
                <img
                  src={brand.thumbnail}
                  alt={`brand-${index}`}
                  className="h-[90px] w-[190px] rounded-xl bg-white object-contain p-1 shadow-md transition-all duration-300 hover:scale-105"
                />
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default AllBrands;
