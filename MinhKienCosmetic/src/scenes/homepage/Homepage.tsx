import React, { useEffect, useState } from 'react';
import Slide1 from '@/assets/slideshow1.jpg';
import Slide2 from '@/assets/slideshow2.jpg';
import Slide3 from '@/assets/slideshow3.jpg';
import { Carousel, Row, Col, message, Button } from 'antd';
import { Link } from 'react-router-dom';
import Items from '@/components/Items/Items';
import CategoriesOfInterest from './DiscoutItems/CategoriesOfInterest';
import BlogPage from '../BlogPage/BlogPage';
import apiBrand from '@/Apis/Brands/Brand.api';
import { IBrands } from '@/Apis/Brands/Brands.interface';

const HomePage: React.FC = () => {
  const imageSlideList = [Slide1, Slide2, Slide3];
  const [brands, setBrands] = useState<IBrands[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Fetching brands from API
  const fetchBrands = async () => {
    try {
      const response = await apiBrand.getBrand(0, 10);

      setBrands(response);
    } catch (error) {
      console.error('Error fetching brands:', error);
      message.error('Không thể tải danh sách thương hiệu.');
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const imagesToShow = showAll ? brands : brands.slice(0, 5);

  return (
    <div>
      <section className="m-0 p-0">
        <Carousel autoplay infinite={true}>
          {imageSlideList.map((imageItem: string, index: number) => (
            <div key={index}>
              <img
                src={imageItem}
                className="h-[400px] w-full object-cover"
                alt={`slide-${index}`}
              />
            </div>
          ))}
        </Carousel>

        <div className="flex flex-col items-center bg-rose-50 py-4">
          <Row gutter={16} justify="center" align="middle" className="gap-0">
            {imagesToShow.map((brand: IBrands, index: number) => (
              <Col span={3} key={brand.id} className="flex justify-center">
                <Link to={`/brand/${brand.id}`}>
                  <img
                    src={brand.thumbnail}
                    alt={`brand-highlight-${index}`}
                    className="h-[80px] w-full rounded-xl bg-white object-contain p-2 shadow-lg transition-transform duration-200 hover:scale-105"
                  />
                </Link>
              </Col>
            ))}
            {!showAll && (
              <Col span={4} className="flex items-center justify-center">
                <Link to="/AllBrands">
                  <Button
                    className="ml-10 rounded-xl border border-black bg-white px-5 py-5 text-base font-bold hover:!border-black hover:!bg-yellow-300 hover:!text-black"
                    onClick={() => setShowAll(true)}
                  >
                    Xem Thêm...
                  </Button>
                </Link>
              </Col>
            )}
          </Row>
        </div>
      </section>

      <section className="m-0 bg-gradient-to-b from-red-600 to-rose-100 p-0">
        <CategoriesOfInterest />
      </section>
      <section className="m-0">
        <Items />
      </section>
      <section className="bg-gradient-to-b from-sky-50 to-sky-200">
        <BlogPage />
      </section>
    </div>
  );
};

export default HomePage;
