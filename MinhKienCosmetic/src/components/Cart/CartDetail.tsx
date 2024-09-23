//không sài
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   description: string;
//   thumbnails: string[];
//   ingredient: string[];
//   category: {
//     id: number;
//     name: string;
//     parent_id: number;
//   };
//   brand: {
//     id: number;
//     name: string;
//   };
// }

// interface OrderDetail {
//   id: number;
//   product: Product;
//   price: number;
//   numberOfProducts: number;
//   totalMoney: number;
// }

// interface Order {
//   id: number;
//   address: string;
//   user_id: number;
//   fullname: string;
//   email: string;
//   phone_number: string;
//   note: string;
//   order_date: string;
//   status: string;
//   total_money: number;
//   shipping_address: string;
//   shipping_method: string;
//   order_details: OrderDetail[];
// }

// const CartDPage: React.FC = () => {
//   const [order, setOrder] = useState<Order | null>(null);

//   useEffect(() => {
//     axios
//       .get<Order>('http://localhost:8080/api/v1/orders/2')
//       .then((response) => {
//         setOrder(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching the order:', error);
//       });
//   }, []);

//   const decreaseQuantity = (id: number) => {
//     console.log('Decrease quantity for product ID:', id);
//   };

//   const increaseQuantity = (id: number) => {
//     console.log('Increase quantity for product ID:', id);
//   };

//   const handleRemoveItem = (id: number) => {
//     console.log('Remove item with ID:', id);
//   };

//   if (!order) {
//     return <p>Loading...</p>;
//   }

//   const totalPrice = order.order_details.reduce(
//     (total, item) => total + item.totalMoney,
//     0
//   );
//   const cartItems = order.order_details;

//   return (
//     <div className="min-h-screen bg-gray-100 py-10">
//       <div className="container mx-auto max-w-6xl">
//         <h1 className="mb-4 text-3xl font-bold text-gray-800">GIỎ HÀNG</h1>

//         <div className="lg:grid-cols-[2fr_1fr] grid grid-cols-1 gap-6">
//           {/* Sản phẩm */}
//           <div className="rounded bg-white p-6 shadow">
//             {cartItems.length > 0 ? (
//               cartItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="mb-4 flex items-center justify-between border-b pb-4"
//                 >
//                   <div className="flex items-center">
//                     <img
//                       className="h-24 w-24 object-cover"
//                       src={item.product.thumbnails[0]}
//                       alt={item.product.name}
//                     />
//                     <div className="ml-4">
//                       <h2 className="text-lg font-semibold">
//                         {item.product.name}
//                       </h2>
//                       <p className="text-gray-500">
//                         Đơn giá: {item.price.toLocaleString()}₫
//                       </p>
//                       {item.price === 0 && (
//                         <span className="mt-2 inline-block rounded bg-red-100 px-2 py-1 text-sm text-red-500">
//                           Quà tặng miễn phí
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="mt-2 flex items-center justify-center">
//                     <button
//                       className="bg-gray-200 px-3 py-1 text-sm"
//                       onClick={() => decreaseQuantity(item.id)}
//                     >
//                       -
//                     </button>
//                     <span className="mx-2 text-lg">
//                       {item.numberOfProducts}
//                     </span>
//                     <button
//                       className="bg-gray-200 px-3 py-1 text-sm"
//                       onClick={() => increaseQuantity(item.id)}
//                     >
//                       +
//                     </button>
//                   </div>
//                   <button
//                     className="text-red-500"
//                     onClick={() => handleRemoveItem(item.id)}
//                   >
//                     Xóa
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <div className="flex flex-col items-center justify-center font-normal">
//                 <p className="mt-4 text-base">Giỏ hàng của bạn đang trống.</p>
//                 <Link
//                   to="/"
//                   className="mt-6 rounded-3xl bg-pink-500 px-6 py-3 font-bold text-white hover:bg-pink-400"
//                 >
//                   TIẾP TỤC MUA HÀNG
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Thông tin đơn hàng */}
//           <div className="rounded bg-white p-6 shadow">
//             <h2 className="mb-4 text-lg font-semibold">Thông Tin Đơn Hàng</h2>
//             <div className="flex justify-between text-gray-600">
//               <span>Tổng sản phẩm đã chọn</span>
//               <span>{cartItems.length}</span>
//             </div>
//             <div className="flex justify-between text-gray-600">
//               <span>Tạm tính</span>
//               <span>{totalPrice.toLocaleString()}₫</span>
//             </div>
//             <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
//               <span>Tổng thanh toán</span>
//               <span className="text-red-500">
//                 {totalPrice.toLocaleString()}₫
//               </span>
//             </div>
//             <div className="mt-4 flex justify-center">
//               <Link to="/ThanhToan">
//                 <button className="rounded-3xl bg-orange-500 px-20 py-2 text-white hover:bg-orange-400">
//                   ĐẶT HÀNG
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartDPage;
