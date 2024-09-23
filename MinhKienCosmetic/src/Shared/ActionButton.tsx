import AnchorLink from 'react-anchor-link-smooth-scroll';

type Props = {
  children: React.ReactNode;
  parentId: string;
};

const ActionButton = ({ children, parentId }: Props) => {
  return (
    <AnchorLink
      className="rounded-2xl bg-pink-400 px-10 py-2 hover:bg-yellow-20 hover:text-white"
      href={`#${parentId}`}
    >
      {children}
    </AnchorLink>
  );
};

export default ActionButton;
