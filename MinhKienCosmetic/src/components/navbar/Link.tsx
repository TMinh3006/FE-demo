import { SelectedPage } from '@/Shared/types';
import { Link as RouterLink } from 'react-router-dom';

type Props = {
  page: SelectedPage;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
};

const Link = ({ page, selectedPage, setSelectedPage }: Props) => {
  return (
    <RouterLink
      className={`${selectedPage === page ? 'text-pink-500' : ''} transition duration-500`}
      to={`/${page}`}
      onClick={() => setSelectedPage(page)}
    >
      {page.replace(/-/g, ' ').toUpperCase()}
    </RouterLink>
  );
};

export default Link;
