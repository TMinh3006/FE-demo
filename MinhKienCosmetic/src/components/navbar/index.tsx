import { useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Logo from '@/assets/logo1.png';
import useMediaQuery from '@/hooks/useMediaQuery';
import SearchBar from './SearchBar';
import CategoryApi from '@/Apis/Categories/Category.Api';
import { useNavigate } from 'react-router-dom';
import { ICategory } from '@/Apis/Categories/Category.Interface';

import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

type Props = {
  isTopOfPage: boolean;
};

const Navbar = ({ isTopOfPage }: Props) => {
  const flexBetween = 'flex items-center justify-between';
  const [open, setOpen] = useState(false);
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const [mainCategories, setMainCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ICategory[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<ICategory[]>([]);
  const isAboveMediumScreens = useMediaQuery('(min-width:1060px)');
  const navbarBackground = isTopOfPage ? '' : 'drop-shadow bg-pink-20';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryApi.getCategories();
        if (Array.isArray(data) && data.length > 0) {
          // Xử lý dữ liệu nếu là mảng và có dữ liệu
          const main = data.filter(
            (category: ICategory) => category.parent_id === 0
          );
          const sub = data.filter(
            (category: ICategory) =>
              category.parent_id !== 0 &&
              data.some(
                (parent) =>
                  parent.id === category.parent_id && parent.parent_id === 0
              )
          );
          const subSub = data.filter(
            (category: ICategory) =>
              category.parent_id !== 0 &&
              data.some(
                (parent) =>
                  parent.id === category.parent_id && parent.parent_id !== 0
              )
          );

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
  const userFullName = localStorage.getItem('fullName');

  const handleLogout = () => {
    const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất?');

    if (confirmLogout) {
      localStorage.removeItem('fullName');
      localStorage.removeItem('accessToken');
      navigate('/');
    }
  };
  return (
    <nav
      className={`${navbarBackground} fixed top-0 z-30 w-full flex-col pt-6`}
    >
      <div className={`${flexBetween} mx-auto w-5/6`}>
        <div className={`${flexBetween} w-full gap-2`}>
          <img
            alt="logo"
            src={Logo}
            className="h-20 w-20 cursor-pointer"
            onClick={() => navigate('/')}
          />
          <SearchBar />
          <div className="ml-auto flex items-center gap-8">
            <Link to="/Cart" style={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingCartOutlined
                style={{ fontSize: '35px', cursor: 'pointer' }}
              />
              <span style={{ marginLeft: '8px', fontSize: '18px' }}>1</span>
            </Link>
            {userFullName ? (
              <div className="flex items-center gap-4">
                <Link to="/CustomerInfo" className="text-lg hover:underline">
                  <UserOutlined /> {userFullName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-2xl bg-pink-400 px-4 py-2 hover:bg-red-500"
                >
                  <LogoutOutlined />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                to="/Login"
                className="rounded-2xl bg-pink-400 px-10 py-2 hover:bg-yellow-20 hover:text-white"
              >
                <UserOutlined />
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
                  <div className="px-3 py-4 text-center font-sans text-lg hover:text-pink-500">
                    {category.name}
                  </div>
                </Link>
                <div className="absolute left-0 top-full hidden w-full bg-white shadow-lg group-hover:block">
                  {subCategories.some(
                    (sub) => sub.parent_id === category.id
                  ) && (
                    <ul className="grid grid-cols-6 gap-5 p-4">
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
        <button
          className="flex rounded-full bg-red-400 p-3"
          onClick={() => setIsMenuToggled(!isMenuToggled)}
        >
          <div className="h-6 w-6" onClick={() => setOpen(!open)}>
            {open ? <XMarkIcon /> : <Bars3Icon />}
          </div>
        </button>
      )}
      {/* Mobile Menu Modal */}
      {!isAboveMediumScreens && isMenuToggled && (
        <div className="absolute bottom-0 h-full w-[300px] bg-white py-2 pl-4">
          {/* Menu Items */}
          <div
            className={
              'flex cursor-pointer flex-col gap-10 px-3 py-7 text-left'
            }
          >
            <ul>
              {mainCategories.map((category) => (
                <h1 className="py-5" key={category.id}>
                  {category.name}
                </h1>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
