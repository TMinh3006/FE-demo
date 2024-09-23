import React from 'react';

const Footer: React.FC = () => {
  return (
    <div>
      <footer className="bg-purple-20 flex flex-col items-center justify-center py-4 font-thin text-amber-900">
        <div className="text-xl font-bold">
          Cảm ơn quý khách đã tin dùng sản phẩm của MinhKienCosmetic{' '}
        </div>
        <div>Địa chỉ: 33E/1 HT22, Hiệp thành, Quận 12</div>
        <div>Số điện thoại: 0348281713</div>
        <div>Email: MinhKienCosmetic@gmail.com</div>
      </footer>
    </div>
  );
};

export default Footer;
