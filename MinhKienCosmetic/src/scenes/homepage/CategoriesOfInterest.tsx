import React, { useState } from 'react';
import Son from '@/assets/Son.jpg';
import KCN from '@/assets/KCN.jpg';
import Serum from '@/assets/Serum.jpg';
import ST from '@/assets/ST.jpg';
import SRM from '@/assets/SRM.jpg';
import NHH from '@/assets/nhh.jpg';
import NTT from '@/assets/NTT.jpg';
import MN from '@/assets/mn.jpg';
import { Divider, Row, Col, Button, message } from 'antd';
import ActionButton from '@/Shared/ActionButton';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CategoriesOfInterest: React.FC = () => {
  const imageCategories = [
    { src: Son, name: 'Son', categoryId: 55 },
    { src: KCN, name: 'Kem Chống Nắng', categoryId: 9 },
    { src: Serum, name: 'Serum', categoryId: 40 },
    { src: ST, name: 'Sữa Tắm', categoryId: 64 },
    { src: SRM, name: 'Sữa Rửa Mặt', categoryId: 35 },
    { src: NHH, name: 'Nước hoa hồng', categoryId: 39 },
    { src: NTT, name: 'Nước Tẩy Trang', categoryId: 7 },
    { src: MN, name: 'Mặt nạ', categoryId: 42 },
  ];
  const [showAll, setShowAll] = useState(false);

  const handleImageClick = async (categoryId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/products/category/${categoryId}`
      );
      // Xử lý dữ liệu từ API
      console.log('Dữ liệu sản phẩm:', response.data);
      // Có thể thêm logic để hiển thị sản phẩm hoặc xử lý dữ liệu ở đây
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      message.error('Không thể tải sản phẩm cho danh mục này.');
    }
  };

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
              <Link
                to={`/category/${item.categoryId}`}
                onClick={() => handleImageClick(item.categoryId)}
              >
                <img
                  src={item.src}
                  alt={`categoriesOfInterest-${index}`}
                  className="h-[170px] w-[170px] rounded-md bg-pink-20 object-cover p-2"
                />
              </Link>
              <span className="mt-2 text-sm font-medium">{item.name}</span>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default CategoriesOfInterest;
