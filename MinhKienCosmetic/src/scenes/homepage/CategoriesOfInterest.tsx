import React, { useState } from 'react';
import Son from '@/assets/Son.jpg';
import KCN from '@/assets/KCN.jpg';
import Serum from '@/assets/Serum.jpg';
import ST from '@/assets/ST.jpg';
import SRM from '@/assets/SRM.jpg';
import DG from '@/assets/DG.jpg';
import NTT from '@/assets/NTT.jpg';
import CLG from '@/assets/Collagen.png';
import { Divider, Row, Col, Button } from 'antd';
import ActionButton from '@/Shared/ActionButton';

const CategoriesOfInterest: React.FC = () => {
  const imageCategories = [
    { src: Son, name: 'Son' },
    { src: KCN, name: 'Kem Chống Nắng' },
    { src: Serum, name: 'Serum' },
    { src: ST, name: 'Sữa Tắm' },
    { src: SRM, name: 'Sữa Rửa Mặt' },
    { src: DG, name: 'Dầu Gội' },
    { src: NTT, name: 'Nước Tẩy Trang' },
    { src: CLG, name: 'Collagen' },
  ];

  const [showAll, setShowAll] = useState(false);

  return (
    <div>
      <Divider
        orientation="left"
        style={{ fontSize: '30px', fontWeight: '700' }}
      >
        Danh Mục Quan Tâm
      </Divider>
      <div className="flex justify-end">
        <Button
          type="link"
          onClick={() => setShowAll(!showAll)}
          className="px-6 py-2 font-sans text-base font-bold text-white"
        >
          <ActionButton parentId="more">Xem Thêm...</ActionButton>
        </Button>
      </div>
      <div className="flex cursor-pointer flex-col items-center py-6">
        <Row gutter={40}>
          {imageCategories.map((item, index) => (
            <Col span={3} key={index} className="flex flex-col items-center">
              <img
                src={item.src}
                alt={`categoriesOfIterest-${index}`}
                className="h-[170px] w-[170px] rounded-md bg-pink-20 object-cover p-2"
              />
              <span className="mt-2 text-sm font-medium">{item.name}</span>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default CategoriesOfInterest;
