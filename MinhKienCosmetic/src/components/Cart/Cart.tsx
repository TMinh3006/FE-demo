import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyCartImage from '@/assets/cart0.png';
import CartApi from '@/Apis/Cart/Cart.api';
import { AddToCartRequest, ICartItem } from '@/Apis/Cart/Cart.interface';
import { DeleteOutlined } from '@ant-design/icons';

const Cart = () => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  const getCart = async () => {
    try {
      const id = localStorage.getItem('id');
      if (id === null) return;

      const response = await CartApi.getCartById(id);
      console.log(response);
      setCartItems(response);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getCart();
  }, []);

  const decreaseQuantity = async (
    productId: number,
    currentQuantity: number
  ) => {
    try {
      const userId = localStorage.getItem('id');
      if (!userId || currentQuantity <= 1) return;

      const amountToDecrease = 1;
      await CartApi.decreaseQuantity(userId, productId, amountToDecrease);
      console.log(`Số lượng của sản phẩm ID ${productId} đã được giảm.`);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - amountToDecrease }
            : item
        )
      );
      getCart();
    } catch (error) {
      console.error('Không thể giảm số lượng sản phẩm:', error);
    }
  };
  const increaseQuantity = async (productId: number) => {
    try {
      const userId = localStorage.getItem('id');
      if (userId === null) return;

      const quantityToAdd = 1;
      const data: AddToCartRequest = {
        product_id: productId,
        quantity: quantityToAdd,
      };
      await CartApi.increaseQuantity(userId, data);
      console.log(`Số lượng của sản phẩm ID ${productId} đã được tăng.`);

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        )
      );
      getCart();
    } catch (error) {
      console.error('Không thể tăng số lượng sản phẩm:', error);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      const userId = localStorage.getItem('id');
      if (userId === null) return;

      // Xác nhận trước khi xóa sản phẩm
      const confirmDelete = window.confirm(
        'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?'
      );
      if (!confirmDelete) return;

      await CartApi.removeCart(userId, cartItemId);
      console.log(`Mục giỏ hàng với ID ${cartItemId} đã được xóa.`);
      getCart();
    } catch (error) {
      console.error('Không thể xóa mục giỏ hàng:', error);
    }
  };
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto max-w-6xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">GIỎ HÀNG</h1>

        <div className="lg:grid-cols-[2fr_1fr] grid grid-cols-1 gap-6">
          {/* Sản phẩm */}
          <div className="rounded bg-white p-6 shadow">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="mb-4 flex items-center justify-between border-b pb-4"
                >
                  <div className="flex items-center">
                    {/*<input
                      type="checkbox"
                      className="mr-2"
                      checked={item.isSelected}
                      onChange={() => toggleSelectItem(item.id)}
                    />*/}
                    <img
                      className="h-24 w-24 object-cover"
                      src={item.product.thumbnails[0]}
                    />

                    <div className="ml-4">
                      <h2 className="text-lg font-semibold">
                        {item.product.name}
                      </h2>
                      <p className="text-gray-500">
                        Đơn giá: {item.price.toLocaleString()}đ
                      </p>
                      {item.price === 0 && (
                        <span className="mt-2 inline-block rounded bg-red-100 px-2 py-1 text-sm text-red-500">
                          Quà tặng miễn phí
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <button
                        className="bg-gray-200 px-3 py-1 text-sm"
                        onClick={() =>
                          decreaseQuantity(item.product.id, item.quantity)
                        }
                      >
                        -
                      </button>
                      <span className="mx-2 text-lg">{item.quantity}</span>
                      <button
                        className="bg-gray-200 px-3 py-1 text-sm"
                        onClick={() => increaseQuantity(item.product.id)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-red-500"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center font-normal">
                <img
                  src={EmptyCartImage}
                  alt="Giỏ hàng trống"
                  className="h-40 w-40"
                />

                <p className="mt-4 text-base">Giỏ hàng của bạn đang trống.</p>
                <Link
                  to="/"
                  className="mt-6 rounded-3xl bg-pink-500 px-6 py-3 font-bold text-white hover:bg-pink-400"
                >
                  TIẾP TỤC MUA HÀNG
                </Link>
              </div>
            )}
          </div>

          {/* Thông tin đơn hàng */}
          <div className="rounded bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Thông Tin Đơn Hàng</h2>
            <div className="flex justify-between text-gray-600">
              <span>Tổng sản phẩm đã chọn</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính</span>
              <span>{totalPrice.toLocaleString()}₫</span>
            </div>
            <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
              <span>Tổng thanh toán</span>
              <span className="text-red-500">
                {totalPrice.toLocaleString()}₫
              </span>
            </div>
            <div className="mt-4 flex justify-center">
              <Link to="/Checkout">
                <button className="rounded-3xl bg-orange-500 px-20 py-2 text-white hover:bg-orange-400">
                  ĐẶT HÀNG
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
