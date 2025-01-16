import React, { useEffect, useState } from 'react';
import { IProductDetail } from '@/Apis/Product/Product.interface';
import { AddToCartRequest } from '@/Apis/Product/Product.interface';
import { IBrands } from '@/Apis/Brands/Brands.interface';
import cartService from '@/Apis/Product/Product.api';
import apiBrand from '@/Apis/Brands/Brand.api';
import { notification } from 'antd';

const Productinfo: React.FC<IProductDetail> = ({
  id,
  name,
  price,
  brandId,
  quantity,
  thumbnails,
  ingredient,
  userManual,
  newPrice,
  sold,
  description,
}) => {
  const [cartQuantity, setCartQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [brand, setBrand] = useState<IBrands | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      console.log('brandid', brand);
      try {
        const brand = await apiBrand.getBrandId(brandId);
        setBrand(brand);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setBrand(null);
      }
    };

    if (brandId) {
      fetchBrand();
    }
  }, [brandId]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem('userId');
    const accessToken = localStorage.getItem('accessToken');

    if (!userId || !accessToken) {
      notification.warning({
        message: 'Yêu cầu đăng nhập',
        description: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.',
        duration: 3,
      });
      return;
    }

    const data: AddToCartRequest = {
      price,
      productId: id,
      quantity: cartQuantity,
    };

    try {
      await cartService.addToCart(userId, data);
      console.log(cartService);
      notification.success({
        message: 'Thêm giỏ hàng thành công',

        duration: 1,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setMessage('Có lỗi xảy ra khi thêm vào giỏ hàng.');
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-2 font-bold">
      <div className="text-xl">{name}</div>
      <div className="font-bold">
        Thương hiệu:{' '}
        <span className="font-normal">
          {brand ? brand.name : 'Không xác định'}
        </span>
      </div>
      <div className="font-bold">
        Kho: <span className="font-normal">{quantity}</span>
      </div>
      <div className="font-bold">
        Mô tả: <span className="font-light">{description}</span>
      </div>
      <div className="flex items-center space-x-9">
        {newPrice && newPrice < price ? (
          <div className="flex space-x-2">
            <div className="text-base font-light line-through">
              {price.toLocaleString()}đ
            </div>
            <div className="text-base font-semibold text-red-600">
              {newPrice.toLocaleString()}đ
            </div>
          </div>
        ) : (
          <div className="text-base font-semibold text-red-600">
            {price.toLocaleString()}đ
          </div>
        )}
        <div className="font-medium text-slate-700">
          Đã bán: <span className="font-bold">{sold ? sold : 0}</span>
        </div>
      </div>
      <div className="mt-16 flex gap-2">
        <div className="flex h-auto items-center space-x-2 rounded-xl border border-black">
          <button
            type="button"
            onClick={() => setCartQuantity((prev) => Math.max(1, prev - 1))}
            className="rounded bg-white px-2 py-0.5 hover:bg-gray-300"
          >
            -
          </button>
          <input
            type="number"
            value={cartQuantity}
            onChange={(e) =>
              setCartQuantity(Math.max(1, Number(e.target.value)))
            }
            min="1"
            className="w-16 text-center"
          />
          <button
            type="button"
            onClick={() => setCartQuantity((prev) => prev + 1)}
            className="rounded bg-white px-2 py-0.5 hover:bg-gray-300"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex items-center rounded-3xl bg-yellow-400 px-10 py-2 hover:bg-yellow-300"
        >
          THÊM VÀO GIỎ HÀNG
        </button>
      </div>
      {message && <div className="mt-4 text-green-500">{message}</div>}
    </div>
  );
};

export default Productinfo;
