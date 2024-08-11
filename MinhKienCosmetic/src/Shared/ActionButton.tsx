import AnchorLink from 'react-anchor-link-smooth-scroll';
import { SelectedPage } from './types';

type Props = {
  children: React.ReactNode;
  setSelectedPage: (value: SelectedPage) => void;
};

const ActionButton = ({ children, setSelectedPage }: Props) => {
  return (
    <AnchorLink
      className="rounded-2xl bg-yellow-20 px-10 py-2 hover:bg-pink-400 hover:text-white"
      onClick={() => setSelectedPage}
      href={`#${SelectedPage}`}
    >
      {children}
    </AnchorLink>
  );
};

export default ActionButton;
