import { Link as RouterLink } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
  page: string;
};

const CustomLink = ({ children, page }: Props) => {
  const path = `/${page.replace(/\s+/g, '_')}`;
  return (
    <RouterLink className={'transition duration-500'} to={path}>
      {children}
    </RouterLink>
  );
};

export default CustomLink;
