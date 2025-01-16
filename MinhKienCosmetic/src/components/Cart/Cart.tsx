import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyCartImage from '@/assets/cart0.png';
import CartApi from '@/Apis/Cart/Cart.api';
import {
  ICartItem,
  Response,
  AddToCartRequest,
} from '@/Apis/Cart/Cart.Interface';
import { DeleteOutlined } from '@ant-design/icons';
import ProductApi from '@/Apis/Product/Product.api';
import { IProductDetail } from '@/Apis/Product/Product.interface';
import { message } from 'antd';

const Cart = () => {
  const [cartItems, setCartItems] = useState<
    (ICartItem & { product?: IProductDetail; selected: boolean })[]
  >([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId === null) return;
      const cartData = await CartApi.getCartById(userId);

      console.log('Cart data:', cartData);

      if (!cartData || !cartData.result || !cartData.result.cartItemIds) {
        console.warn('No cart data found or invalid structure.');
        setCartItems([]);
        return;
      }

      const cartItems = cartData.result.cartItemIds;

      if (!cartItems || cartItems.length === 0) {
        console.warn('No items in cart');
        setCartItems([]);
        return;
      }

      const cartWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const productResponse = await ProductApi.getById(item.productId);
          console.log('Product data:', productResponse);
          return {
            ...item,
            product: productResponse.result,
            selected: false,
          };
        })
      );
      setCartItems(cartWithDetails);
      calculateTotalPrice(cartWithDetails);
    } catch (error) {
      console.error('error fetching cart:', error);
    }
  };

  useEffect(() => {
    calculateTotalPrice(cartItems);
    fetchCart();
  }, []);

  const calculateTotalPrice = (
    items: (ICartItem & { product?: IProductDetail; selected: boolean })[]
  ) => {
    const total = items.reduce((sum, item) => {
      if (item.selected) {
        const price =
          item.product?.newPrice && item.product.newPrice > 0
            ? item.product.newPrice
            : item.product?.price || 0;
        return sum + price * item.quantity;
      }
      return sum;
    }, 0);
    setTotalPrice(total);
  };

  const toggleSelectItem = (cartItemId: string) => {
    setCartItems((prev) => {
      const updatedItems = prev.map((item) =>
        item.id === cartItemId ? { ...item, selected: !item.selected } : item
      );
      calculateTotalPrice(updatedItems);
      return updatedItems;
    });
  };

  const increaseQuantity = async (
    cartItemId: string,
    productId: string,
    price: number,
    newPrice: number,
    discount: number
  ) => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId === null) return;
      const data: AddToCartRequest = {
        productId,
        quantity: 1,
        price,
        newPrice,
        discount,
      };
      const response = await CartApi.increaseQuantity(userId, data);
      if (response) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === cartItemId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
        fetchCart();
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  const decreaseQuantity = async (
    cartItemId: string,
    productId: string,
    currentQuantity: number
  ) => {
    if (currentQuantity <= 1) {
      message.warning('Không thể giảm số lượng dưới 1.');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      if (userId === null) return;

      const quantityToReduce = 1;

      const response: Response = await CartApi.decreaseQuantity(
        userId,
        productId,
        quantityToReduce
      );
      if (response) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === cartItemId
              ? { ...item, quantity: item.quantity - quantityToReduce }
              : item
          )
        );
        fetchCart();
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId === null) return;

      const confirmDelete = window.confirm(
        'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?'
      );
      if (!confirmDelete) return;

      await CartApi.removeCart(userId, cartItemId);
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      window.location.reload();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
  const handlePlaceOrder = () => {
    const selectedItems = cartItems.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      message.warning('Bạn chưa chọn sản phẩm nào để đặt hàng.');
      return;
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-10 px-20">
      <div className="container mx-auto max-w-6xl">
        <h1 className="mb-4 text-xl font-bold text-gray-800">GIỎ HÀNG</h1>

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
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={item.selected}
                      onChange={() => toggleSelectItem(item.id)}
                    />

                    <img
                      className="h-20 w-20 object-cover"
                      src={item.product?.thumbnails?.[0]}
                    />

                    <div className="ml-4">
                      <Link to={`/ProductDetail/${item.product?.id}`}>
                        <h2 className="text-sm font-semibold">
                          {item.product?.name}
                        </h2>
                      </Link>

                      <p className="font-medium text-gray-500">
                        {item.product?.newPrice &&
                        item.product.newPrice < item.product.price ? (
                          <div className="flex space-x-2">
                            <div className="text-base font-light text-gray-500 line-through">
                              {item.product.price.toLocaleString()}đ
                            </div>
                            <div className="text-base font-semibold text-red-600">
                              {item.product.newPrice.toLocaleString()}đ
                            </div>
                          </div>
                        ) : (
                          <div className="text-base font-semibold text-red-600">
                            {item.product?.price?.toLocaleString()}đ
                          </div>
                        )}
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
                          decreaseQuantity(
                            item.id,
                            item.productId,
                            item.quantity
                          )
                        }
                      >
                        -
                      </button>
                      <span className="mx-2 text-lg">{item.quantity}</span>
                      <button
                        className="bg-gray-200 px-3 py-1 text-sm"
                        onClick={() =>
                          increaseQuantity(
                            item.id,
                            item.productId,
                            item.price,
                            item.newPrice || 0,
                            item.product?.discount || 0
                          )
                        }
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
              <span>{cartItems.filter((item) => item.selected).length}</span>
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
              {cartItems.filter((item) => item.selected).length > 0 ? (
                <Link to="/Checkout">
                  <button
                    className="rounded-3xl bg-orange-500 px-20 py-2 text-white hover:bg-orange-400"
                    onClick={handlePlaceOrder}
                  >
                    ĐẶT HÀNG
                  </button>
                </Link>
              ) : (
                <button
                  className="cursor-not-allowed rounded-3xl bg-gray-400 px-20 py-2 text-white"
                  disabled
                >
                  ĐẶT HÀNG
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
