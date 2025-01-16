import { useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Logo from '@/assets/logo1.png';
import useMediaQuery from '@/hooks/useMediaQuery';
import SearchBar from './SearchBar';
import CategoryApi from '@/Apis/Categories/Category.api';
import { useNavigate } from 'react-router-dom';
import cartService from '@/Apis/Cart/Cart.api';
import { ICategory } from '@/Apis/Categories/Category.interface';
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Drawer, Menu, Badge } from 'antd';

type Props = {
  isTopOfPage: boolean;
};

const Navbar = ({ isTopOfPage }: Props) => {
  const flexBetween = 'flex items-center justify-between';
  const [username, setUsername] = useState<string | null>(null);
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const [mainCategories, setMainCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ICategory[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [subSubCategories, setSubSubCategories] = useState<ICategory[]>([]);
  const isAboveMediumScreens = useMediaQuery('(min-width:1060px)');
  const navbarBackground = isTopOfPage ? '' : 'drop-shadow bg-pink-20';
  const navigate = useNavigate();

  useEffect(() => {
    const categorizeData = (data: ICategory[]) => {
      const main = data.filter((category) => category.parent_id === '0');
      const sub = data.filter(
        (category) =>
          category.parent_id !== '0' &&
          data.some(
            (parent) =>
              parent.id === category.parent_id && parent.parent_id === '0'
          )
      );
      const subSub = data.filter(
        (category) =>
          category.parent_id !== '0' &&
          data.some(
            (parent) =>
              parent.id === category.parent_id && parent.parent_id !== '0'
          )
      );

      return { main, sub, subSub };
    };

    const fetchCategories = async () => {
      try {
        const data = await CategoryApi.getCategories();
        console.log('Main Categories:', mainCategories);
        console.log('Sub Categories:', subCategories);
        console.log('Sub-Sub Categories:', subSubCategories);
        if (Array.isArray(data) && data.length > 0) {
          const { main, sub, subSub } = categorizeData(data);

          setMainCategories(main);
          setSubCategories(sub);
          setSubSubCategories(subSub);
        } else {
          console.error('API không trả về dữ liệu hợp lệ:', data);
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    setUsername(savedUsername);
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const count = await cartService.getCartById(userId);
          setCartCount(count.result.total);
        }
      } catch (error) {
        console.error('Lỗi khi lấy số lượng giỏ hàng:', error);
      }
    };

    fetchCartCount();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất?');

    if (confirmLogout) {
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiryTime');
      window.location.href = '/login';
    }
  };

  return (
    <nav
      className={`${navbarBackground} fixed top-0 z-30 w-full flex-col bg-pink-50 pt-4`}
    >
      <div className={`${flexBetween} mx-8`}>
        <div className={`${flexBetween} ml-6 w-full gap-4`}>
          {/* Logo */}
          <img
            alt="logo"
            src={Logo}
            className="h-20 w-20 cursor-pointer"
            onClick={() => navigate('/')}
          />

          {/* Search Bar */}
          <div className="w-full max-w-[700px] flex-grow px-2">
            <SearchBar />
          </div>

          {/* Cart and User Actions */}
          <div className="ml-6 flex items-center gap-6">
            {/* Cart */}
            <Link to="/Cart" className="flex items-center">
              <Badge count={cartCount} showZero>
                <ShoppingCartOutlined className="cursor-pointer text-2xl" />
              </Badge>
            </Link>

            {/* User actions */}
            {username ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/CustomerInfo"
                  className="flex items-center hover:underline"
                >
                  <UserOutlined className="mr-2 text-lg" />
                  {username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg border bg-rose-100 px-3 py-1 text-sm font-medium text-red-500 hover:border-red-700"
                >
                  Đăng xuất
                  <LogoutOutlined />
                </button>
              </div>
            ) : (
              <Link
                to="/Login"
                className="rounded-lg border bg-rose-100 px-4 py-1 text-sm font-medium hover:border-pink-500 hover:text-pink-600"
              >
                <UserOutlined className="mr-2" />
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>

      {isAboveMediumScreens ? (
        <div className="relative flex items-center justify-around bg-slate-50">
          <ul className="flex cursor-pointer flex-wrap capitalize">
            {mainCategories.map((category) => (
              <li key={category.id} className="group">
                <Link to={`/category/${category.id}`}>
                  <div className="px-2 py-2 text-center font-sans hover:text-pink-500">
                    {category.name}
                  </div>
                </Link>
                <div className="absolute left-0 top-full hidden w-full bg-white p-4 shadow-lg group-hover:block">
                  {subCategories.some(
                    (sub) => sub.parent_id === category.id
                  ) && (
                    <ul className="grid grid-cols-5 gap-5 p-2 pl-10">
                      {subCategories
                        .filter((sub) => sub.parent_id === category.id)
                        .map((sub) => (
                          <li key={sub.id} className="font-semibold">
                            <Link to={`/category/${sub.id}`}>{sub.name}</Link>
                            {subSubCategories.some(
                              (subSub) => subSub.parent_id === sub.id
                            ) && (
                              <ul className="mt-1 text-left">
                                {subSubCategories
                                  .filter(
                                    (subSub) => subSub.parent_id === sub.id
                                  )
                                  .map((subSub) => (
                                    <li
                                      key={subSub.id}
                                      className="my-1.5 py-1 text-xs font-normal hover:text-pink-500"
                                    >
                                      <Link to={`/category/${subSub.id}`}>
                                        {subSub.name}
                                      </Link>
                                    </li>
                                  ))}
                              </ul>
                            )}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <button
            className="flex rounded-full bg-red-400 p-3"
            onClick={() => setIsMenuToggled(!isMenuToggled)}
          >
            <div className="h-6 w-6">
              {isMenuToggled ? <XMarkIcon /> : <Bars3Icon />}
            </div>
          </button>

          <Drawer
            title="Danh mục"
            placement="left"
            onClose={() => setIsMenuToggled(false)}
            open={isMenuToggled}
            width={300}
          >
            <Menu mode="inline" theme="light">
              {mainCategories.map((category) => (
                <Menu.SubMenu
                  key={category.id}
                  title={
                    <Link to={`/category/${category.id}`}>{category.name}</Link>
                  }
                >
                  {subCategories
                    .filter((sub) => sub.parent_id === category.id)
                    .map((sub) => (
                      <Menu.SubMenu
                        key={sub.id}
                        title={
                          <Link to={`/category/${sub.id}`}>{sub.name}</Link>
                        }
                      >
                        {subSubCategories
                          .filter((subSub) => subSub.parent_id === sub.id)
                          .map((subSub) => (
                            <Menu.Item key={subSub.id}>
                              <Link to={`/category/${subSub.id}`}>
                                {subSub.name}
                              </Link>
                            </Menu.Item>
                          ))}
                      </Menu.SubMenu>
                    ))}
                </Menu.SubMenu>
              ))}
            </Menu>
          </Drawer>
        </>
      )}
    </nav>
  );
};

export default Navbar;
