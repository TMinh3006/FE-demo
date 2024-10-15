import React, { useEffect, useState } from 'react';
import Slide1 from '@/assets/slideshow1.jpg';
import Slide2 from '@/assets/slideshow2.jpg';
import Slide3 from '@/assets/slideshow3.jpg';
import { Carousel, Row, Col, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Items from '@/components/Items/Items';
import CategoriesOfInterest from './CategoriesOfInterest';
import BlogPage from '../BlogPage/BlogPage';

const HomePage: React.FC = () => {
  const imageSlideList = [Slide1, Slide2, Slide3];
  const [brands, setBrands] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Fetching brands from API
  const fetchBrands = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/brands?page=1&limit=5'
      );
      setBrands(response.data);
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
      <section>
        <Carousel autoplay infinite={true}>
          {imageSlideList.map((imageItem: string, index: number) => (
            <div key={index}>
              <img
                src={imageItem}
                className="h-[500px] w-full object-cover"
                alt={`slide-${index}`}
              />
            </div>
          ))}
        </Carousel>

        <div className="flex flex-col items-center py-4">
          <Row gutter={16} justify="center" align="middle">
            {imagesToShow.map(
              (
                brand: { id: number; name: string; thumbnail: string },
                index: number
              ) => (
                <Col span={3} key={brand.id} className="flex justify-center">
                  <Link to={`/brand/${brand.id}`}>
                    <img
                      src={brand.thumbnail}
                      alt={`brand-highlight-${index}`}
                      className="h-[100px] w-full rounded-xl bg-white object-cover p-2"
                    />
                  </Link>
                </Col>
              )
            )}
          </Row>
        </div>
      </section>

      <section className="bg-red-300">
        <Items />
      </section>

      <section className="mt-8 bg-white">
        <CategoriesOfInterest />
      </section>

      <section>
        <BlogPage />
      </section>
    </div>
  );
};

export default HomePage;
