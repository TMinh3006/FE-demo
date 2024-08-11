import React from 'react';

interface ProductDetailsProps {
  id: string;
  title: string;
  price: number;
}

const Productinfo: React.FC<ProductDetailsProps> = ({ id, title, price }) => {
  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="text-3xl font-bold">title </div>
      <div className="text-[24px]">{price.toFixed(3)}vnd</div>
      <div className="mt-32 flex cursor-pointer gap-4">
        <button className="bor rounded-3xl bg-slate-300 px-10 py-2 hover:bg-slate-400 hover:text-white">
          Thêm vào giỏ hàng
        </button>
        <button className="rounded-3xl border-2 bg-pink-500 px-10 py-2 hover:bg-pink-600 hover:text-white">
          Mua ngay
        </button>
      </div>
    </div>
  );
};

export default Productinfo;
