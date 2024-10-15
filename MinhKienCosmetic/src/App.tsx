import Navbar from '@/components/navbar';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './scenes/Homepage/Homepage';
import BlogPage from './scenes/BlogPage/BlogPage';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Footer from './components/Footer/Footer';
import Cart from './components/Cart/Cart';
import LoginPage from './components/Loginout/Login';
import RegisterPage from './components/Loginout/Register';
import CategoryPage from './scenes/CategoryPage/CategoryPage';
import CustomerInfo from './components/Customer/CustomerInfor';
import CheckoutPage from './components/Cart/CheckoutPage';
import OrderSuccessPage from './components/Cart/OrderSuccess';
import OrderList from './components/Customer/OrderList';
import AdminLayout from './components/Admin/AdminLayout';
import CategoryList from './components/Admin/Dashboard/CategoryList';
import ProductList from './components/Admin/Dashboard/ProductList';
import UserList from './components/Admin/Dashboard/UserList';
import Orderlist from './components/Admin/Dashboard/OrderList';
import React from 'react';
import OrderDetail from './components/Customer/DetailOrder';
import BrandPage from './components/Brands/BrandPage';

const PrivateAdminRoute: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');

  if (!token || role !== '1') {
    return <Navigate to="/Login" replace />;
  }

  return children;
};

function App() {
  const [isTopOfPage, setIsTopOfPage] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsTopOfPage(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen flex-col">
      <Router>
        {!isAdminPath && (
          <header className="fixed top-0 z-10 w-full">
            <Navbar isTopOfPage={isTopOfPage} />
          </header>
        )}
        <main className={`flex-grow ${isAdminPath ? '' : 'mt-[195px]'}`}>
          <Routes>
            <Route path={`/`} element={<Homepage />} />
            <Route path={`/category/:id`} element={<CategoryPage />} />
            <Route path={`/Blog`} element={<BlogPage />} />
            <Route path={`/ProductDetail/:id`} element={<ProductDetail />} />
            <Route path={'/brand/:id'} element={<BrandPage />} />
            <Route path={`/Cart`} element={<Cart />} />
            <Route path={`/Checkout`} element={<CheckoutPage />} />
            <Route path={`/SuccessPage`} element={<OrderSuccessPage />} />
            <Route path={`/orders`} element={<OrderList />} />
            <Route path="/order/:id" element={<OrderDetail />} />
            <Route path={`/Login`} element={<LoginPage />} />
            <Route path={`/register`} element={<RegisterPage />} />
            <Route path={`/CustomerInfo`} element={<CustomerInfo />} />

            <Route
              path="/admin"
              element={
                <PrivateAdminRoute>
                  <AdminLayout />
                </PrivateAdminRoute>
              }
            >
              <Route path="products" element={<ProductList />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="users" element={<UserList />} />
              <Route path="orders" element={<Orderlist />} />
            </Route>
          </Routes>
        </main>
        {!isAdminPath && (
          <footer className="mt-4 drop-shadow">
            <Footer />
          </footer>
        )}
      </Router>
    </div>
  );
}

export default App;
