import Navbar from '@/components/navbar';
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
// import CartDPage from './components/Cart/CartDetail';
// import CheckoutPage from './components/Cart/checkpage';

function App() {
  const [isTopOfPage, setIsTopOfPage] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsTopOfPage(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Router>
        <header className="fixed top-0 z-10 w-full">
          <Navbar isTopOfPage={isTopOfPage} />
        </header>
        <main className="mt-[195px] flex-grow">
          <Routes>
            <Route path={`/`} element={<Homepage />} />
            <Route path={`/category/:id`} element={<CategoryPage />} />
            <Route path={`/Blog`} element={<BlogPage />} />
            <Route path={`/ProductDetail/:id`} element={<ProductDetail />} />
            <Route path={`/Cart`} element={<Cart />} />

            <Route path={`/ThanhToan`} element={<CheckoutPage />} />
            <Route path={`/CartD`} element={<CartDPage />} />
            <Route path={`/Login`} element={<LoginPage />} />
            <Route path={`/register`} element={<RegisterPage />} />
            <Route path={`/CustomerInfo`} element={<CustomerInfo />} />
          </Routes>
        </main>
        <footer className="mt-4 drop-shadow">
          <Footer />
        </footer>
      </Router>
    </div>
  );
}

export default App;
