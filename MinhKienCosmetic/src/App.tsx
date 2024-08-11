import Navbar from '@/components/navbar';
import { useEffect, useState } from 'react';
import { SelectedPage } from '@/Shared/types';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './scenes/homepage/Homepage';
import MakeupPage from './scenes/MakeUpPage/MakeupPage';
import SkincarePage from './scenes/skincarePage/skincarePage';
import BlogPage from './scenes/BlogPage/BlogPage';
import ProductDetail from './components/ProductDetail/ProductDetail';

function App() {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(
    SelectedPage.TRANG_CHU
  );
  const [isTopOfPage, setIsTopOfPage] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsTopOfPage(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app bg-pink-20">
      <Router>
        <header>
          <Navbar
            isTopOfPage={isTopOfPage}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
          />
        </header>

        <main>
          <Routes>
            <Route
              path={`/`}
              element={<Homepage setSelectedPage={setSelectedPage} />}
            />
            <Route
              path={`/${SelectedPage.TRANG_CHU}`}
              element={<Homepage setSelectedPage={setSelectedPage} />}
            />
            <Route
              path={`/${SelectedPage.TRANG_DIEM}`}
              element={<MakeupPage />}
            />
            <Route
              path={`/${SelectedPage.CHAM_SOC_DA}`}
              element={<SkincarePage />}
            />
            <Route
              path={`/${SelectedPage.BLOG_LAM_DEP}`}
              element={<BlogPage />}
            />
            <Route path={`/ProductDetail`} element={<ProductDetail />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
