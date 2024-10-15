import React, { useState } from 'react';
import { IProduct } from '@/Apis/Product/Product.interface';
import { AddToCartRequest } from '@/Apis/Product/Product.interface';
import cartService from '@/Apis/Product/Product.api';

const Productinfo: React.FC<IProduct> = ({ id, name, price, brand }) => {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  const handleAddToCart = async () => {
    const userId = localStorage.getItem('id');
    const accessToken = localStorage.getItem('accessToken');

    if (!userId || !accessToken) {
      console.error('User ID hoặc accessToken không tồn tại.');
      return;
    }

    const data: AddToCartRequest = { price, product_id: id, quantity };
    console.log('Data to send:', data);
    try {
      await cartService.addToCart(userId, data);
      console.log(cartService);
      setMessage('Đã thêm vào giỏ hàng!');
      console.log('Đã thêm vào giỏ hàng!');
    } catch (error) {
      setMessage('Có lỗi xảy ra khi thêm vào giỏ hàng.');
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-6 font-bold">
      <div className="text-3xl">{name}</div>
      <div className="font-normal">Thương hiệu: {brand.name}</div>
      <div className="text-red-500">{price.toLocaleString()}đ</div>
      <div className="mt-40 flex gap-2">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} // Prevent going below 1
            className="rounded bg-white px-3 py-1 hover:bg-gray-300"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} // Ensure min value is 1
            min="1"
            className="w-16 rounded border p-2 text-center"
          />
          <button
            type="button"
            onClick={() => setQuantity((prev) => prev + 1)}
            className="rounded bg-white px-3 py-1 hover:bg-gray-300"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="rounded-3xl bg-slate-300 px-10 py-6 hover:bg-slate-400 hover:text-white"
        >
          THÊM VÀO GIỎ HÀNG
        </button>
        <button className="rounded-3xl border-2 bg-pink-500 px-10 py-6 hover:bg-pink-600 hover:text-white">
          MUA NGAY
        </button>
      </div>
      {message && <div className="mt-4 text-green-500">{message}</div>}
    </div>
  );
};

export default Productinfo;
