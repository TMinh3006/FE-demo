import React from 'react';
import blog1 from '@/assets/blog1.png';
import blog2 from '@/assets/blog2.png';
import blog3 from '@/assets/blog3.jpg';
import blog4 from '@/assets/blog4.png';
import { Col, Divider, Row } from 'antd';

const BlogPage: React.FC = () => {
  const NewsATip = [
    {
      img: blog1,
      name: 'CHĂM DA CHUẨN HÀN - NHẬT & SĂN QUÀ KHỦNG| TỔNG GIÁ TRỊ LÊN ĐẾN 400 TRIỆU',
      detail:
        'Số 429 phần quà SIÊU HẤP DẪN khi nàng tham dự “CHECK-IN CHALLENGE” tại 13 cửa hàng Guardian duy nhất...',
    },
    {
      img: blog2,
      name: 'Duft and Doft - Bí quyết cho cơ thể luôn thơm ngát ',
      detail:
        'Với mùi hương tựa nước hoa cao cấp cùng 100 giờ tạo nên thành phẩm, Duft and Doft sẽ là sự lựa chọn...',
    },
    {
      img: blog3,
      name: 'Giảm mụn ngay từ bước làm sạch với sữa rửa mặt cho da mụn, bạn có tin?',
      detail:
        'Với kết cấu dạng gel tạo bọt, vừa đủ độ êm ái, sữa rửa mặt Eucerin Pro Acne 3X Cleanser hạn chế tối...',
    },
    {
      img: blog4,
      name: 'MAKEUP TUYỆT ĐỈNH - TỰ TIN TUYỆT ĐỐI | QUÀ TẶNG TÚI XINH CHỈ CÓ TẠI GUARDIAN THÁNG 8 NÀY!',
      detail:
        ' “Cosmetic Fair” với sự góp mặt các siêu phẩm makeup thịnh hành cùng chuỗi hoạt động khám phá...',
    },
  ];

  return (
    <div>
      <Divider
        orientation="left"
        style={{ fontSize: '30px', fontWeight: '700' }}
      >
        Tin Tức & Cẩm Nang Làm Đẹp
      </Divider>
      <Row className="flex items-center justify-center p-6" gutter={16}>
        {NewsATip.map((item, index) => (
          <Col
            className="m-3 flex w-60 flex-col items-center justify-center rounded-md bg-white py-2 font-bold"
            key={index}
            span={5}
          >
            <img
              src={item.img}
              alt={item.name}
              className="h-full w-full rounded-md object-cover"
            />

            <div className="mt-2 w-full">
              <button className="truncate-limit-custom w-full text-sm font-semibold">
                {item.name}
              </button>
            </div>

            <div className="truncate-limit-custom mt-1 w-full text-xs text-gray-500">
              {item.detail}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BlogPage;
