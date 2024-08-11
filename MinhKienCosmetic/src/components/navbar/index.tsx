import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Logo from '@/assets/logo1.png';
import Link from './Link';
import { SelectedPage } from '@/Shared/types';
import useMediaQuery from '@/hooks/useMediaQuery';
import ActionButton from '@/Shared/ActionButton';
import SearchBar from './SearchBar';

type Props = {
  isTopOfPage: boolean;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
};

const Navbar = ({ isTopOfPage, selectedPage, setSelectedPage }: Props) => {
  const flexBetween = 'flex items-center justify-between';
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const isAboveMediumScreens = useMediaQuery('(min-width:1060px)');
  const navbarBackground = isTopOfPage ? '' : 'drop-shadow bg-white';

  return (
    <nav
      className={`${navbarBackground} fixed top-0 z-30 h-24 w-full flex-col gap-20 py-6`}
    >
      <div className={`${flexBetween} mx-auto w-5/6`}>
        <div className={`${flexBetween} w-full gap-16`}>
          {/* LEFT SIDE */}
          <img alt="logo" src={Logo} className="h-20 w-20" />
          <SearchBar />
          {/* RIGHT SIDE */}
          {isAboveMediumScreens ? (
            <div className={`${flexBetween} w-full`}>
              <div className={`${flexBetween} gap-8 text-sm font-bold`}>
                <Link
                  page={SelectedPage.TRANG_CHU}
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                />
                <Link
                  page={SelectedPage.TRANG_DIEM}
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                />
                <Link
                  page={SelectedPage.CHAM_SOC_DA}
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                />
                <Link
                  page={SelectedPage.BLOG_LAM_DEP}
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                />
              </div>
              <div className={`${flexBetween} gap-8 font-bold`}>
                <p>Giỏ hàng</p>
                <ActionButton setSelectedPage={setSelectedPage}>
                  Đăng nhập
                </ActionButton>
              </div>
            </div>
          ) : (
            <button
              className="rounded-full bg-pink-400 p-2"
              onClick={() => setIsMenuToggled(!isMenuToggled)}
            >
              <Bars3Icon className="h-6 w-6 text-white" />
            </button>
          )}
        </div>
      </div>
      {/* Mobile Menu Modal */}
      {!isAboveMediumScreens && isMenuToggled && (
        <div className="fixed bottom-0 right-0 z-40 h-full w-[300px] bg-white drop-shadow-xl">
          {/* Close icon */}
          <div className="flex justify-end p-12">
            <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
              <XMarkIcon className="h-6 w-6 text-black" />
            </button>
          </div>
          {/* Menu Items */}
          <div className={'ml-[33%] flex flex-col gap-10 text-xl'}>
            <Link
              page="TRANG CHỦ"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <Link
              page="TRANG ĐIỂM"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <Link
              page="CHĂM SÓC DA"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <Link
              page="BLOG LÀM ĐẸP"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
