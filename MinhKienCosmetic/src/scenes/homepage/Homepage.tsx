import { SelectedPage } from '@/Shared/types';
import Slide1 from '@/assets/slideshow1.jpg';
import Slide2 from '@/assets/slideshow2.jpg';
import Slide3 from '@/assets/slideshow3.jpg';
import { Carousel, Row, Col, Button } from 'antd';
import Brand1 from '@/assets/skinAqua.png';
import Brand2 from '@/assets/3-CE.png';
import Brand3 from '@/assets/BIO-ESSENCE.jpg';
import Brand4 from '@/assets/BOM.png';
import Brand5 from '@/assets/SIMPLE.jpg';
import Brand6 from '@/assets/SUNPLAY-750x250.png';
import Brand7 from '@/assets/cocoon.jpg';
import { useState } from 'react';
import ActionButton from '@/Shared/ActionButton';
import Items from '@/components/Items/Items';

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const HomePage = ({ setSelectedPage }: Props) => {
  const imageSlideList = [Slide1, Slide2, Slide3];
  const brandHightlight = [
    Brand1,
    Brand2,
    Brand3,
    Brand4,
    Brand5,
    Brand6,
    Brand7,
  ];
  const [showAll, setShowAll] = useState(false);
  const imagesToShow = showAll ? brandHightlight : brandHightlight.slice(0, 5);

  return (
    <div>
      <section id={SelectedPage.TRANG_CHU} className="p-6 pt-24">
        <Carousel autoplay infinite={true}>
          {imageSlideList.map((imageItem: string, index: number) => (
            <div key={index}>
              <img src={imageItem} className="h-[500px] w-full object-cover" />
            </div>
          ))}
        </Carousel>

        <div className="flex flex-col items-center py-4">
          <Row gutter={16} justify="center" align="middle">
            {imagesToShow.map((imageBrand: string, index: number) => (
              <Col span={4} key={index} className="flex justify-center">
                <img
                  src={imageBrand}
                  alt={`brand-highlight-${index}`}
                  className="h-[100px] w-full rounded-xl bg-white object-cover p-2"
                />
              </Col>
            ))}
            <Button
              type="link"
              onClick={() => setShowAll(!showAll)}
              className="mt-4 pr-6 font-sans font-bold text-pink-500"
            >
              <ActionButton setSelectedPage={setSelectedPage}>
                Xem Thêm...
              </ActionButton>
            </Button>
          </Row>
        </div>
      </section>

      <section className="bg-red-300">
        <Items />
      </section>
    </div>
  );
};

export default HomePage;
