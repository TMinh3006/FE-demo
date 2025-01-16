import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from '@ant-design/icons';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <div>
      <footer className="bg-rose-50 py-6 text-amber-900">
        <div className="container mx-auto grid grid-cols-1 gap-10 text-center md:grid-cols-3 md:text-left">
          {/* Cột 1: Thông tin liên hệ */}
          <div>
            <h3 className="mb-4 text-xl font-bold">Liên hệ</h3>
            <p className="text-sm">Địa chỉ: 33E/1 HT22, Hiệp Thành, Quận 12</p>
            <p className="text-sm">Số điện thoại: 0348281713</p>
            <p className="text-sm">Email: MinhKienCosmetic@gmail.com</p>
          </div>

          {/* Cột 2: Phương thức thanh toán */}
          <div>
            <h3 className="mb-4 gap-6 text-xl font-bold">
              Phương thức thanh toán
            </h3>
            <div className="flex justify-center gap-4 md:justify-start">
              <img
                src="https://down-vn.img.susercontent.com/file/d4bbea4570b93bfd5fc652ca82a262a8"
                alt="Visa"
                className="mt-2 h-[30px] w-[80px] object-cover"
              />
              <img
                src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
                alt="VNPay"
                className="h-[50px] w-[80px] object-cover"
              />
              <img
                src="https://static.ybox.vn/2021/9/4/1631756121713-1631085786958-Thi%E1%BA%BFt%20k%E1%BA%BF%20kh%C3%B4ng%20t%C3%AAn%20-%202021-09-08T002253.248.png"
                alt="MoMo"
                className="h-[50px] w-[60px] object-cover"
              />
              <img
                src="https://down-vn.img.susercontent.com/file/2c46b83d84111ddc32cfd3b5995d9281"
                alt="COD"
                className="h-[50px] w-[80px] object-cover"
              />
            </div>
          </div>

          {/* Cột 3: Theo dõi mạng xã hội */}
          <div>
            <h3 className="mb-4 text-xl font-bold">Theo dõi chúng tôi</h3>
            <div className="flex flex-col items-center gap-4 md:items-start">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:text-blue-600"
              >
                <FacebookOutlined /> Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:text-pink-500"
              >
                <InstagramOutlined /> Instagram
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:text-blue-400"
              >
                <TwitterOutlined /> Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
